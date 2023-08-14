import React, { useEffect, useState, useRef } from 'react';
import { useParams } from 'react-router-dom';
import { useSelector, useDispatch } from 'react-redux';
import {
  fetchEmployees,
  selectEmployee,
  toggleEmployeeStatusThunk,
  uploadCSVThunk,
} from '../slices/employeeSlice';
import { isValidFileType, isValidFileSize, readFileContent } from '../utils/csvUtil';

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

const defaultEmployees = [];

function Employee() {
  const { id: companyId } = useParams();
  const dispatch = useDispatch();
  const employees = useSelector((state) => state.employee?.employees || defaultEmployees);
  const companyName = useSelector((state) => state.employee.companyName);
  const selectedEmployee = useSelector((state) => state.employee.selectedEmployee);
  const [csvData, setCsvData] = useState(null);
  const [sessionId, setSessionId] = useState(null);
  const [csvUploadSuccess, setCsvUploadSuccess] = useState(false);
  const hasError = useSelector((state) => state.employee?.hasError);
  const errorMessage = useSelector((state) => state.employee?.errorMessage);
  const [isAddEmployeeDialogOpen, setIsAddEmployeeDialogOpen] = useState(false);
  const [isEditEmployeeDialogOpen, setIsEditEmployeeDialogOpen] = useState(false);

  console.log(companyId, 'companyID');
  console.log(csvData, sessionId);
  console.log(selectedEmployee,'selected');

  useEffect(() => {
    dispatch(fetchEmployees(companyId));
  }, [companyId, dispatch]);

  const fileRef = useRef(null);

  const editEmployee = (employee) => {
    dispatch(selectEmployee(employee));
    setIsEditEmployeeDialogOpen(true);
  };


  const toggleEmployeeStatus = (employeeId) => {
    dispatch(toggleEmployeeStatusThunk(employeeId));
  };

  const handleFileChange = (e) => {
    const file = e.target.files[0];

    // Use the utilities to validate the file
    if (isValidFileType(file.name) && isValidFileSize(file.size)) {
      readFileContent(
        file,
        (content) => {
          // Store the raw CSV content
          setCsvData(content);

          // Dispatch the thunk action to upload the CSV data
          dispatch(uploadCSVThunk(content))
            .then((action) => {
              if (action.type === 'employee/uploadCSV/fulfilled') {
                // Update the state to indicate success
                setCsvUploadSuccess(true);

                // If the server returns a session ID or some unique identifier, 
                // store it in the state
                if (action.payload.sessionId) {
                  setSessionId(action.payload.sessionId);
                }
              } else {
                // Reset csvData and sessionId since upload failed
                setCsvData(null);
                setSessionId(null);
                setCsvUploadSuccess(false);
              }
            });
        },
        (error) => {
          console.error(error);
          // Reset the state in case of an error reading the file
          setCsvData(null);
          setSessionId(null);
          setCsvUploadSuccess(false);
        }
      );
    } else {
      // This is when the file is not a valid CSV or exceeds the size limit
      console.error('Invalid file type or size.');
      // Reset the state in case of a file validation error
      setCsvData(null);
      setSessionId(null);
      setCsvUploadSuccess(false);
    }
  };





  return (
    <StyledPaper>
      <CompanyName>Employee Management</CompanyName>
      <ActualCompanyName>{companyName}</ActualCompanyName>
      {csvUploadSuccess && (
        <div style={{ color: 'green', textAlign: 'center', marginBottom: '10px' }}>
          CSV uploaded successfully!
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
                    <DisableButton variant="contained" onClick={() => toggleEmployeeStatus(employee.user_id)}>Disable</DisableButton>
                  ) : (
                    <EnableButton variant="contained" onClick={() => toggleEmployeeStatus(employee.user_id)}>Enable</EnableButton>
                  )}
                </StyledTableCell>
              </EmployeeRow>
            ))}
          </TableBody>
        </StyledTable>
      </StyledTableContainer>
      <AddEmployeeDialog open={isAddEmployeeDialogOpen} onClose={() => setIsAddEmployeeDialogOpen(false)} companyId={companyId} />
      <EditEmployeeDialog open={isEditEmployeeDialogOpen} onClose={() => setIsEditEmployeeDialogOpen(false)} companyId={companyId} employee={selectedEmployee}/>
    </StyledPaper>
  );
}

export default Employee;
