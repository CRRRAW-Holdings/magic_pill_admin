import Papa from 'papaparse';
import * as XLSX from 'xlsx';
import {
  getPlanIdFromName,
  getCompanyNameFromInsuranceId,
} from './mappingUtils';
import { formatDateToYYYYMMDD } from './fieldUtil';
import ProcessingError from '../errors/error';

const isValidFileType = (fileName) => {
  return /.csv$/i.test(fileName) || /\.xls(x)?$/i.test(fileName);
};

const isValidFileSize = (fileSize) => {
  const maxSize = 25 * 1024 * 1024; // 25MB
  return fileSize <= maxSize;
};

const isFileValid = (file) => {
  return file && isValidFileType(file.name) && isValidFileSize(file.size);
};

const parseCSV = (content) => {
  const trimmedContent = content.trim();
  const result = Papa.parse(trimmedContent, {
    header: true,
    dynamicTyping: true,
    skipEmptyLines: true,
    error: function(error, file) {
      throw new ProcessingError('File Type and format issue', error);
    }
  });
  return result.data;
};

const parseXLSX = (content) => {
  const workbook = XLSX.read(content, { type: 'binary', cellDates: true });
  const firstSheetName = workbook.SheetNames[0];
  const worksheet = workbook.Sheets[firstSheetName];
  return XLSX.utils.sheet_to_json(worksheet);
};

const readFileContent = (file, onSuccess, onError) => {
  const reader = new FileReader();
  const fileType = file.name.split('.').pop().toLowerCase();

  reader.onerror = () => {
    onError('Error reading the file.');
  };

  if (file.type === 'text/csv') {
    reader.onload = (event) => {
      onSuccess(parseCSV(event.target.result));
    };
    reader.readAsText(file);
  } else if (fileType === 'xlsx' || fileType === 'xls') {
    if (reader.readAsBinaryString) {
      reader.onload = (event) => {
        onSuccess(parseXLSX(event.target.result));
      };
      reader.readAsBinaryString(file);
    } else {
      reader.onload = function (evt) {
        let data = new Uint8Array(evt.target.result);
        let binaryString = '';
        data.forEach((byte) => {
          binaryString += String.fromCharCode(byte);
        });
        onSuccess(parseXLSX(binaryString));
      };
      reader.readAsArrayBuffer(file);
    }
  } else {
    onError(`Unsupported file type: ${fileType}`);
  }
};

const validateData = (parsedData) => {
  console.log(parsedData);
  for (const record of parsedData) {
    console.log(record);
    if (!record.email || !record.dob /* ... other validations */) {
      throw new ProcessingError('Invalid data: missing required fields.', 'VALIDATION_ERROR');
    }
    // ... other validations
  }
};

const transformEmployee = (employee, companies, plans) => {
  try {
    const { email, dob, firstName, companyId, planName, isActive, address, lastName, phone, isDependant } = employee;
    const formattedDOB = formatDateToYYYYMMDD(dob);

    const formattedPhone = typeof phone === 'number'
      ? phone.toString()
      : phone.replace(/[^0-9-]/g, '');


    return {
      email: email,
      dob: formattedDOB,
      username: `${email}_${formattedDOB}_${companyId}_${firstName}`,
      companyId: companyId,
      planId: getPlanIdFromName(planName, plans),
      isActive: isActive,
      address: address,
      company: getCompanyNameFromInsuranceId(companyId, companies),
      firstName: firstName,
      lastName: lastName,
      phone: formattedPhone,
      isDependant: isDependant,
    };
  } catch (error) {
    throw new ProcessingError('Error transforming employee data: ' + error.message, 'TRANSFORM_ERROR');
  }
};

const required_fields = [
  'username',
  'email',
  'firstName',
  'companyId',
  'planId',
  'lastName',
  'phone',
  'address',
  'dob',
  'isActive',
  'isDependant'
];

