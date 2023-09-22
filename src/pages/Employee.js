import React, { useEffect, useState, useRef } from 'react';
import { useParams } from 'react-router-dom';
import { useSelector, useDispatch } from 'react-redux';
import {
  fetchEmployees,
  selectEmployee,
  toggleEmployeeStatusThunk,
  setProcessedCsvData,
} from '../slices/employeeSlice';
import { fetchCompanies } from '../slices/companySlice';
import { fetchPlans } from '../slices/planSlice'; // Import fetchPlans

import { processFile } from '../utils/csvUtil';
import { toast } from 'react-toastify';


import {
  TableBody,
  TableHead,
  TableRow,
} from '@mui/material';
import LockIcon from '@mui/icons-material/Lock';
import {
  StyledPaper,
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
  const companies = useSelector((state) => state.company.companies);
  const plans = useSelector((state) => state.plan.plans);
  const companyName = useSelector((state) => state.employee.companyName);
  const selectedEmployee = useSelector((state) => state.employee.selectedEmployee);
  
  const [isAddEmployeeDialogOpen, setIsAddEmployeeDialogOpen] = useState(false);
  const [isEditEmployeeDialogOpen, setIsEditEmployeeDialogOpen] = useState(false);
  const [isComparisonDialogOpen, setIsComparisonDialogOpen] = useState(false);
  const [searchQuery, setSearchQuery] = useState('');

  const processedCsvData = useSelector((state) => state.employee.processedCsvData) || [];
  useEffect(() => {
    dispatch(fetchEmployees(companyId));
    dispatch(fetchCompanies());
    dispatch(fetchPlans());
  }, [companyId, dispatch]);


  const fileRef = useRef(null);

  const filteredEmployees = employees
    .filter(employee => {
      const searchTerm = searchQuery.toLowerCase();
      return (
        employee.username.toLowerCase().includes(searchTerm) ||
        employee.email.toLowerCase().includes(searchTerm)
      );
    })
    .sort((a, b) => {
      if (a.is_active && !b.is_active) {
        return -1;
      }
      if (!a.is_active && b.is_active) {
        return 1;
      }
      return 0;
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
        toast.success('Employee toggle successful');
      })
      .catch(() => {
        toast.error('Failed to toggle employee status!');
      });
  };
  const handleUserDialogClose = (updatedUser) => {
    if (updatedUser.user_id) {
      toast.success(`${updatedUser.username} was added successfully!`);
    }
    setIsEditEmployeeDialogOpen(false);
  };


  const handleFileChange = (e) => {
    const file = e.target.files[0];
    processFile(
      file,
      employees,
      companies,
      plans,
      (comparedData) => {
        dispatch(setProcessedCsvData(comparedData));
        toast.success('CSV processed successfully!');
        setIsComparisonDialogOpen(true);
      },
      (error) => {
        toast.error('Error processing CSV!', error);
      }
    );
  };

  return (
    <StyledPaper>
      <div style={{ display: 'flex', flexDirection: 'column', alignItems: 'center' }}>
        <CompanyName>{companyName}</CompanyName>
      </div>
      <div style={{ display: 'flex', flexWrap: 'wrap', justifyContent: 'space-between', alignItems: 'center' }}>
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
              <HeaderCell>Plan</HeaderCell>
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
                <StyledTableCell>{employee.magic_pill_plan?.plan_name}</StyledTableCell>

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
      <AddEmployeeDialog open={isAddEmployeeDialogOpen} onClose={() => setIsAddEmployeeDialogOpen(false)} companyId={companyId} companies={companies} plans={plans} />
      {selectedEmployee && <EditEmployeeDialog open={isEditEmployeeDialogOpen} onClose={(arg) => handleUserDialogClose(arg)} companyId={companyId} employee={selectedEmployee} companies={companies} plans={plans}/>}
      <ComparisonDialog open={isComparisonDialogOpen} onClose={() => setIsComparisonDialogOpen(false)} processedCsvData={processedCsvData} companyId={companyId} companies={companies} plans={plans}/>
    </StyledPaper>
  );
}

export default Employee;
