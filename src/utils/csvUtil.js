import Papa from 'papaparse';
import * as XLSX from 'xlsx';

const isValidFileType = (fileName) => {
  return /.csv$/i.test(fileName) || /\.xls(x)?$/i.test(fileName);

};

const isValidFileSize = (fileSize) => {
  const maxSize = 5 * 1024 * 1024; // Example: 5MB
  return fileSize <= maxSize;
};

const isFileValid = (file) => {
  return file && isValidFileType(file.name) && isValidFileSize(file.size);
};

const parseCSV = (content) => {
  console.log(content, 'content');
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
      // Fallback for browsers that don't support readAsBinaryString
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
    onError('Unsupported file type.');
  }
};
const transformFileEmployee = (employee) => {
  return {
    username: employee[''],
    email: employee._1,
    insurance_company_id: employee._3,
    magic_pill_plan_id: employee._2,
  };
};

const transformTempEmployee = (tempEmployee) => {
  // Transform the employee into the desired structure
  return {
    username: tempEmployee.username,  // Replace 'someField' with the actual field names
    email: tempEmployee.email,
    insurance_company_id: tempEmployee.anotherField, // Adjust accordingly
    magic_pill_plan_id: tempEmployee.yetAnotherField, // Adjust accordingly
    // Add other fields if needed
  };
};

const compareFileWithCurrentData = (fileContent, employees) => {
  console.log(fileContent, 'fileContent');
  let results = [];

  let tempEmployees = [...employees]; 

  // Ignore the first two entries in the fileContent
  for (let index = 2; index < fileContent.length; index++) {
    const fileEmployee = fileContent[index];
    const transformedEmployee = transformFileEmployee(fileEmployee);

    const match = tempEmployees.find(emp => emp.username === transformedEmployee.username);

    if (match) {
      if (JSON.stringify(match) !== JSON.stringify(transformedEmployee)) {
        results.push({ ...transformedEmployee, action: 'update' });
      }
      // Remove the matched employee so they won't be marked as 'disable'
      tempEmployees = tempEmployees.filter(emp => emp.username !== transformedEmployee.username);
    } else {
      results.push({ ...transformedEmployee, action: 'add' });
    }
  }

  tempEmployees.forEach(employee => {
    const transformedTempEmployee = transformTempEmployee(employee);
    results.push({ ...transformedTempEmployee, action: 'disable' });
  });

  console.log(results, 'RESULTS');
  return results;
};



export const processFile = (file, employees, onSuccess, onError) => {
  if (!isFileValid(file)) {
    onError('Invalid file type or size.');
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