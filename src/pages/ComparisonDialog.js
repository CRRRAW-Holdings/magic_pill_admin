import React, { useState } from 'react';
import PropTypes from 'prop-types';
import { useDispatch } from 'react-redux';
import { uploadCSVThunk } from '../slices/employeeSlice';
import {
  Dialog, DialogActions, DialogContent, DialogTitle, Button, Typography, Table,
  TableBody, TableRow, TableCell, Tabs, Tab
} from '@mui/material';

const ComparisonDialog = ({ open, onClose, processedCsvData }) => {
  const dispatch = useDispatch();
  const [currentTab, setCurrentTab] = useState(0);

  const handleApprove = () => {
    dispatch(uploadCSVThunk(processedCsvData))
      .then((action) => {
        if (action.type === 'employee/uploadCSV/fulfilled') {
          onClose();
        } else {
          console.log('error');
        }
      });
  };

  const handleTabChange = (event, newValue) => {
    setCurrentTab(newValue);
  };

  const handleDecline = () => {
    onClose();
  };

  const added = processedCsvData.filter(data => data.action === 'add');
  const edited = processedCsvData.filter(data => data.action === 'update');
  const disabled = processedCsvData.filter(data => data.action === 'disable');

  return (
    <Dialog open={open} onClose={onClose} fullWidth maxWidth="md">
      <DialogTitle>Data Changes Review</DialogTitle>
      <DialogContent>

        <Tabs value={currentTab} onChange={handleTabChange} aria-label="user update tabs">
          <Tab label="Added" />
          <Tab label="Edited" />
          <Tab label="Disabled" />
        </Tabs>

        {currentTab === 0 && (
          <>
            <Typography variant="h6">Added Users</Typography>
            <Table>
              <TableBody>
                {added.map((user, index) => (
                  <TableRow key={index} style={{ backgroundColor: '#8be097' }}>
                    <TableCell>{user.newData.username}</TableCell>
                    <TableCell>{user.newData.magic_pill_plan_id}</TableCell>
                    <TableCell>{user.newData.insurance_company_id}</TableCell>
                    <TableCell>{user.newData.email}</TableCell>
                    <TableCell>+</TableCell>
                  </TableRow>
                ))}
              </TableBody>
            </Table>

          </>
        )}

        {currentTab === 1 && (
          <>
            <Typography variant="h6">Edited Users</Typography>
            <Table>
              <TableBody>
                {edited.map((user, index) => (
                  <React.Fragment key={index}>
                    <TableRow style={{ backgroundColor: '#FFEAB5' }}>
                      <TableCell>{user.oldData.username}</TableCell>
                      <TableCell>{user.oldData.magic_pill_plan_id}</TableCell>
                      <TableCell>{user.oldData.insurance_company_id}</TableCell>
                      <TableCell>{user.oldData.email}</TableCell>
                      <TableCell rowSpan={2}>✏️</TableCell>
                    </TableRow>
                    <TableRow style={{ backgroundColor: '#8be097' }}>
                      <TableCell>{user.newData.username}</TableCell>
                      <TableCell>{user.newData.magic_pill_plan_id}</TableCell>
                      <TableCell>{user.newData.insurance_company_id}</TableCell>
                      <TableCell>{user.newData.email}</TableCell>
                    </TableRow>
                  </React.Fragment>
                ))}
              </TableBody>
            </Table>


          </>
        )}

        {currentTab === 2 && (
          <>
            <Typography variant="h6">Disabled Users</Typography>
            <Table>
              <TableBody>
                {disabled.map((user, index) => (
                  <TableRow key={index} style={{ backgroundColor: '#fbeff0' }}>
                    <TableCell>{user.oldData.username}</TableCell>
                    <TableCell>{user.oldData.magic_pill_plan_id}</TableCell>
                    <TableCell>{user.oldData.insurance_company_id}</TableCell>
                    <TableCell>{user.oldData.email}</TableCell>
                    <TableCell>❌</TableCell>
                  </TableRow>
                ))}
              </TableBody>
            </Table>

          </>
        )}

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
  processedCsvData: PropTypes.arrayOf(PropTypes.shape({
    username: PropTypes.string.isRequired,
    magic_pill_plan_id: PropTypes.string.isRequired,
    insurance_company_id: PropTypes.string.isRequired,
    email: PropTypes.string, // Optional if you're not always showing email.
    oldData: PropTypes.string,
    newData: PropTypes.string,
    action: PropTypes.oneOf(['add', 'edit', 'disable']).isRequired
  })).isRequired
};

export default ComparisonDialog;
