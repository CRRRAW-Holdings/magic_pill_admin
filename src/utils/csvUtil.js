import Papa from 'papaparse';
import * as XLSX from 'xlsx';

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
  const workbook = XLSX.read(content, { type: 'binary' });
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

const transformEmployee = (employee) => {
  const formattedDOB = new Date(employee.dob).toLocaleDateString('en-GB'); // Converts date to 'day/month/year' format
  return {
    email: employee.email,
    dob: formattedDOB,
    username: `${employee.email}_${formattedDOB}`, 
    insurance_company_id: employee.insurance_company_id,
    plan_name: employee.plan_name,
    is_active: employee.is_active,
    address: employee.address,
    company: employee.company,
    first_name: employee.first_name,
    last_name: employee.last_name,
    phone: employee.phone,
    is_dependent: employee.is_dependent,
    magic_pill_plan_id: employee.magic_pill_plan_id,
  };
};

const hasDifferences = (oldEmployee, newEmployee) => {
  for (const key in oldEmployee) {
    if (oldEmployee[key] !== newEmployee[key]) {
      return true;
    }
  }
  return false;
};

const compareFileWithCurrentData = (fileContent, employees) => {
  let results = [];
  let processedUsernames = [];

  fileContent.forEach(fileEmployee => {
    const transformedEmployeeFromFile = transformEmployee(fileEmployee);

    const matchedEmployee = employees.find(emp => emp.email === transformedEmployeeFromFile.email);

    if (matchedEmployee) {
      if (hasDifferences(matchedEmployee, transformedEmployeeFromFile)) {
        results.push({
          action: 'update',
          username: transformedEmployeeFromFile.username,
          user_data: transformedEmployeeFromFile
        });
      }
      processedUsernames.push(transformedEmployeeFromFile.username);
      employees = employees.filter(emp => emp.username !== transformedEmployeeFromFile.username);
    } else {
      results.push({
        action: 'add',
        username: transformedEmployeeFromFile.username,
        user_data: transformedEmployeeFromFile
      });
      processedUsernames.push(transformedEmployeeFromFile.username);
    }
  });

  employees
    .filter(emp => !processedUsernames.includes(emp.username))
    .forEach(remainingEmployee => {
      const transformedRemainingEmployee = transformEmployee(remainingEmployee);
      results.push({
        action: 'toggle',
        username: transformedRemainingEmployee.username,
        user_data: transformedRemainingEmployee,
      });
    });

  return results;
};

// ... Rest of the code remains the same


export const processFile = (file, employees, onSuccess, onError) => {
  if (!isFileValid(file)) {
    onError('Invalid file type or size. Max allowed size: 25MB');
    return;
  }

  readFileContent(
    file,
    (parsedData) => {
      const comparedData = compareFileWithCurrentData(parsedData, employees);
      onSuccess(comparedData);
    },
    onError
  );
};
