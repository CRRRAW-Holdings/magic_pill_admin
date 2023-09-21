import React, { useState } from 'react';
import PropTypes from 'prop-types';
import { useDispatch } from 'react-redux';
import { uploadCSVThunk } from '../slices/employeeSlice';
import {
  Dialog, DialogTitle, DialogContent, DialogActions,
  Button, Tabs, Tab
} from '@mui/material';
import theme from '../theme';
import AddIcon from '@mui/icons-material/Add';
import EditIcon from '@mui/icons-material/Edit';
import PersonOffIcon from '@mui/icons-material/PersonOff';
import UserTable from './UserTable';

const addTabColumns = [
  'email', 'plan_name', 'is_active',
  'address', 'dob', 'age', 'company', 'first_name', 'last_name', 'phone'
];

const updateTabColumns = addTabColumns;

const disableTabColumns = ['email', 'dob', 'username'];

const ComparisonDialog = ({ open, onClose, processedCsvData, companyId, companies, plans }) => {
  const dispatch = useDispatch();
  const [selectedTab, setSelectedTab] = useState(0);
  const [checkedItems, setCheckedItems] = useState([]);
  const [selectAll, setSelectAll] = useState({ added: false, edited: false, disabled: false });

  const added = processedCsvData.filter(data => data.action === 'add');
  const edited = processedCsvData.filter(data => data.action === 'update');
  const disabled = processedCsvData.filter(data => data.action === 'toggle');

  const handleApprove = () => {
    const dataToUpload = [...added, ...edited, ...disabled].filter(item => checkedItems.includes(item.username));
    dispatch(uploadCSVThunk(dataToUpload))
      .then((action) => {
        if (action.type === 'employee/uploadCSV/fulfilled') {
          onClose();
        } else {
          alert('Error while uploading. Please try again later.');
        }
      });
  };


  const handleSelectAll = (tab) => {
    let items = [];
    if (tab === 'added') items = added;
    else if (tab === 'edited') items = edited;
    else if (tab === 'disabled') items = disabled;

    if (selectAll[tab]) {
      setCheckedItems(prevCheckedItems => prevCheckedItems.filter(id => !items.map(user => user.username).includes(id)));
    } else {
      setCheckedItems(prevCheckedItems => [...new Set([...prevCheckedItems, ...items.map(user => user.username)])]);
    }

    setSelectAll(prevSelectAll => ({ ...prevSelectAll, [tab]: !prevSelectAll[tab] }));
  };
  
  return (
    <Dialog open={open} onClose={onClose} fullWidth maxWidth="lg">
      <DialogTitle>Data Changes Review</DialogTitle>
      <DialogContent>
        <Tabs value={selectedTab} onChange={(event, newValue) => setSelectedTab(newValue)} indicatorColor="primary" textColor="primary">
          <Tab label="Added" style={{ backgroundColor: selectedTab === 0 ? theme.palette.primary.main : 'transparent', color: selectedTab === 0 ? 'white' : theme.palette.success.dark }} />
          <Tab label="Edited" style={{ backgroundColor: selectedTab === 1 ? theme.palette.primary.main : 'transparent', color: selectedTab === 1 ? 'white' : 'orange' }} />
          <Tab label="Disabled" style={{ backgroundColor: selectedTab === 2 ? theme.palette.primary.main : 'transparent', color: selectedTab === 2 ? 'white' : theme.palette.error.dark }} />
        </Tabs>

        {selectedTab === 0 && (
          <UserTable
            type="added"
            columns={addTabColumns}
            users={added}
            handleSelectAll={handleSelectAll}
            selectAll={selectAll}
            IconComponent={AddIcon}
            // backgroundColor={theme.palette.success.light}
          />
        )}

        {selectedTab === 1 && (
          <UserTable
            type="edited"
            columns={updateTabColumns}
            users={edited}
            handleSelectAll={handleSelectAll}
            selectAll={selectAll}
            IconComponent={EditIcon}
            // backgroundColor={theme.palette.warning.main}
          />
        )}

        {selectedTab === 2 && (
          <UserTable
            type="disabled"
            columns={disableTabColumns}
            users={disabled}
            handleSelectAll={handleSelectAll}
            selectAll={selectAll}
            IconComponent={PersonOffIcon}
            // backgroundColor={theme.palette.error.dark}
          />
        )}
      </DialogContent>
      <DialogActions>
        <Button onClick={onClose} color="primary">
          Decline Changes
        </Button>
        <Button
          onClick={handleApprove}
          color="primary"
          variant="contained"
          disabled={checkedItems.length !== (added.length + edited.length + disabled.length)}
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
  processedCsvData: PropTypes.arrayOf(PropTypes.object).isRequired,
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
};

export default ComparisonDialog;