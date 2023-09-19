import React, { useState } from 'react';
import { useDispatch } from 'react-redux';
import { addEmployeeThunk } from '../slices/employeeSlice';
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

function AddEmployeeDialog({ open, onClose, companyId, companies }) {
  const dispatch = useDispatch();
  const [employeeData, setEmployeeData] = useState({
    username: '',
    email: '',
    insurance_company_id: '',
    magic_pill_plan_id: '',
    is_active: true,
    address: '',
    dob: '',
    first_name: '',
    last_name: '',
    phone: ''
  });

  const handleChange = (e) => {
    const { name, value } = e.target;
    setEmployeeData(prevState => ({ ...prevState, [name]: value }));
  };

  const handleCheckboxChange = (e) => {
    const { name, checked } = e.target;
    setEmployeeData(prevState => ({ ...prevState, [name]: checked }));
  };

  const handleSubmit = () => {
    dispatch(addEmployeeThunk({ companyId, employeeData }))
      .then(action => {
        if (addEmployeeThunk.fulfilled.match(action)) {
          setEmployeeData({
            username: '',
            email: '',
            insurance_company_id: '',
            magic_pill_plan_id: '',
            is_active: true,
            address: '',
            dob: '',
            first_name: '',
            last_name: '',
            phone: ''
          });
          onClose();
        } else if (addEmployeeThunk.rejected.match(action)) {
          console.error('Error adding employee:', action.error);
        }
      }).catch(() => {
        // Handle error if needed
      });
  };

  return (
    <Dialog open={open} onClose={onClose}>
      <DialogTitle>Add Employee</DialogTitle>
      <DialogContent>
        <TextField
          autoFocus
          margin="dense"
          name="username"
          label="Username"
          type="text"
          fullWidth
          value={employeeData.username}
          onChange={handleChange}
        />
        <TextField
          margin="dense"
          name="email"
          label="Email Address"
          type="email"
          fullWidth
          value={employeeData.email}
          onChange={handleChange}
        />
        <Select
          value={employeeData.insurance_company_id}
          onChange={handleChange}
          displayEmpty
          fullWidth
          name="insurance_company_id"
          margin="dense"
        >
          <MenuItem disabled value="">
            <em>Select a company</em>
          </MenuItem>
          {companies.map(company => (
            <MenuItem key={company.insurance_company_id} value={company.insurance_company_id}>
              {company.insurance_company_name}
            </MenuItem>
          ))}
        </Select>
        <TextField
          margin="dense"
          name="magic_pill_plan_id"
          label="Magic Pill Plan ID"
          type="text"
          fullWidth
          value={employeeData.magic_pill_plan_id}
          onChange={handleChange}
        />
        <FormControlLabel
          control={
            <Checkbox
              checked={employeeData.is_active}
              onChange={handleCheckboxChange}
              name="is_active"
              color="primary"
            />
          }
          label="Is Active"
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
        <TextField
          margin="dense"
          name="first_name"
          label="First Name"
          type="text"
          fullWidth
          value={employeeData.first_name}
          onChange={handleChange}
        />
        <TextField
          margin="dense"
          name="last_name"
          label="Last Name"
          type="text"
          fullWidth
          value={employeeData.last_name}
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
        <Button onClick={onClose} color="primary">
          Cancel
        </Button>
        <Button onClick={handleSubmit} color="primary">
          Add
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
      insurance_company_id: PropTypes.number.isRequired,
      insurance_company_name: PropTypes.string.isRequired,
      insurance_company_phone_number: PropTypes.string
    })
  ).isRequired
};

export default AddEmployeeDialog;
