import React, { useState } from 'react';
import PropTypes from 'prop-types';
import { useDispatch } from 'react-redux';
import { uploadCSVThunk } from '../slices/employeeSlice';
import {
  Dialog, DialogTitle, DialogContent, DialogActions,
  Button, Typography, Table, TableHead, TableBody, TableRow, TableCell,
  Tabs, Tab, Card, CardContent
} from '@mui/material';
import Checkbox from '@mui/material/Checkbox';
import { styled } from '@mui/material/styles';
import AddIcon from '@mui/icons-material/Add';
import EditIcon from '@mui/icons-material/Edit';
import PersonOffIcon from '@mui/icons-material/PersonOff';

const StyledTableRow = styled(TableRow)(({ theme }) => ({
  '&:hover': {
    backgroundColor: theme.palette.success.main,
    borderRadius: '5px',
  },
  '&:active': {
    backgroundColor: theme.palette.success.dark,
    borderRadius: '5px',
  },
  backgroundColor: theme.palette.success.light,
  borderRadius: '5px'
}));

const ComparisonDialog = ({ open, onClose, processedCsvData }) => {
  const dispatch = useDispatch();
  const [selectedTab, setSelectedTab] = useState(0);
  const [checkedItems, setCheckedItems] = useState([]);


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

  const handleDecline = () => {
    onClose();
  };

  const handleChange = (event, newValue) => {
    setSelectedTab(newValue);
  };

  const handleCheckboxChange = (username) => {
    if (checkedItems.includes(username)) {
      setCheckedItems(prevState => prevState.filter(item => item !== username));
    } else {
      setCheckedItems(prevState => [...prevState, username]);
    }
  };

  const allRowsChecked = processedCsvData.length === checkedItems.length;
  // Segregate data based on action
  const added = processedCsvData.filter(data => data.action === 'add');
  const edited = processedCsvData.filter(data => data.action === 'update');
  const disabled = processedCsvData.filter(data => data.action === 'disable');

  return (
    <Dialog open={open} onClose={onClose} fullWidth maxWidth="md">
      <DialogTitle>Data Changes Review</DialogTitle>
      <DialogContent>
        <Tabs value={selectedTab} onChange={handleChange} indicatorColor="primary" textColor="primary">
          <Tab label="Added" />
          <Tab label="Edited" />
          <Tab label="Disabled" />
        </Tabs>

        {selectedTab === 0 && (
          <Card style={{ marginTop: '20px' }}>
            <CardContent>
              <Typography variant="h6">Added Users</Typography>
              <Table>
                <TableHead>
                  <TableRow>
                    <TableCell style={{ fontWeight: 'bold' }}>Username</TableCell>
                    <TableCell style={{ fontWeight: 'bold' }}>Email</TableCell>
                    <TableCell style={{ fontWeight: 'bold' }}>Magic Pill Plan ID</TableCell>
                    <TableCell style={{ fontWeight: 'bold' }}>Insurance Company ID</TableCell>
                    <TableCell style={{ fontWeight: 'bold' }}>Action</TableCell>
                  </TableRow>
                </TableHead>
                <TableBody>
                  {added.map((user, index) => (
                    <StyledTableRow key={index}>
                      <TableCell>{user.newData.user_id}</TableCell>
                      <TableCell>{user.newData.email}</TableCell>
                      <TableCell>{user.newData.username}</TableCell>
                      <TableCell>{user.newData.magic_pill_plan_id}</TableCell>
                      <TableCell>{user.newData.insurance_company_id}</TableCell>
                      <TableCell><AddIcon /></TableCell>
                      <TableCell>
                        <Checkbox
                          checked={checkedItems.includes(user.newData.username)}
                          onChange={() => handleCheckboxChange(user.newData.username)}
                        />

                      </TableCell>
                    </StyledTableRow>
                  ))}
                </TableBody>
              </Table>
            </CardContent>
          </Card>
        )}

        {selectedTab === 1 && (
          <Card style={{ marginTop: '20px' }}>
            <CardContent>
              <Typography variant="h6">Edited Users</Typography>
              <Table>
                <TableHead>
                  <TableRow>
                    <TableCell style={{ fontWeight: 'bold' }}>Old User Info</TableCell>
                    <TableCell style={{ fontWeight: 'bold' }}>Edited User Info</TableCell>
                    <TableCell style={{ fontWeight: 'bold' }}>Action</TableCell>
                  </TableRow>
                </TableHead>
                <TableBody>
                  {edited.map((user, index) => (
                    <React.Fragment key={index}>
                      <TableRow hover style={{ backgroundColor: '#FFEAB5', margin: '5px 0', borderRadius: '5px' }}>
                        <TableCell>{user.oldData.username}<br />
                          {user.oldData.magic_pill_plan_id}<br />
                          {user.oldData.insurance_company_id}<br />
                          {user.oldData.email}
                        </TableCell>
                        <TableCell>{user.newData.username}<br />
                          {user.newData.magic_pill_plan_id}<br />
                          {user.newData.insurance_company_id}<br />
                          {user.newData.email}
                        </TableCell>
                        <TableCell>
                          <Checkbox
                            checked={checkedItems.includes(user.newData.username)}
                            onChange={() => handleCheckboxChange(user.newData.username)}
                          />

                        </TableCell>
                        <TableCell rowSpan={2}><EditIcon /></TableCell>
                      </TableRow>
                    </React.Fragment>
                  ))}
                </TableBody>
              </Table>
            </CardContent>
          </Card>
        )}

        {selectedTab === 2 && (
          <Card style={{ marginTop: '20px' }}>
            <CardContent>
              <Typography variant="h6">Disabled Users</Typography>
              <Table>
                <TableHead>
                  <TableRow>
                    <TableCell style={{ fontWeight: 'bold' }}>Username</TableCell>
                    <TableCell style={{ fontWeight: 'bold' }}>Magic Pill Plan ID</TableCell>
                    <TableCell style={{ fontWeight: 'bold' }}>Insurance Company ID</TableCell>
                    <TableCell style={{ fontWeight: 'bold' }}>Email</TableCell>
                    <TableCell style={{ fontWeight: 'bold' }}>Action</TableCell>
                  </TableRow>
                </TableHead>
                <TableBody>
                  {disabled.map((user, index) => (
                    <TableRow key={index} hover style={{ backgroundColor: '#fbeff0', margin: '5px 0', borderRadius: '5px' }}>
                      <TableCell>{user.oldData.username}</TableCell>
                      <TableCell>{user.oldData.magic_pill_plan_id}</TableCell>
                      <TableCell>{user.oldData.insurance_company_id}</TableCell>
                      <TableCell>{user.oldData.email}</TableCell>
                      <TableCell><PersonOffIcon color="error" /></TableCell>
                      <TableCell>
                        <Checkbox
                          checked={checkedItems.includes(user.oldData.username)}
                          onChange={() => handleCheckboxChange(user.oldData.username)}
                        />

                      </TableCell>
                    </TableRow>
                  ))}
                </TableBody>
              </Table>
            </CardContent>
          </Card>
        )}
      </DialogContent>
      <DialogActions>
        <Button onClick={handleDecline} color="primary">
          Decline Changes
        </Button>
        <Button
          onClick={handleApprove}
          color="primary"
          variant="contained"
          disabled={!allRowsChecked}
        >
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
    email: PropTypes.string,
    oldData: PropTypes.string,
    newData: PropTypes.string,
    action: PropTypes.oneOf(['add', 'edit', 'disable']).isRequired
  })).isRequired
};

export default ComparisonDialog;
