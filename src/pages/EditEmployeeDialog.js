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
import Select from '@mui/material/Select';
import MenuItem from '@mui/material/MenuItem';
import PropTypes from 'prop-types';

function EditEmployeeDialog({ open, onClose, employee, companyId, companies, plans }) {
  const dispatch = useDispatch();
  const [employeeData, setEmployeeData] = useState({
    email: '',
    insurance_company_id: companyId,
    magic_pill_plan_id: '',
    is_active: true,
    is_dependent: false,
    address: '',
    dob: '',
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
    const formattedDOB = employeeData.dob;
    const username = `${employeeData.email}_${formattedDOB}_${employeeData.insurance_company_id}`;

    const updatedEmployeeData = {
      address: employeeData.address,
      insurance_company_id: employeeData.insurance_company_id,
      magic_pill_plan_id: employeeData.magic_pill_plan_id,
      company: employeeData.company,
      dob: formattedDOB,
      email: employeeData.email,
      first_name: employeeData.first_name,
      is_active: employeeData.is_active,
      is_dependent: employeeData.is_dependent,
      last_name: employeeData.last_name,
      phone: employeeData.phone,
      user_id: employeeData.user_id,
      username: username,
    };

    dispatch(updateEmployeeThunk({ companyId, employeeData: updatedEmployeeData }))
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
              checked={employeeData.is_active}
              onChange={handleCheckboxChange}
              name="is_active"
              color="primary"
            />
          }
          label="Is Active"
        />
        <FormControlLabel
          control={
            <Checkbox
              checked={employeeData.is_dependent}
              onChange={handleCheckboxChange}
              name="is_dependent"
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
          value={employeeData.insurance_company_id}
          onChange={handleChange}
          displayEmpty
          fullWidth
          name="insurance_company_id"
          margin="dense"
          disabled
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

        <Select
          value={employeeData.magic_pill_plan_id}
          onChange={handleChange}
          displayEmpty
          fullWidth
          name="magic_pill_plan_id"
          margin="dense"
        >
          <MenuItem disabled value="">
            <em>Select a plan</em>
          </MenuItem>
          {plans.map(plan => (
            <MenuItem key={plan.magic_pill_plan_id} value={plan.magic_pill_plan_id}>
              {plan.plan_name}
            </MenuItem>
          ))}
        </Select>
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
  companies: PropTypes.arrayOf(
    PropTypes.shape({
      insurance_company_id: PropTypes.number.isRequired,
      insurance_company_name: PropTypes.string.isRequired,
      insurance_company_phone_number: PropTypes.string
    })
  ).isRequired,
  plans: PropTypes.arrayOf(
    PropTypes.shape({
      magic_pill_plan_id: PropTypes.number.isRequired,
      plan_name: PropTypes.string.isRequired,
    })
  ).isRequired,
  onClose: PropTypes.func.isRequired,
};

export default EditEmployeeDialog;
