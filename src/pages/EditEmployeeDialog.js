import React, { useState, useEffect } from 'react';
import { useDispatch } from 'react-redux';
import { updateEmployeeThunk } from '../slices/employeeSlice';
import Dialog from '@mui/material/Dialog';
import DialogActions from '@mui/material/DialogActions';
import DialogContent from '@mui/material/DialogContent';
import DialogTitle from '@mui/material/DialogTitle';
import Button from '@mui/material/Button';
import TextField from '@mui/material/TextField';
import Checkbox from '@mui/material/Checkbox';
import FormControlLabel from '@mui/material/FormControlLabel';
import PropTypes from 'prop-types';

function EditEmployeeDialog({ open, onClose, employee, companyId }) {
  const dispatch = useDispatch();
  const [employeeData, setEmployeeData] = useState({
    username: '',
    email: '',
    insurance_company_id: '',
    magic_pill_plan_id: '',
    is_active: true,
    address: '',
    dob: '',
    age: '',
    company: '',
    first_name: '',
    last_name: '',
    phone: ''
  });

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
    dispatch(updateEmployeeThunk({ companyId, employeeData }))
      .then(action => {
        if (updateEmployeeThunk.fulfilled.match(action)) {
          onClose(action.payload);
        } else if (updateEmployeeThunk.rejected.match(action)) {
          console.error('Error updating employee:', action.error);
        }
      }).catch(() => {
        // Handle error if needed
      });
  };

  return (
    <Dialog open={open} onClose={onClose}>
      <DialogTitle>Edit Employee</DialogTitle>
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
        />        <FormControlLabel
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
          name="age"
          label="Age"
          type="number"
          fullWidth
          value={employeeData.age}
          onChange={handleChange}
        />
        <TextField
          margin="dense"
          name="company"
          label="Company"
          type="text"
          fullWidth
          value={employeeData.company}
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
        <TextField
          margin="dense"
          name="insurance_company_id"
          label="Insurance Company ID"
          type="text"
          fullWidth
          value={employeeData.insurance_company_id}
          disabled
        />
        <TextField
          margin="dense"
          name="magic_pill_plan_id"
          label="Magic Pill Plan ID"
          type="text"
          fullWidth
          value={employeeData.magic_pill_plan_id}
          disabled
        />
      </DialogContent>
      <DialogActions>
        <Button onClick={onClose} color="primary">
          Cancel
        </Button>
        <Button onClick={handleSubmit} color="primary">
          Update
        </Button>
      </DialogActions>
    </Dialog>
  );
}

EditEmployeeDialog.propTypes = {
  open: PropTypes.bool.isRequired,
  employee: PropTypes.object.isRequired,
  companyId: PropTypes.string.isRequired,
  onClose: PropTypes.func.isRequired,
  setUpdateSuccess: PropTypes.func.isRequired,
};

export default EditEmployeeDialog;
