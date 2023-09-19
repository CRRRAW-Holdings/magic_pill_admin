// src/store.js

import { configureStore } from '@reduxjs/toolkit';
import companySlice from './slices/companySlice';
import employeeSlice from './slices/employeeSlice';
import authSlice from './slices/authSlice';


const loggerMiddleware = store => next => action => {
  return next(action);
};

const store = configureStore({
  reducer: {
    auth: authSlice,
    company: companySlice,
    employee: employeeSlice,
  },
  middleware: (getDefaultMiddleware) => getDefaultMiddleware().concat(loggerMiddleware)
});

store.subscribe(() => {
  console.log(store.getState());
});


export default store;
