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
  const result = Papa.parse(content, {
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
  for (const record of parsedData) {
    if (!record.email || !record.dob /* ... other validations */) {
      throw new ProcessingError('Invalid data: missing required fields.', 'VALIDATION_ERROR');
    }
    // ... other validations
  }
};

const transformEmployee = (employee, companies, plans) => {
  try {
    const { email, dob, first_name, insurance_company_id, plan_name, is_active, address, last_name, phone, is_dependent } = employee;
    const formattedDOB = formatDateToYYYYMMDD(dob);

    const formattedPhone = typeof phone === 'number'
      ? phone.toString()
      : phone.replace(/[^0-9-]/g, '');


    return {
      email: email,
      dob: formattedDOB,
      username: `${email}_${formattedDOB}_${insurance_company_id}_${first_name}"}`,
      insurance_company_id: insurance_company_id,
      magic_pill_plan_id: getPlanIdFromName(plan_name, plans),
      is_active: is_active,
      address: address,
      company: getCompanyNameFromInsuranceId(insurance_company_id, companies),
      first_name: first_name,
      last_name: last_name,
      phone: formattedPhone,
      is_dependent: is_dependent,
    };
  } catch (error) {
    throw new ProcessingError('Error transforming employee data: ' + error.message, 'TRANSFORM_ERROR');
  }
};

const required_fields = [
  'username',
  'email',
  'first_name',
  'insurance_company_id',
  'magic_pill_plan_id',
  'last_name',
  'phone',
  'address',
  'dob',
  'is_active',
  'is_dependent'
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

const compareFileWithCurrentData = (fileContent, employees, companies, plans, companyId) => {
  let results = [];
  let processedUsernames = [];

  fileContent.forEach(fileEmployee => {
    const transformedEmployeeFromFile = transformEmployee(fileEmployee, companies, plans);

    const matchedEmployees = employees.filter(emp =>
      emp.email === transformedEmployeeFromFile.email &&
      emp.insurance_company_id === transformedEmployeeFromFile.insurance_company_id &&
      (emp.dob === transformedEmployeeFromFile.dob || emp.first_name === transformedEmployeeFromFile.first_name)
    );
    console.log('***' + transformedEmployeeFromFile.username);
    if (matchedEmployees.length === 1) {
      const matchedEmployee = matchedEmployees[0];
      const isActiveChanged = matchedEmployee.is_active !== transformedEmployeeFromFile.is_active;
      const diffResult = hasDifferences(matchedEmployee, transformedEmployeeFromFile, ['is_active']);

      if (matchedEmployee.is_active && isActiveChanged && !diffResult.differencesFound) {
        results.push({
          action: 'toggle',
          user_data: {
            ...transformedEmployeeFromFile,
            user_id: matchedEmployee.user_id
          }
        });
      } else if (diffResult.differencesFound) {
        results.push({
          action: 'update',
          user_data: {
            ...transformedEmployeeFromFile,
            user_id: matchedEmployee.user_id,
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