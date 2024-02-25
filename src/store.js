// src/store.js

import { configureStore } from '@reduxjs/toolkit';
import companySlice from './slices/companySlice';
import employeeSlice from './slices/employeeSlice';
import planSlice from './slices/planSlice';


const loggerMiddleware = store => next => action => {
  return next(action);
};

const store = configureStore({
  reducer: {
    company: companySlice,
    employee: employeeSlice,
    plan: planSlice,
  },
  middleware: (getDefaultMiddleware) => getDefaultMiddleware().concat(loggerMiddleware)
});

store.subscribe(() => {
});


export default store;
