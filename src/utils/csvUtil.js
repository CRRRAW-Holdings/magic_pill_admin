// Form utility functions related to CSV handling

/**
 * Validates if the provided file type is CSV.
 * @param {string} fileName - The name of the uploaded file.
 * @returns {boolean} - True if the file is CSV, false otherwise.
 */
export const isValidFileType = (fileName) => {
  return /.csv$/i.test(fileName);
};

/**
 * Validates if the file size is within an acceptable range.
 * @param {number} fileSize - The size of the uploaded file in bytes.
 * @returns {boolean} - True if the file size is acceptable, false otherwise.
 */
export const isValidFileSize = (fileSize) => {
  const maxSize = 5 * 1024 * 1024; // Example: 5MB
  return fileSize <= maxSize;
};

/**
 * Reads the content of the uploaded CSV file.
 * @param {File} file - The uploaded file object.
 * @param {Function} onSuccess - Callback function to execute on successful file read.
 * @param {Function} onError - Callback function to execute on file read error.
 */
export const readFileContent = (file, onSuccess, onError) => {
  if (file && isValidFileType(file.name) && isValidFileSize(file.size)) {
    const reader = new FileReader();

    reader.onload = (event) => {
      onSuccess(event.target.result);
    };

    reader.onerror = () => {
      onError('Error reading the file.');
    };

    reader.readAsText(file);
  } else {
    onError('Invalid file type or size.');
  }
};
