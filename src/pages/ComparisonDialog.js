import React, { useState } from 'react';
import PropTypes from 'prop-types';
import { useDispatch } from 'react-redux';
import { uploadCSVThunk } from '../slices/employeeSlice';
import {
  Dialog, DialogTitle, DialogContent, DialogActions,
  Button, Typography, Table, TableHead, TableBody, TableCell,
  Tabs, Tab, Card, CardContent
} from '@mui/material';
import Checkbox from '@mui/material/Checkbox';
import AddIcon from '@mui/icons-material/Add';
import EditIcon from '@mui/icons-material/Edit';
import ArrowForwardIcon from '@mui/icons-material/ArrowForward';
import PersonOffIcon from '@mui/icons-material/PersonOff';
import {
  IconTableCell,
  HeaderTableRow,
  StyledCheckbox,
  StyledTableRow
} from '../styles/styledComponents';
import theme from '../theme';

const ComparisonDialog = ({ open, onClose, processedCsvData }) => {
  const dispatch = useDispatch();
  const [selectedTab, setSelectedTab] = useState(0);
  const [checkedItems, setCheckedItems] = useState([]);

  const added = processedCsvData.filter(data => data.action === 'add');
  const edited = processedCsvData.filter(data => data.action === 'update');
  const disabled = processedCsvData.filter(data => data.action === 'disable');

  const dataMap = {
    0: added,
    1: edited,
    2: disabled
  };

  const allRowsChecked = dataMap[selectedTab].length === checkedItems.length;

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

  const handleSelectAll = () => {
    const dataList = dataMap[selectedTab];
    const usernames = dataList.map(user => user.newData ? user.newData.username : user.oldData.username);
    if (usernames.every(username => checkedItems.includes(username))) {
      setCheckedItems(prevState => prevState.filter(username => !usernames.includes(username)));
    } else {
      setCheckedItems(prevState => [...new Set([...prevState, ...usernames])]);
    }
  };


  return (
    <Dialog open={open} onClose={onClose} fullWidth maxWidth="lg">
      <DialogTitle>Data Changes Review</DialogTitle>
      <DialogContent>
        <Tabs value={selectedTab} onChange={handleChange} indicatorColor="primary" textColor="primary">
          <Tab
            label="Added"
            style={{
              backgroundColor: selectedTab === 0 ? theme.palette.primary.main : 'transparent',
              color: selectedTab === 0 ? 'white' : theme.palette.success.dark
            }}
          />
          <Tab
            label="Edited"
            style={{
              backgroundColor: selectedTab === 1 ? theme.palette.primary.main : 'transparent',
              color: selectedTab === 1 ? 'white' : 'orange'
            }}
          />
          <Tab
            label="Disabled"
            style={{
              backgroundColor: selectedTab === 2 ? theme.palette.primary.main : 'transparent',
              color: selectedTab === 2 ? 'white' : theme.palette.error.dark
            }}
          />
        </Tabs>



        {selectedTab === 0 && (
          <Card style={{ marginTop: '20px' }}>
            <CardContent>
              <Typography variant="h6">Added Users</Typography>
              <Table>
                <TableHead>
                  <HeaderTableRow>
                    <IconTableCell><StyledCheckbox checked={allRowsChecked} onChange={handleSelectAll} /></IconTableCell>
                    <TableCell style={{ fontWeight: 'bold' }}>Username</TableCell>
                    <TableCell style={{ fontWeight: 'bold' }}>Email</TableCell>
                    <TableCell style={{ fontWeight: 'bold' }}>Magic Pill Plan ID</TableCell>
                    <TableCell style={{ fontWeight: 'bold' }}>Insurance Company ID</TableCell>
                  </HeaderTableRow>
                </TableHead>
                <TableBody>
                  {added.map((user, index) => (
                    <StyledTableRow key={index} rowType="add">
                      <IconTableCell><AddIcon color="primary" /></IconTableCell>
                      <TableCell>
                        <Checkbox
                          checked={checkedItems.includes(user.newData.username)}
                          onChange={() => handleCheckboxChange(user.newData.username)}
                        />
                      </TableCell>
                      <TableCell>{user.newData.user_id}</TableCell>
                      <TableCell>{user.newData.email}</TableCell>
                      <TableCell>{user.newData.username}</TableCell>
                      <TableCell>{user.newData.magic_pill_plan_id}</TableCell>
                      <TableCell>{user.newData.insurance_company_id}</TableCell>
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
                  <HeaderTableRow>
                    <IconTableCell><StyledCheckbox checked={allRowsChecked} onChange={handleSelectAll} /></IconTableCell>
                    <TableCell style={{ fontWeight: 'bold' }}>Username</TableCell>
                    <TableCell style={{ fontWeight: 'bold' }}>Email</TableCell>
                    <TableCell style={{ fontWeight: 'bold' }}>Magic Pill Plan ID</TableCell>
                    <TableCell style={{ fontWeight: 'bold' }}>Insurance Company ID</TableCell>
                  </HeaderTableRow>
                </TableHead>
                <TableBody>
                  {edited.map((user, index) => (
                    <StyledTableRow key={index} rowType="edit">
                      <IconTableCell><EditIcon color="primary" /></IconTableCell>
                      <TableCell>
                        <span style={{ color: theme.palette.error.dark }}>{user.oldData.username}</span>
                        <ArrowForwardIcon color="action" style={{ verticalAlign: 'middle' }} />
                        <span style={{ color: theme.palette.success.dark }}>{user.newData.username}</span>
                      </TableCell>
                      <TableCell>
                        <span style={{ color: theme.palette.error.dark }}>{user.oldData.email}</span>
                        <ArrowForwardIcon color="action" style={{ verticalAlign: 'middle' }} />
                        <span style={{ color: theme.palette.success.dark }}>{user.newData.email}</span>
                      </TableCell>
                      <TableCell>
                        <span style={{ color: theme.palette.error.dark }}>{user.oldData.magic_pill_plan_id}</span>
                        <ArrowForwardIcon color="action" style={{ verticalAlign: 'middle' }} />
                        <span style={{ color: theme.palette.success.dark }}>{user.newData.magic_pill_plan_id}</span>
                      </TableCell>
                      <TableCell>
                        <span style={{ color: theme.palette.error.dark }}>{user.oldData.insurance_company_id}</span>
                        <ArrowForwardIcon color="action" style={{ verticalAlign: 'middle' }} />
                        <span style={{ color: theme.palette.success.dark }}>{user.newData.insurance_company_id}</span>
                      </TableCell>
                      <TableCell>
                        <Checkbox checked={checkedItems.includes(user.newData.username)} onChange={() => handleCheckboxChange(user.newData.username)} />
                      </TableCell>
                    </StyledTableRow>
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
                  <HeaderTableRow>
                    <IconTableCell><StyledCheckbox checked={allRowsChecked} onChange={handleSelectAll} /></IconTableCell>
                    <TableCell style={{ fontWeight: 'bold' }}>Username</TableCell>
                    <TableCell style={{ fontWeight: 'bold' }}>Email</TableCell>
                    <TableCell style={{ fontWeight: 'bold' }}>Magic Pill Plan ID</TableCell>
                    <TableCell style={{ fontWeight: 'bold' }}>Insurance Company ID</TableCell>
                  </HeaderTableRow>
                </TableHead>
                <TableBody>
                  {disabled.map((user, index) => (
                    <StyledTableRow key={index} rowType="disable">
                      <IconTableCell><PersonOffIcon color="error" /></IconTableCell>
                      <TableCell>{user.oldData.username}</TableCell>
                      <TableCell>{user.oldData.email}</TableCell>
                      <TableCell>{user.oldData.magic_pill_plan_id}</TableCell>
                      <TableCell>{user.oldData.insurance_company_id}</TableCell>
                      <TableCell>
                        <Checkbox
                          checked={checkedItems.includes(user.oldData.username)}
                          onChange={() => handleCheckboxChange(user.oldData.username)}
                        />
                      </TableCell>
                    </StyledTableRow>
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
    oldData: PropTypes.object,
    newData: PropTypes.object,
    action: PropTypes.oneOf(['add', 'update', 'disable']).isRequired
  })).isRequired
};

export default ComparisonDialog;