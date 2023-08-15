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
import 'react-toastify/dist/ReactToastify.css';
import { toast } from 'react-toastify';
import { ToastContainer } from 'react-toastify';


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
  LockedTooltip,
  StyledSearchBar,
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
  const [isAddEmployeeDialogOpen, setIsAddEmployeeDialogOpen] = useState(false);
  const [isEditEmployeeDialogOpen, setIsEditEmployeeDialogOpen] = useState(false);
  const [isComparisonDialogOpen, setIsComparisonDialogOpen] = useState(false);
  const [searchQuery, setSearchQuery] = useState('');

  console.log(searchQuery);
  const processedCsvData = useSelector((state) => state.employee.processedCsvData) || [];
  useEffect(() => {
    dispatch(fetchEmployees(companyId));
  }, [companyId, dispatch]);

  const fileRef = useRef(null);

  const filteredEmployees = employees.filter(employee => {
    const searchTerm = searchQuery.toLowerCase();
    return (
      employee.username.toLowerCase().includes(searchTerm) ||
      employee.email.toLowerCase().includes(searchTerm)
    );
  });

  const handleSearch = (value) => {
    setSearchQuery(value);
  };

  const editEmployee = (employee) => {
    dispatch(selectEmployee(employee));
    setIsEditEmployeeDialogOpen(true);
  };

  const toggleEmployeeStatus = (employee) => {
    dispatch(toggleEmployeeStatusThunk(employee.user_id))
      .then((value) => {
        console.log(value.payload,'val');
        toast.success('Employee toggle successful');
      })
      .catch(() => {
        toast.error('Failed to toggle employee status!');
      });
  };  

  const handleFileChange = (e) => {
    const file = e.target.files[0];
    processFile(
      file,
      employees,
      (comparedData) => {
        dispatch(setProcessedCsvData(comparedData));
        toast.success('CSV processed successfully!');
        setIsComparisonDialogOpen(true);
      },
      (error) => {
        toast.error('Error processing CSV!');
        console.error(error);
      }
    );
  };  

  return (
    <StyledPaper>
      <ToastContainer
        position="top-right"
        autoClose={5000}
        hideProgressBar={false}
        newestOnTop={false}
        closeOnClick
        rtl={false}
        pauseOnFocusLoss
        draggable
        pauseOnHover
      />
      <div style={{ textAlign: 'center' }}>
        <CompanyName>{companyName}</CompanyName>
        <ActualCompanyName>Employee Management</ActualCompanyName>
      </div>
      <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
        <AddEmployeeButton variant="contained" onClick={() => setIsAddEmployeeDialogOpen(true)}>
          Add Employee
        </AddEmployeeButton>
        <StyledSearchBar onChange={(e) => handleSearch(e.target.value)} />
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
              <HeaderCell>Company Name</HeaderCell>
              <HeaderCell>Plan ID</HeaderCell>
              <HeaderCell>Actions</HeaderCell>
            </TableRow>
          </TableHead>
          <TableBody>
            {filteredEmployees.map((employee) => (
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
                <StyledTableCell>{employee.magic_pill_plan_id}</StyledTableCell>
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
      {selectedEmployee && <EditEmployeeDialog open={isEditEmployeeDialogOpen} onClose={() => setIsEditEmployeeDialogOpen(false)} companyId={companyId} employee={selectedEmployee} />}
      <ComparisonDialog open={isComparisonDialogOpen} onClose={() => setIsComparisonDialogOpen(false)} processedCsvData={processedCsvData} />
    </StyledPaper>
  );
}

export default Employee;
