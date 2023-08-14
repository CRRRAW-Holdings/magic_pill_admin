import React, { useState, useEffect } from 'react';
import { useDispatch } from 'react-redux';
import { updateEmployeeThunk } from '../slices/employeeSlice';
import Dialog from '@mui/material/Dialog';
import DialogActions from '@mui/material/DialogActions';
import DialogContent from '@mui/material/DialogContent';
import DialogTitle from '@mui/material/DialogTitle';
import Button from '@mui/material/Button';
import TextField from '@mui/material/TextField';
import PropTypes from 'prop-types';

function EditEmployeeDialog({ open, onClose, employee, companyId }) {
  console.log(employee,companyId );
  const dispatch = useDispatch();
  const [employeeData, setEmployeeData] = useState({
    username: '',
    email: '',
    insurance_company_id: '',
    magic_pill_plan_id: ''
  });

  useEffect(() => {
    if (employee) {
      setEmployeeData(employee);
    }
  }, [employee]);

  const handleChange = (e) => {
    setEmployeeData({
      ...employeeData,
      [e.target.name]: e.target.value
    });
  };

  const handleSubmit = () => {
    dispatch(updateEmployeeThunk({ companyId, employeeData }))
      .then(action => {
        if (updateEmployeeThunk.fulfilled.match(action)) {
          onClose();
        } else if (updateEmployeeThunk.rejected.match(action)) {
          console.error('Error updating employee:', action.error);
        }
      }).catch(() => {
        // Handle error if needed
      });
  };

  return (
    <Dialog open={open} onClose={onClose}>
      <DialogTitle>Add Employee</DialogTitle>
      < DialogContent >
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
      < DialogActions >
        <Button onClick={onClose} color="primary" >
                        Cancel
        </Button>
        < Button onClick={handleSubmit} color="primary" >
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
  onClose: PropTypes.func.isRequired
};

export default EditEmployeeDialog;
