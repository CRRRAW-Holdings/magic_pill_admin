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
import { toast } from 'react-toastify';
import { getCompanyNameFromInsuranceId } from '../utils/mappingUtils';
import { isValidEmail } from '../utils/fieldUtil';
import { CircularProgress } from '@mui/material';

function AddEmployeeDialog({ open, onClose, companyId, companies, plans, employees }) {
  const dispatch = useDispatch();
  const [employeeData, setEmployeeData] = useState({
    email: '',
    insurance_company_id: companyId,
    magic_pill_plan_id: '',
    is_active: true,
    is_dependent: false,
    address: '',
    dob: '',
    first_name: '',
    last_name: '',
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
    const formattedDOB = employeeData.dob;

    const email = employeeData.is_dependent ? primaryUser.email : employeeData.email;
    console.log(email);
    const username = `${email}_${formattedDOB}_${companyId}`;
    const addedEmployeeData = {
      address: employeeData.address,
      insurance_company_id: parseInt(companyId, 10),
      magic_pill_plan_id: employeeData.magic_pill_plan_id,
      age: employeeData.age,
      company: getCompanyNameFromInsuranceId(parseInt(companyId, 10), companies),
      dob: formattedDOB,
      email: email,
      first_name: employeeData.first_name,
      is_active: employeeData.is_active,
      is_dependent: employeeData.is_dependent,
      last_name: employeeData.last_name,
      phone: employeeData.phone,
      username: username,
    };

    dispatch(addEmployeeThunk({ companyId, employeeData: addedEmployeeData }))
      .then(action => {
        if (addEmployeeThunk.fulfilled.match(action)) {
          setEmployeeData({
            email: '',
            insurance_company_id: '',
            magic_pill_plan_id: '',
            is_active: true,
            is_dependent: false,
            address: '',
            dob: '',
            first_name: '',
            last_name: '',
            phone: '',
            username: ''
          });
          toast.success(`${action.payload?.first_name} ${action.payload?.last_name} was added successfully!`);
          onClose();
        } else if (addEmployeeThunk.rejected.match(action)) {
          toast.error('Error adding employee!', action.error);
        }
      }).catch(() => {
        toast.error('Error adding employee!');
      });
  };

  return (
    <Dialog open={open} onClose={onClose}>
      <DialogTitle>Add Employee</DialogTitle>
      <DialogContent>
        <FormControlLabel
          control={
            <Checkbox
              checked={employeeData.is_active}
              onChange={handleCheckboxChange}
              name="is_active"
              color="primary"
            />
          }
          label="Activate Immidiately"
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
        {employeeData.is_dependent && (
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
        {!employeeData.is_dependent && (
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
          name="insurance_company_id"
          disabled
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
  employees: PropTypes.array.isRequired,
};

export default AddEmployeeDialog;
