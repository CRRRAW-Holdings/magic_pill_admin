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
} from '@mui/material';
import LockIcon from '@mui/icons-material/Lock';


import AddEmployeeDialog from './AddEmployeeDialog';
import EditEmployeeDialog from './EditEmployeeDialog';
import ComparisonDialog from './ComparisonDialog';
import { CompanyName, LockedTooltip, StyledPaper, StyledSearchBar } from '../styles/styledComponents';
import { EmployeeRow, HeaderCell, HeaderTableRow, StyledTable, StyledTableCell, StyledTableContainer } from '../styles/tableStyles';
import { AddEmployeeButton, DisableButton, EditButton, EnableButton, UploadCSVButton } from '../styles/buttonComponents';


const defaultEmployees = [];

function Employee() {
  const { id: companyId } = useParams();
  const dispatch = useDispatch();

  // Data State
  const employees = useSelector((state) => state.employee?.employees || defaultEmployees);
  const companies = useSelector((state) => state.company.companies);
  const plans = useSelector((state) => state.plan.plans);
  const companyName = useSelector((state) => state.employee.companyName);
  const selectedEmployee = useSelector((state) => state.employee.selectedEmployee);
  const processedCsvData = useSelector((state) => state.employee.processedCsvData) || [];

  //Table State
  const [searchQuery, setSearchQuery] = useState('');
  const [sortOrder, setSortOrder] = useState('asc');  // Add this line to track sort order

  //Dialog State
  const [isAddEmployeeDialogOpen, setIsAddEmployeeDialogOpen] = useState(false);
  const [isEditEmployeeDialogOpen, setIsEditEmployeeDialogOpen] = useState(false);
  const [isComparisonDialogOpen, setIsComparisonDialogOpen] = useState(false);

  useEffect(() => {
    dispatch(fetchEmployees(companyId));
    dispatch(fetchCompanies());
    dispatch(fetchPlans());
  }, [companyId, dispatch]);

  const fileRef = useRef(null);

  const toggleSort = () => {
    setSortOrder(prevOrder => prevOrder === 'asc' ? 'desc' : 'asc');
  };

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
      toast.success(`${updatedUser.first_name} ${updatedUser.last_name} was added successfully!`);
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
            <HeaderTableRow>
              <HeaderCell>First Name</HeaderCell>
              <HeaderCell>Last Name</HeaderCell>
              <HeaderCell>Email</HeaderCell>
              <HeaderCell>Plan</HeaderCell>
              <HeaderCell>
                <span onClick={toggleSort} style={{ cursor: 'pointer' }}>Status {sortOrder === 'asc' ? '↑' : '↓'}</span>
              </HeaderCell>
              <HeaderCell>Edit</HeaderCell>
            </HeaderTableRow>
          </TableHead>
          <TableBody>
            {filteredEmployees.map((employee) => (
              <EmployeeRow key={employee.user_id} isActive={employee.is_active}>
                <StyledTableCell>
                  {employee.is_active ? (
                    employee.first_name
                  ) : (
                    <LockedTooltip title="Employee is disabled">
                      <div style={{ display: 'flex', alignItems: 'center' }}>
                        <LockIcon color="error" style={{ marginRight: '8px' }} />
                        {employee.first_name}
                      </div>
                    </LockedTooltip>
                  )}
                </StyledTableCell>
                <StyledTableCell>
                  {employee.is_active ? (
                    employee.last_name
                  ) : (
                    <LockedTooltip title="Employee is disabled">
                      <div style={{ display: 'flex', alignItems: 'center' }}>
                        <LockIcon color="error" style={{ marginRight: '8px' }} />
                        {employee.last_name}
                      </div>
                    </LockedTooltip>
                  )}
                </StyledTableCell>
                <StyledTableCell>{employee.email}</StyledTableCell>
                <StyledTableCell>{employee.magic_pill_plan?.plan_name}</StyledTableCell>
                <StyledTableCell>
                  <div style={{ display: 'flex', justifyContent: 'center', alignItems: 'center' }}>
                    {employee.is_active ? (
                      <DisableButton variant="contained" onClick={() => toggleEmployeeStatus(employee)}>Disable</DisableButton>
                    ) : (
                      <EnableButton variant="contained" onClick={() => toggleEmployeeStatus(employee)}>Enable</EnableButton>
                    )}
                  </div>
                </StyledTableCell>
                <StyledTableCell>
                  <div style={{ display: 'flex', justifyContent: 'center', alignItems: 'center' }}>
                    <EditButton variant="contained" onClick={() => editEmployee(employee)}>Edit</EditButton>
                  </div>
                </StyledTableCell>

              </EmployeeRow>
            ))}
          </TableBody>
        </StyledTable>
      </StyledTableContainer>
      <AddEmployeeDialog open={isAddEmployeeDialogOpen} onClose={() => setIsAddEmployeeDialogOpen(false)} companyId={companyId} companies={companies} plans={plans} />
      {selectedEmployee && <EditEmployeeDialog open={isEditEmployeeDialogOpen} onClose={(arg) => handleUserDialogClose(arg)} companyId={companyId} employee={selectedEmployee} companies={companies} plans={plans} />}
      <ComparisonDialog open={isComparisonDialogOpen} onClose={() => setIsComparisonDialogOpen(false)} processedCsvData={processedCsvData} companyId={companyId} companies={companies} plans={plans} />
    </StyledPaper>
  );
}

export default Employee;
