import Papa from 'papaparse';
import * as XLSX from 'xlsx';
// import {
//   getPlanIdFromName,
//   getCompanyNameFromInsuranceId,
// } from './mappingUtils';
// import { formatDateToYYYYMMDD } from './fieldUtil';
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
  for (const record of parsedData) {
    if (!record.email || !record.dob /* ... other validations */) {
      throw new ProcessingError('Invalid data: missing required fields.', 'VALIDATION_ERROR');
    }
  }
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
        onSuccess(parsedData);
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