// src/store.js

import { configureStore } from '@reduxjs/toolkit';
import loginReducer from './slices/loginSlice';
import companySlice from './slices/companySlice';
import employeeSlice from './slices/employeeSlice';

const loggerMiddleware = store => next => action => {
  console.log('dispatching', action);
  return next(action);
};

const store = configureStore({
  reducer: {
    login: loginReducer,
    company: companySlice,
    employee: employeeSlice,
  },
  middleware: (getDefaultMiddleware) => getDefaultMiddleware().concat(loggerMiddleware)
});

store.subscribe(() => {
  console.log(store.getState());
});


export default store;
