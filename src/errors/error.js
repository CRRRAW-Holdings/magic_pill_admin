class ProcessingError extends Error {
  constructor(message, errorCode) {
    super(message);
    this.name = 'ProcessingError';
    this.errorCode = errorCode;
    if (Error.captureStackTrace) {
      Error.captureStackTrace(this, ProcessingError);
    }
  }
}

export default ProcessingError;
