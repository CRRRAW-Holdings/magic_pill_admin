import React from 'react';
import PropTypes from 'prop-types';
import {  useDispatch } from 'react-redux';
import { uploadCSVThunk } from '../slices/employeeSlice';
import Dialog from '@mui/material/Dialog';
import DialogActions from '@mui/material/DialogActions';
import DialogContent from '@mui/material/DialogContent';
import DialogTitle from '@mui/material/DialogTitle';
import Button from '@mui/material/Button';

const ComparisonDialog = ({ open, onClose, processedCsvData }) => {
  const dispatch = useDispatch();

  const handleApprove = () => {
    // Dispatch the thunk action to upload the comparison data
    dispatch(uploadCSVThunk(processedCsvData))
      .then((action) => {
        if (action.type === 'employee/uploadCSV/fulfilled') {
          //Success Dialog
          dispatch(uploadCSVThunk());  // Close the dialog and finalize the approval process
        } else {
          console.log('error');
        }
      });
  };

  const handleDecline = () => {
    onClose();
    // Optionally: show a notification that the user declined.
  };

  return (
    <Dialog open={open} onClose={onClose}>
      <DialogTitle>CSV Upload & Data Comparison</DialogTitle>
      <DialogContent>
        <div className="comparison-results">
          {
            processedCsvData.map((result, index) => (
              <div key={index}>
                {/* Adjust the fields based on your data structure */}
                <p>Username: {result.username}</p>
                <p>Email: {result.email}</p>
                <p>Insurance Company ID: {result.insurance_company_id}</p>
                <p>Magic Pill Plan ID: {result.magic_pill_plan_id}</p>
                <p>Action: {result.action}</p>
                <hr />
              </div>
            ))
          }
        </div>
      </DialogContent>
      <DialogActions>
        <Button onClick={handleDecline} color="primary">
          Decline Changes
        </Button>
        <Button onClick={handleApprove} color="primary">
          Approve Changes
        </Button>
      </DialogActions>
    </Dialog>
  );
};

ComparisonDialog.propTypes = {
  open: PropTypes.bool.isRequired,
  onClose: PropTypes.func.isRequired,
  processedCsvData: PropTypes.array.isRequired
};

export default ComparisonDialog;
