import { toast } from 'react-toastify';

export const showSuccessToast = (message) => {
  toast.success(message, {
    position: toast.POSITION.TOP_CENTER
  });
};

export const showErrorToast = (message) => {
  toast.error(message, {
    position: toast.POSITION.TOP_CENTER
  });
};

export const showInfoToast = (message) => {
  toast.info(message, {
    position: toast.POSITION.TOP_CENTER
  });
};
