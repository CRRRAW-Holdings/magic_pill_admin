import React, { useState, useEffect } from 'react';
import { useDispatch, useSelector } from 'react-redux';
import { updateEmployeeThunk } from '../slices/employeeSlice';
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
import { CircularProgress } from '@mui/material';

function EditEmployeeDialog({ open, onClose, employee, companyId, companies, plans }) {
  const dispatch = useDispatch();
  const [employeeData, setEmployeeData] = useState({
    email: '',
    companyId: companyId,
    planId: '',
    isActive: true,
    isDependant: false,
    address: '',
    dob: '',
    company: '',
    firstName: '',
    lastName: '',
    phone: ''
  });

  const isLoading = useSelector(state => state.employee.isLoading);

  useEffect(() => {
    if (employee) {
      setEmployeeData(employee);
    }
  }, [employee]);

  const handleChange = (e) => {
    const { name, value } = e.target;
    setEmployeeData(prevState => ({ ...prevState, [name]: value }));
  };

  const handleCheckboxChange = (e) => {
    const { name, checked } = e.target;
    setEmployeeData(prevState => ({ ...prevState, [name]: checked }));
  };

  const handleSubmit = () => {
    const { documentId, ...dataToUpdate } = employeeData;
    dataToUpdate.planId = parseInt(dataToUpdate.planId, 10);
  
    dispatch(updateEmployeeThunk({ documentId, employeeData: dataToUpdate }))
      .then(action => {
        if (updateEmployeeThunk.fulfilled.match(action)) {
          onClose(action.payload);
        } else if (updateEmployeeThunk.rejected.match(action)) {
          console.error('Error updating employee:', action.error);
        }
      }).catch(error => {
        console.error('Error updating employee:', error);
      });
  };
  
  return (
    <Dialog open={open} onClose={onClose}>
      <DialogTitle>Edit Employee</DialogTitle>
      <DialogContent>
        <TextField
          margin="dense"
          name="email"
          label="Email Address"
          type="email"
          fullWidth
          value={employeeData.email}
          onChange={handleChange}
        />
        <FormControlLabel
          control={
            <Checkbox
              checked={employeeData.isActive}
              onChange={handleCheckboxChange}
              name="isActive"
              color="primary"
            />
          }
          label="Is Active"
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
        <Select
          value={employeeData.companyId}
          onChange={handleChange}
          displayEmpty
          fullWidth
          name="companyId"
          margin="dense"
          disabled
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
          {isLoading ? 'Updating...' : 'Update'}
        </Button>
      </DialogActions>

    </Dialog>
  );
}

EditEmployeeDialog.propTypes = {
  open: PropTypes.bool.isRequired,
  employee: PropTypes.object.isRequired,
  companyId: PropTypes.string.isRequired,
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
  onClose: PropTypes.func.isRequired,
};

export default EditEmployeeDialog;
