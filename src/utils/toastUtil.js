import { toast } from 'react-toastify';

export const showSuccessToast = (message) => {
  showSuccessToast(message, {
    position: toast.POSITION.TOP_CENTER
  });
};

export const showErrorToast = (message) => {
  showErrorToast(message, {
    position: toast.POSITION.TOP_CENTER
  });
};

export const showInfoToast = (message) => {
  showInfoToast(message, {
    position: toast.POSITION.TOP_CENTER
  });
};
