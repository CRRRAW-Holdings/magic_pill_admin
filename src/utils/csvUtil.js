import Papa from 'papaparse';
import * as XLSX from 'xlsx';
import {
  getPlanIdFromName,
  getCompanyNameFromInsuranceId,
} from './mappingUtils';

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
  return Papa.parse(content, {
    header: true,
    dynamicTyping: true,
    skipEmptyLines: true
  }).data;
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

const formatDateToYYYYMMDD = (dateString) => {
  const date = new Date(dateString);
  const year = date.getFullYear();
  const month = String(date.getMonth() + 1).padStart(2, '0');
  const day = String(date.getDate()).padStart(2, '0');

  return `${year}-${month}-${day}`;
};

const transformEmployee = (employee, companies, plans) => {
  const { email, dob, first_name, insurance_company_id, plan_name, is_active, address, last_name, phone, is_dependant } = employee;
  const formattedDOB = formatDateToYYYYMMDD(dob);
  return {
    email: email,
    dob: formattedDOB,
    username: `${email}_${formattedDOB}_${insurance_company_id}`,
    insurance_company_id: insurance_company_id,
    magic_pill_plan_id: getPlanIdFromName(plan_name, plans),
    is_active: is_active,
    address: address,
    company: getCompanyNameFromInsuranceId(insurance_company_id, companies),
    first_name: first_name,
    last_name: last_name,
    phone: phone,
    is_dependant: is_dependant,
  };
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
  'is_dependant'
];


const hasDifferences = (oldEmployee, newEmployee) => {
  let differencesFound = false;
  for (const key of required_fields) {
    if (oldEmployee[key] !== newEmployee[key]) {
      console.log(`Field: ${key}, Old Value: ${oldEmployee[key]}, New Value: ${newEmployee[key]}`);
      differencesFound = true;
    }
  }
  return differencesFound;
};

const compareFileWithCurrentData = (fileContent, employees, companies, plans) => {
  let results = [];
  let processedUsernames = [];

  fileContent.forEach(fileEmployee => {
    const transformedEmployeeFromFile = transformEmployee(fileEmployee, companies, plans);

    const matchedEmployees = employees.filter(emp =>
      emp.email === transformedEmployeeFromFile.email &&
      emp.insurance_company_id === transformedEmployeeFromFile.insurance_company_id &&
      emp.dob === transformedEmployeeFromFile.dob
    );

    if (matchedEmployees.length === 1) {
      const matchedEmployee = matchedEmployees[0];

      if (matchedEmployee.first_name === transformedEmployeeFromFile.first_name && matchedEmployee.dob === transformedEmployeeFromFile.dob) {
        if (hasDifferences(matchedEmployee, transformedEmployeeFromFile)) {
          results.push({
            action: 'update',
            user_data: {
              ...transformedEmployeeFromFile,
              user_id: matchedEmployee.user_id
            }
          });
        }

        if (transformedEmployeeFromFile.is_active === false) {
          results.push({
            action: 'toggle',
            user_data: {
              ...transformedEmployeeFromFile,
              user_id: matchedEmployee.user_id
            }
          });
        }
      } else {
        results.push({
          action: 'add',
          user_data: transformedEmployeeFromFile,
        });
      }

      processedUsernames.push(transformedEmployeeFromFile.username);
      employees = employees.filter(emp => emp.username !== matchedEmployee.username);
    } else {
      results.push({
        action: 'add',
        username: transformedEmployeeFromFile.username,
        user_data: transformedEmployeeFromFile
      });
      processedUsernames.push(transformedEmployeeFromFile.username);
    }
  });

  console.log('finalEmployeeBeforeSend', results);
  console.log('oldEmployees', employees);
  return results;
};



export const processFile = (file, employees, companies, plans, onSuccess, onError) => {
  if (!isFileValid(file)) {
    onError('Invalid file type or size. Max allowed size: 25MB');
    return;
  }

  readFileContent(
    file,
    (parsedData) => {
      console.log(parsedData, 'parsedData');
      const comparedData = compareFileWithCurrentData(parsedData, employees, companies, plans);
      onSuccess(comparedData);
    },
    onError
  );
};
