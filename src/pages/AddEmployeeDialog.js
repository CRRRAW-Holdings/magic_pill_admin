import React, { useState } from 'react';
import { useDispatch, useSelector } from 'react-redux';
import { addEmployeeThunk } from '../slices/employeeSlice';
import Autocomplete from '@mui/material/Autocomplete';

import Dialog from '@mui/material/Dialog';
import DialogActions from '@mui/material/DialogActions';
import DialogContent from '@mui/material/DialogContent';
import DialogTitle from '@mui/material/DialogTitle';
import Button from '@mui/material/Button';
import TextField from '@mui/material/TextField';
import Checkbox from '@mui/material/Checkbox';
import FormControlLabel from '@mui/material/FormControlLabel';
import Select from '@mui/material/Select';
import MenuItem from '@mui/material/MenuItem';
import PropTypes from 'prop-types';
import { getCompanyNameFromInsuranceId } from '../utils/mappingUtils';
import { isValidEmail } from '../utils/fieldUtil';
import { CircularProgress } from '@mui/material';
import { showErrorToast, showSuccessToast } from '../utils/toastUtil';

function AddEmployeeDialog({ open, onClose, companyId, companies, plans, employees }) {
  const dispatch = useDispatch();
  const [employeeData, setEmployeeData] = useState({
    email: '',
    companyId: companyId,
    planId: '',
    isActive: true,
    isDependant: false,
    address: '',
    dob: '',
    firstName: '',
    lastName: '',
    phone: '',
  });

  // eslint-disable-next-line no-unused-vars
  const [primaryUser, setPrimaryUser] = useState(null);

  const [emailError, setEmailError] = useState('');

  const isLoading = useSelector(state => state.employee.isLoading);


  const handleChange = (e) => {
    const { name, value } = e.target;
    setEmployeeData(prevState => ({ ...prevState, [name]: value }));
    if (name === 'email') {
      setEmailError('');
    }
  };

  const handleEmailBlur = () => {  // <-- Add this function
    if (!isValidEmail(employeeData.email)) {
      setEmailError('Invalid email address');
    }
  };

  const handleCheckboxChange = (e) => {
    const { name, checked } = e.target;
    setEmployeeData(prevState => ({ ...prevState, [name]: checked }));
  };

  const handleSubmit = () => {
    const email = employeeData.isDependant ? primaryUser.email : employeeData.email;
    const addedEmployeeData = {
      address: employeeData.address,
      companyId: parseInt(companyId, 10),
      planId: parseInt(employeeData.planId, 10),
      company: getCompanyNameFromInsuranceId(parseInt(companyId, 10), companies),
      dob: employeeData.dob,
      email: email,
      firstName: employeeData.firstName,
      isActive: employeeData.isActive,
      isDependant: employeeData.isDependant,
      lastName: employeeData.lastName,
      phone: employeeData.phone,
    };

    dispatch(addEmployeeThunk({employeeData: addedEmployeeData }))
      .then(action => {
        if (addEmployeeThunk.fulfilled.match(action)) {
          setEmployeeData({
            email: '',
            companyId: '',
            planId: '',
            isActive: true,
            isDependant: false,
            address: '',
            dob: '',
            firstName: '',
            lastName: '',
            phone: '',
          });
          showSuccessToast(`${action.payload?.firstName} ${action.payload?.lastName} was added successfully!`);
          onClose();
        } else if (addEmployeeThunk.rejected.match(action)) {
          showErrorToast('Error adding employee!', action.error);
        }
      }).catch(() => {
        showErrorToast('Error adding employee!');
      });
  };

  return (
    <Dialog open={open} onClose={onClose}>
      <DialogTitle>Add Employee</DialogTitle>
      <DialogContent>
        <FormControlLabel
          control={
            <Checkbox
              checked={employeeData.isActive}
              onChange={handleCheckboxChange}
              name="isActive"
              color="primary"
            />
          }
          label="Activate Immidiately"
        />
        <FormControlLabel
          control={
            <Checkbox
              checked={employeeData.isDependant}
              onChange={handleCheckboxChange}
              name="isDependant"
              color="primary"
            />
          }
          label="Is Dependent"
        />
        {employeeData.isDependant && (
          <Autocomplete
            options={employees}
            getOptionLabel={(option) => option.email}
            fullWidth
            renderInput={(params) => (
              <TextField {...params} label="Select Primary account" margin="dense" />
            )}
            value={primaryUser}
            onChange={(event, newValue) => {
              setPrimaryUser(newValue);
            }}
          />
        )}
        {!employeeData.isDependant && (
          <TextField
            margin="dense"
            name="email"
            label="Email Address"
            type="email"
            fullWidth
            value={employeeData.email}
            onChange={handleChange}
            onBlur={handleEmailBlur}
            error={!!emailError}
            helperText={emailError}
          />
        )}
        <Select
          value={companyId}
          onChange={handleChange}
          displayEmpty
          fullWidth
          name="companyId"
          disabled
          margin="dense"
        >
          <MenuItem disabled value="">
            <em>Select a company</em>
          </MenuItem>
          {companies.map(company => (
            <MenuItem key={company.companyId} value={company.companyId}>
              {company.name}
            </MenuItem>
          ))}
        </Select>
        <Select
          value={employeeData.planId}
          onChange={handleChange}
          displayEmpty
          fullWidth
          name="planId"
          margin="dense"
        >
          <MenuItem disabled value="">
            <em>Select a plan</em>
          </MenuItem>
          {plans.map(plan => (
            <MenuItem key={plan.planId} value={plan.planId}>
              {plan.name}
            </MenuItem>
          ))}
        </Select>
        <TextField
          margin="dense"
          name="address"
          label="Address"
          type="text"
          fullWidth
          value={employeeData.address}
          onChange={handleChange}
        />
        <TextField
          margin="dense"
          name="dob"
          label="Date of Birth"
          type="date"
          fullWidth
          InputLabelProps={{
            shrink: true,
          }}
          value={employeeData.dob}
          onChange={handleChange}
        />
        <TextField
          margin="dense"
          name="firstName"
          label="First Name"
          type="text"
          fullWidth
          value={employeeData.firstName}
          onChange={handleChange}
        />
        <TextField
          margin="dense"
          name="lastName"
          label="Last Name"
          type="text"
          fullWidth
          value={employeeData.lastName}
          onChange={handleChange}
        />
        <TextField
          margin="dense"
          name="phone"
          label="Phone"
          type="tel"
          fullWidth
          value={employeeData.phone}
          onChange={handleChange}
        />
      </DialogContent>
      <DialogActions>
        {isLoading && (
          <CircularProgress size={24} />
        )}
        <Button onClick={onClose} color="primary" disabled={isLoading}>
          Cancel
        </Button>
        <Button onClick={handleSubmit} color="primary" disabled={isLoading}>
          {isLoading ? 'Adding...' : 'Add'}
        </Button>
      </DialogActions>

    </Dialog>
  );
}

AddEmployeeDialog.propTypes = {
  open: PropTypes.bool.isRequired,
  companyId: PropTypes.string.isRequired,
  onClose: PropTypes.func.isRequired,
  companies: PropTypes.arrayOf(
    PropTypes.shape({
      companyId: PropTypes.number.isRequired,
      name: PropTypes.string.isRequired,
      phoneNumber: PropTypes.string
    })
  ).isRequired,
  plans: PropTypes.arrayOf(
    PropTypes.shape({
      planId: PropTypes.number.isRequired,
      name: PropTypes.string.isRequired,
    })
  ).isRequired,
  employees: PropTypes.array.isRequired,
};

export default AddEmployeeDialog;
