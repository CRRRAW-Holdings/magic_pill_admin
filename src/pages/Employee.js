import React, { useEffect, useState, useRef, useMemo } from 'react';
import PropTypes from 'prop-types';
import { useParams } from 'react-router-dom';
import { useSelector, useDispatch } from 'react-redux';
import {
  fetchEmployees,
  selectEmployee,
  toggleEmployeeStatusThunk,
  setProcessedCsvData,
  resetProcessedCsvData,
} from '../slices/employeeSlice';
import { fetchCompanies } from '../slices/companySlice';
import { fetchPlans } from '../slices/planSlice'; // Import fetchPlans

import { processFile } from '../utils/csvUtil';
import { toast } from 'react-toastify';
import theme from '../theme';

import {
  TableBody,
  TableHead,
} from '@mui/material';
import LockIcon from '@mui/icons-material/Lock';
import PersonIcon from '@mui/icons-material/Person';

import AddEmployeeDialog from './AddEmployeeDialog';
import EditEmployeeDialog from './EditEmployeeDialog';
import ComparisonDialog from './ComparisonDialog';
import { CompanyName, LockedTooltip, StyledPaper, StyledSearchBar } from '../styles/styledComponents';
import { EmployeeRow, HeaderCell, HeaderTableRow, StyledTable, StyledTableCell, StyledTableContainer } from '../styles/tableStyles';
import { AddEmployeeButton, DisableButton, EditButton, EnableButton, UploadCSVButton } from '../styles/buttonComponents';
import { ActionContainer, NavbarContainer } from '../styles/containerStyles';


const defaultEmployees = [];

const SortableHeaderCell = ({ children, sortOrder, column, toggleSort }) => (
  <HeaderCell onClick={() => toggleSort(column)} style={{ cursor: 'pointer' }}>
    {children} {sortOrder.column === column ? (sortOrder.direction === 'asc' ? '↑' : '↓') : null}
  </HeaderCell>
);

SortableHeaderCell.propTypes = {
  children: PropTypes.node.isRequired,
  sortOrder: PropTypes.shape({
    column: PropTypes.string.isRequired,
    direction: PropTypes.oneOf(['asc', 'desc']).isRequired
  }).isRequired,
  column: PropTypes.string.isRequired,
  toggleSort: PropTypes.func.isRequired
};

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
  const [sortOrder, setSortOrder] = useState({ column: 'status', direction: 'asc' });

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

  const toggleSort = (column) => {
    setSortOrder(prevOrder => ({
      column,
      direction: prevOrder.column === column && prevOrder.direction === 'asc' ? 'desc' : 'asc'
    }));
  };

  const filteredEmployees = useMemo(() => {
    const searchTerm = searchQuery.toLowerCase();
    return [...employees]
      .filter(employee =>
        employee.username.toLowerCase().includes(searchTerm) ||
        employee.email.toLowerCase().includes(searchTerm)
      )
      .sort((a, b) => {
        const sortOrderMultiplier = sortOrder.direction === 'asc' ? 1 : -1;
        switch (sortOrder.column) {
        case 'status':
          return (b.is_active - a.is_active) * sortOrderMultiplier;
        case 'plan':
          return a.magic_pill_plan?.plan_name.localeCompare(b.magic_pill_plan?.plan_name) * sortOrderMultiplier;
        default:
          return 0;
        }
      });
  }, [employees, searchQuery, sortOrder]);

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
    e.target.value = null;  // Reset the file input    
    processFile(
      file,
      employees,
      companies,
      plans,
      (comparedData) => {
        dispatch(setProcessedCsvData(comparedData));
        setIsComparisonDialogOpen(true);
      },
      (error) => {
        toast.error('Error processing CSV!', error);
      }
    );
  };

  const handleComparisonDialogClose = () => {
    dispatch(resetProcessedCsvData());
    setIsComparisonDialogOpen(false);
  };

  return (
    <StyledPaper>
      <NavbarContainer>
        <CompanyName>{companyName}</CompanyName>
        <ActionContainer>
          <StyledSearchBar onChange={(e) => handleSearch(e.target.value)} />
          <AddEmployeeButton variant="contained" onClick={() => setIsAddEmployeeDialogOpen(true)}>
            Add Employee
          </AddEmployeeButton>
          <input type="file" ref={fileRef} style={{ display: 'none' }} onChange={handleFileChange} />
          <UploadCSVButton variant="contained" onClick={() => fileRef.current.click()}>
            Upload Company CSV
          </UploadCSVButton>
        </ActionContainer>
      </NavbarContainer>
      <StyledTableContainer>
        <StyledTable>
          <TableHead>
            <HeaderTableRow>
              <HeaderCell>First Name</HeaderCell>
              <HeaderCell>Last Name</HeaderCell>
              <HeaderCell>Email</HeaderCell>
              <SortableHeaderCell sortOrder={sortOrder} column="plan" toggleSort={toggleSort}>Plan</SortableHeaderCell>
              <SortableHeaderCell sortOrder={sortOrder} column="status" toggleSort={toggleSort}>Status</SortableHeaderCell>
              <HeaderCell>Edit</HeaderCell>
            </HeaderTableRow>
          </TableHead>
          <TableBody>
            {filteredEmployees.map((employee) => (
              <EmployeeRow key={employee.user_id} isActive={employee.is_active}>
                <StyledTableCell>
                  <div style={{ display: 'flex', alignItems: 'center' }}>
                    {employee.is_active ? (
                      <>
                        <PersonIcon style={{ marginRight: '8px', color: theme.palette.primary.light }} />
                        {employee.first_name}
                      </>
                    ) : (
                      <LockedTooltip title="Employee is disabled">
                        <>
                          <LockIcon color="error" style={{ marginRight: '8px' }} />
                          {employee.first_name}
                        </>
                      </LockedTooltip>
                    )}
                  </div>
                </StyledTableCell>
                <StyledTableCell>
                  {employee.is_active ? (
                    employee.last_name
                  ) : (
                    <LockedTooltip title="Employee is disabled">
                      employee.last_name
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
      <ComparisonDialog open={isComparisonDialogOpen} onClose={handleComparisonDialogClose} processedCsvData={processedCsvData} companyId={companyId} companies={companies} plans={plans} />
    </StyledPaper>
  );
}

export default Employee;