const hasDifferences = (oldEmployee, newEmployee, ignoreFields = []) => {
  let differencesFound = false;
  let changedFields = [];
  for (const key of required_fields) {
    if (!ignoreFields.includes(key) && oldEmployee[key] !== newEmployee[key]) {
      console.log(`Field: ${key}`, `Old Value: ${oldEmployee[key]}`, ` New Value: ${newEmployee[key]}`);
      differencesFound = true;
      changedFields.push(key);
    }
  }
  return { differencesFound, changedFields };
};
// const hasDifferences = (oldEmployee, newEmployee, ignoreFields = []) => {
//   let differencesFound = false;
//   let changedFields = [];
//   // Get the keys from each object, filtering out the ignored fields
//   const oldKeys = Object.keys(oldEmployee).filter(key => !ignoreFields.includes(key));
//   const newKeys = Object.keys(newEmployee).filter(key => !ignoreFields.includes(key));
//   // Check for missing or extra fields
//   const allKeys = new Set([...oldKeys, ...newKeys]);  // Combine and deduplicate keys from both objects

//   for (const key of allKeys) {
//     if (!oldKeys.includes(key)) {
//       console.log(`Extra Field in New Employee: ${key}`);
//       differencesFound = true;
//     } else if (!newKeys.includes(key)) {
//       console.log(`Missing Field in New Employee: ${key}`);
//       differencesFound = true;
//     } else if (oldEmployee[key] !== newEmployee[key]) {
//       console.log(`Field: ${key}`, `Old Value: ${oldEmployee[key]}`, ` New Value: ${newEmployee[key]}`);
//       differencesFound = true;
//       changedFields.push(key);
//     }
//   }

//   return { differencesFound, changedFields };
// };

const compareFileWithCurrentData = (fileContent, employees, companies, plans, companyId) => {
  let results = [];
  let processedUsernames = [];

  fileContent.forEach(fileEmployee => {
    const transformedEmployeeFromFile = transformEmployee(fileEmployee, companies, plans);

    const matchedEmployees = employees.filter(emp =>
      emp.email === transformedEmployeeFromFile.email &&
      emp.companyId === transformedEmployeeFromFile.companyId &&
      (emp.dob === transformedEmployeeFromFile.dob || emp.firstName === transformedEmployeeFromFile.firstName)
    );
    console.log('***' + transformedEmployeeFromFile.username);
    if (matchedEmployees.length === 1) {
      const matchedEmployee = matchedEmployees[0];
      const isActiveChanged = matchedEmployee.isActive !== transformedEmployeeFromFile.isActive;
      const diffResult = hasDifferences(matchedEmployee, transformedEmployeeFromFile, ['isActive']);

      if (matchedEmployee.isActive && isActiveChanged && !diffResult.differencesFound) {
        results.push({
          action: 'toggle',
          user_data: {
            ...transformedEmployeeFromFile,
            documentId: matchedEmployee.documentId
          }
        });
      } else if (diffResult.differencesFound) {
        results.push({
          action: 'update',
          user_data: {
            ...transformedEmployeeFromFile,
            documentId: matchedEmployee.documentId,
          },
          changedFields: diffResult.changedFields
        });
      }
      processedUsernames.push(transformedEmployeeFromFile.username);
      employees = employees.filter(emp => emp.username !== matchedEmployee.username);
    } else if (matchedEmployees.length > 1) {
      throw new ProcessingError('Duplicate data found for: ' + JSON.stringify(transformedEmployeeFromFile), 'DUPLICATE_DATA_ERROR');
    } else {
      results.push({
        action: 'add',
        username: transformedEmployeeFromFile.username,
        user_data: transformedEmployeeFromFile
      });
      processedUsernames.push(transformedEmployeeFromFile.username);
    }
  });
  console.log(results);
  return results;
};


export const processFile = (file, employees, companies, plans, companyId, onSuccess, onError) => {
  try {
    if (!isFileValid(file)) {
      throw new ProcessingError('Invalid file type or size. Max allowed size: 25MB', 'FILE_VALIDATION_ERROR');
    }

    readFileContent(
      file,
      (parsedData) => {
        validateData(parsedData);
        const comparedData = compareFileWithCurrentData(parsedData, employees, companies, plans, companyId);
        onSuccess(comparedData);
      },
      onError
    );
  } catch (error) {
    if (error instanceof ProcessingError) {
      onError(error.message);
    } else {
      onError('An unexpected error occurred.');
    }
  }
};