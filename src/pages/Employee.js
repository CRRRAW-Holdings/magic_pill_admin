import React, { useEffect, useState, useRef } from 'react';
import { useParams } from 'react-router-dom';
import { useSelector, useDispatch } from 'react-redux';
import {
  fetchEmployees,
  selectEmployee,
  toggleEmployeeStatusThunk,
  setProcessedCsvData,
} from '../slices/employeeSlice';
import { processFile } from '../utils/csvUtil';

import {
  TableBody,
  TableHead,
  TableRow,
} from '@mui/material';
import LockIcon from '@mui/icons-material/Lock';
import {
  StyledPaper,
  ActualCompanyName,
  CompanyName,
  AddEmployeeButton,
  UploadCSVButton,
  StyledTableContainer,
  StyledTable,
  EmployeeRow,
  StyledTableCell,
  HeaderCell,
  EditButton,
  DisableButton,
  EnableButton,
  LockedTooltip
} from '../styles/styledComponents';

import AddEmployeeDialog from './AddEmployeeDialog';
import EditEmployeeDialog from './EditEmployeeDialog';
import ComparisonDialog from './ComparisonDialog';


const defaultEmployees = [];

function Employee() {
  const { id: companyId } = useParams();
  const dispatch = useDispatch();
  const employees = useSelector((state) => state.employee?.employees || defaultEmployees);
  const companyName = useSelector((state) => state.employee.companyName);
  const selectedEmployee = useSelector((state) => state.employee.selectedEmployee);
  // const [isUploadSuccessful, setIsUploadSuccessful] = useState(false);
  const hasError = useSelector((state) => state.employee?.hasError);
  const errorMessage = useSelector((state) => state.employee?.errorMessage);
  const [isAddEmployeeDialogOpen, setIsAddEmployeeDialogOpen] = useState(false);
  const [isEditEmployeeDialogOpen, setIsEditEmployeeDialogOpen] = useState(false);
  const [isComparisonDialogOpen, setIsComparisonDialogOpen] = useState(false);  // State for controlling the ComparisonDialog open/close
  const [updateSuccess, setUpdateSuccess] = useState(false);

  const processedCsvData = useSelector((state) => state.employee.processedCsvData) || [];

  console.log(selectedEmployee,'selectedEmployee',processedCsvData);
  useEffect(() => {
    dispatch(fetchEmployees(companyId));
  }, [companyId, dispatch]);

  const fileRef = useRef(null);

  const editEmployee = (employee) => {
    console.log(employee);
    dispatch(selectEmployee(employee));
    setIsEditEmployeeDialogOpen(true);
  };

  const toggleEmployeeStatus = (employee) => {
    dispatch(selectEmployee(employee));
    dispatch(toggleEmployeeStatusThunk(employee.user_id));
  };


  const handleFileChange = (e) => {
    const file = e.target.files[0];
  
    processFile(
      file,
      employees,
      (comparedData) => {
        console.log(comparedData);
        dispatch(setProcessedCsvData(comparedData));
        setIsComparisonDialogOpen(true);
      },
      (error) => {
        console.error(error);
        // Handle the error, e.g., set error state or display a notification.
      }
    );
  };



  return (
    <StyledPaper>
      <CompanyName>Employee Management</CompanyName>
      <ActualCompanyName>{companyName}</ActualCompanyName>
      {updateSuccess && (
        <div style={{ color: 'green', textAlign: 'center', marginBottom: '10px' }}>
          Employee updated successfully!
        </div>
      )}
      {hasError && (
        <div style={{ color: 'red', textAlign: 'center', marginBottom: '10px' }}>
          {errorMessage}
        </div>
      )}
      <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
        <AddEmployeeButton variant="contained" onClick={() => setIsAddEmployeeDialogOpen(true)}>
          Add Employee
        </AddEmployeeButton>
        <input type="file" ref={fileRef} style={{ display: 'none' }} onChange={handleFileChange} />
        <UploadCSVButton variant="contained" onClick={() => fileRef.current.click()}>
          Upload Company CSV
        </UploadCSVButton>
      </div>
      <StyledTableContainer>
        <StyledTable>
          <TableHead>
            <TableRow>
              <HeaderCell>Username</HeaderCell>
              <HeaderCell>Email</HeaderCell>
              <HeaderCell>Actions</HeaderCell>
            </TableRow>
          </TableHead>
          <TableBody>
            {employees.map((employee) => (
              <EmployeeRow key={employee.user_id} isActive={employee.is_active}>
                <StyledTableCell>
                  {employee.is_active ? (
                    employee.username
                  ) : (
                    <LockedTooltip title="Employee is disabled">
                      <div style={{ display: 'flex', alignItems: 'center' }}>
                        <LockIcon color="error" style={{ marginRight: '8px' }} />
                        {employee.username}
                      </div>
                    </LockedTooltip>
                  )}
                </StyledTableCell>
                <StyledTableCell>{employee.email}</StyledTableCell>
                <StyledTableCell>
                  <EditButton variant="contained" onClick={() => editEmployee(employee)}>Edit</EditButton>
                  {employee.is_active ? (
                    <DisableButton variant="contained" onClick={() => toggleEmployeeStatus(employee)}>Disable</DisableButton>
                  ) : (
                    <EnableButton variant="contained" onClick={() => toggleEmployeeStatus(employee)}>Enable</EnableButton>
                  )}
                </StyledTableCell>
              </EmployeeRow>
            ))}
          </TableBody>
        </StyledTable>
      </StyledTableContainer>
      <AddEmployeeDialog open={isAddEmployeeDialogOpen} onClose={() => setIsAddEmployeeDialogOpen(false)} companyId={companyId} />
      {selectedEmployee &&<EditEmployeeDialog open={isEditEmployeeDialogOpen} onClose={() => setIsEditEmployeeDialogOpen(false)} companyId={companyId} employee={selectedEmployee} setUpdateSuccess={setUpdateSuccess} />}
      <ComparisonDialog open={isComparisonDialogOpen} onClose={() => setIsComparisonDialogOpen(false)} processedCsvData={processedCsvData}/>
    </StyledPaper>
  );
}

export default Employee;
