import React, { useEffect, useState, useRef, useMemo, useContext } from 'react';
import PropTypes from 'prop-types';
import { useParams } from 'react-router-dom';
import { useSelector, useDispatch } from 'react-redux';
import {
  fetchEmployees,
  selectEmployee,
  toggleEmployeeStatusThunk,
  uploadCSVThunk,
  resetProcessedCsvData,
} from '../slices/employeeSlice';
import { fetchPlansThunk } from '../slices/planSlice';

import { processFile } from '../utils/csvUtil';
import { toast } from 'react-toastify';
import theme from '../theme';

import {
  CircularProgress,
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
import { selectCurrentAdmin } from '../selectors';
import { AuthContext } from '../utils/AuthProvider';
import { fetchAdminDetails } from '../slices/companySlice';



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
  const { currentUser } = useContext(AuthContext);


  // Data State
  const employees = useSelector((state) => state.employee?.employees || []);
  const employeeChanges = useSelector((state) => state.employee.employeeChanges) || [];
  const currentAdmin = useSelector(selectCurrentAdmin);
  const plans = useSelector((state) => state.plan.plans);
  const selectedEmployee = useSelector((state) => state.employee.selectedEmployee);
  const companies = currentAdmin?.companies || [];
  const companyName = companies.find(c => c.companyId === parseInt(companyId))?.name || '';

  const isLoading = useSelector(state => state.employee.isLoading);

  //Table State
  const [searchQuery, setSearchQuery] = useState('');
  const [sortOrder, setSortOrder] = useState({ column: 'status', direction: 'asc' });

  //Dialog State
  const [isAddEmployeeDialogOpen, setIsAddEmployeeDialogOpen] = useState(false);
  const [isEditEmployeeDialogOpen, setIsEditEmployeeDialogOpen] = useState(false);
  const [isComparisonDialogOpen, setIsComparisonDialogOpen] = useState(false);

  useEffect(() => {
    dispatch(fetchEmployees(companyId));
    dispatch(fetchAdminDetails(currentUser?.email));
    dispatch(fetchPlansThunk());
  }, [companyId, dispatch]);

  const fileRef = useRef(null);

  const toggleSort = (column) => {
    setSortOrder(prevOrder => ({
      column,
      direction: prevOrder.column === column && prevOrder.direction === 'asc' ? 'desc' : 'asc'
    }));
  };

  const filteredEmployees = useMemo(() => {
    console.log(employees, 'employees');
    const searchTerm = searchQuery?.toLowerCase();
    return [...employees]
      .filter(employee =>
        (typeof employee.firstName === 'string' && employee.firstName.toLowerCase().includes(searchTerm)) ||
        (typeof employee.lastName === 'string' && employee.lastName.toLowerCase().includes(searchTerm)) ||
        (typeof employee.email === 'string' && employee.email.toLowerCase().includes(searchTerm))
      )
      .sort((a, b) => {
        const sortOrderMultiplier = sortOrder.direction === 'asc' ? 1 : -1;

        // This function handles null or undefined values in sorting
        const safeCompare = (valueA, valueB) => {
          if (valueA == null && valueB == null) return 0;
          if (valueA == null) return -1;
          if (valueB == null) return 1;
          return valueA.toString().localeCompare(valueB.toString());
        };

        switch (sortOrder.column) {
        case 'status':
          return (b.isActive - a.isActive) * sortOrderMultiplier;
        case 'plan':
          return safeCompare(a.planName, b.planName) * sortOrderMultiplier;
        case 'firstName':
          return safeCompare(a.firstName, b.firstName) * sortOrderMultiplier;
        case 'lastName':
          return safeCompare(a.lastName, b.lastName) * sortOrderMultiplier;
        case 'email':
          return safeCompare(a.email, b.email) * sortOrderMultiplier;
          // Add more cases for other sortable columns
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
    dispatch(toggleEmployeeStatusThunk(employee.documentId))
      .then((value) => {
        console.log(value);
        toast.success('Employee toggle successful');
      })
      .catch(() => {
        toast.error('Failed to toggle employee status!');
      });
  };
  const handleUserDialogClose = (updatedUser) => {
    if (updatedUser.documentId) {
      toast.success(`${updatedUser.firstName} ${updatedUser.lastName} was added successfully!`);
    }
    setIsEditEmployeeDialogOpen(false);
  };


  const handleFileChange = (e) => {
    const file = e.target.files[0];
    e.target.value = null;
    processFile(
      file,
      employees,
      companies,
      plans,
      companyId,
      (parsedData) => {
        dispatch(uploadCSVThunk({ companyId: companyId, parsedData: parsedData })).then((action) => {
          if (uploadCSVThunk.fulfilled.match(action)) {
            setIsComparisonDialogOpen(true);
          } else if (uploadCSVThunk.rejected.match(action)) {
            toast.error('Error processing CSV!', action.payload || action.error.message);
          }
        });
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
        <CompanyName>{`${companyName} (${companyId})`}</CompanyName>
        <ActionContainer>
          <StyledSearchBar onChange={(e) => handleSearch(e.target.value)} />
          <AddEmployeeButton variant="contained" onClick={() => setIsAddEmployeeDialogOpen(true)}>
            Add Employee
          </AddEmployeeButton>
          <input type="file" ref={fileRef} style={{ display: 'none' }} onChange={handleFileChange} />
          <UploadCSVButton variant="contained" onClick={() => fileRef.current.click()}>
            Upload File
          </UploadCSVButton>
        </ActionContainer>
      </NavbarContainer>
      <StyledTableContainer>
        {isLoading && (
          <div style={{
            position: 'absolute',
            top: '50%',
            left: '50%',
            transform: 'translate(-50%, -50%)',
            zIndex: 10,
            display: 'flex',
            justifyContent: 'center',
            alignItems: 'center',
            width: '100%',
            height: '100%',
            backgroundColor: '#5d23944b'
          }}>
            <CircularProgress size={100} />
          </div>
        )}
        <StyledTable>
          <TableHead>
            <HeaderTableRow>
              <SortableHeaderCell sortOrder={sortOrder} column="firstName" toggleSort={toggleSort}>First Name</SortableHeaderCell>
              <SortableHeaderCell sortOrder={sortOrder} column="lastName" toggleSort={toggleSort}>Last Name</SortableHeaderCell>
              <SortableHeaderCell sortOrder={sortOrder} column="email" toggleSort={toggleSort}>Email</SortableHeaderCell>
              <SortableHeaderCell sortOrder={sortOrder} column="planName" toggleSort={toggleSort}>Plan</SortableHeaderCell>
              <SortableHeaderCell sortOrder={sortOrder} column="status" toggleSort={toggleSort}>Status</SortableHeaderCell>
              <HeaderCell>Edit</HeaderCell>
            </HeaderTableRow>
          </TableHead>
          <TableBody>
            {filteredEmployees.map((employee) => (
              <EmployeeRow key={employee.documentId} isActive={employee.isActive}>
                <StyledTableCell>
                  <div style={{ display: 'flex', alignItems: 'center' }}>
                    {employee.isActive ? (
                      <>
                        <PersonIcon style={{ marginRight: '8px', color: theme.palette.primary.light }} />
                        {employee.firstName}
                      </>
                    ) : (
                      <LockedTooltip title="Employee is disabled">
                        <>
                          <LockIcon color="error" style={{ marginRight: '8px' }} />
                          {employee.firstName}
                        </>
                      </LockedTooltip>
                    )}
                  </div>
                </StyledTableCell>
                <StyledTableCell>
                  {employee.isActive ? (
                    employee.lastName
                  ) : (
                    <LockedTooltip title="Employee is disabled">
                      {employee.lastName}
                    </LockedTooltip>
                  )}
                </StyledTableCell>
                <StyledTableCell>{employee.email}</StyledTableCell>
                <StyledTableCell>{employee.planName}</StyledTableCell>
                <StyledTableCell>
                  <div style={{ display: 'flex', justifyContent: 'center', alignItems: 'center' }}>
                    {isLoading ? (
                      <CircularProgress size={24} />
                    ) : (
                      <>
                        {employee.isActive ? (
                          <DisableButton variant="contained" onClick={() => toggleEmployeeStatus(employee)}>Disable</DisableButton>
                        ) : (
                          <EnableButton variant="contained" onClick={() => toggleEmployeeStatus(employee)}>Enable</EnableButton>
                        )}
                      </>
                    )}
                  </div>
                </StyledTableCell>
                <StyledTableCell>
                  <div style={{ display: 'flex', justifyContent: 'center', alignItems: 'center' }}>
                    {isLoading ? (
                      <CircularProgress size={24} />
                    ) : (
                      <EditButton variant="contained" onClick={() => editEmployee(employee)}>Edit</EditButton>
                    )}
                  </div>
                </StyledTableCell>
              </EmployeeRow>
            ))}
          </TableBody>
        </StyledTable>
      </StyledTableContainer>
      <AddEmployeeDialog open={isAddEmployeeDialogOpen} onClose={() => setIsAddEmployeeDialogOpen(false)} companyId={companyId} companies={companies} plans={plans} employees={employees} />
      {selectedEmployee && <EditEmployeeDialog open={isEditEmployeeDialogOpen} onClose={(arg) => handleUserDialogClose(arg)} companyId={companyId} employee={selectedEmployee} companies={companies} plans={plans} />}
      <ComparisonDialog open={isComparisonDialogOpen} onClose={handleComparisonDialogClose}  employeeChanges={employeeChanges} companyId={companyId} companies={companies} plans={plans} />
    </StyledPaper>
  );
}

export default Employee;
