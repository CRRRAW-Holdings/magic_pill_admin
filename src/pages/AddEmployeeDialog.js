import React, { useState } from 'react';
import { useDispatch } from 'react-redux';
import { addEmployeeThunk } from '../slices/employeeSlice';
import Dialog from '@mui/material/Dialog';
import DialogActions from '@mui/material/DialogActions';
import DialogContent from '@mui/material/DialogContent';
import DialogTitle from '@mui/material/DialogTitle';
import Button from '@mui/material/Button';
import TextField from '@mui/material/TextField';
import PropTypes from 'prop-types';

function AddEmployeeDialog({ open, onClose, companyId }) {
  const dispatch = useDispatch();
  const [employeeData, setEmployeeData] = useState({
    username: '',
    email: '',
    insurance_company_id: '',
    magic_pill_plan_id: ''
  });

  const handleChange = (e) => {
    setEmployeeData({
      ...employeeData,
      [e.target.name]: e.target.value
    });
  };

  const handleSubmit = () => {
    dispatch(addEmployeeThunk({ companyId, employeeData }))
      .then(action => {
        if (addEmployeeThunk.fulfilled.match(action)) {
          setEmployeeData({ username: '', email: '', magic_pill_plan_id: '', insurance_company_id: '' });
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
        <TextField
          margin="dense"
          name="insurance_company_id"
          label="Insurance Company ID"
          type="text"
          fullWidth
          value={employeeData.insurance_company_id}
          onChange={handleChange}
        />
        <TextField
          margin="dense"
          name="magic_pill_plan_id"
          label="Magic Pill Plan ID"
          type="text"
          fullWidth
          value={employeeData.magic_pill_plan_id}
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
  onClose: PropTypes.func.isRequired
};

export default AddEmployeeDialog;
