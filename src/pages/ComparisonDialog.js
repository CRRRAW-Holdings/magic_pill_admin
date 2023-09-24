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
import { toast } from 'react-toastify';

const dialogContentStyle = {
  height: '600px',
  overflow: 'hidden',
};

const dialogHeaderStyle = {
  display: 'flex',
  justifyContent: 'space-between', // Or 'center' if you prefer
  alignItems: 'center',
};

const addTabColumns = [
  'email', 'plan_name', 'is_active',
  'address', 'dob', 'age', 'company', 'first_name', 'last_name', 'phone'
];

const updateTabColumns = addTabColumns;

const disableTabColumns = ['first_name', 'last_name', 'email', 'dob'];

const ComparisonDialog = ({ open, onClose, processedCsvData, companyId, companies, plans }) => {
  const dispatch = useDispatch();
  const [selectedTab, setSelectedTab] = useState(0);
  const [checkedItems, setCheckedItems] = useState([]);
  const [selectAll, setSelectAll] = useState({ added: false, edited: false, disabled: false });

  const added = processedCsvData.filter(data => data.action === 'add');
  const edited = processedCsvData.filter(data => data.action === 'update');
  const disabled = processedCsvData.filter(data => data.action === 'toggle');
  const tabStyle = (index) => {
    switch (index) {
    case 0:
      return { backgroundColor: selectedTab === 0 ? theme.palette.primary.main : 'transparent', color: selectedTab === 0 ? 'white' : theme.palette.success.dark };
    case 1:
      return { backgroundColor: selectedTab === 1 ? theme.palette.primary.main : 'transparent', color: selectedTab === 1 ? 'white' : 'orange' };
    case 2:
      return { backgroundColor: selectedTab === 2 ? theme.palette.primary.main : 'transparent', color: selectedTab === 2 ? 'white' : theme.palette.error.dark };
    default:
      return {};
    }
  };

  const handleApprove = () => {
    const dataToUpload = [...added, ...edited, ...disabled].filter(item => checkedItems.includes(item.user_data.username));
    dispatch(uploadCSVThunk(dataToUpload))
      .then((action) => {
        if (action.type === 'employee/uploadCSV/fulfilled') {
          toast.success('Successful Upload!');
          onClose();
        } else {
          toast.error('Failed Upload');
        }
      });
  };

  const handleDecline = () => {
    toast.info('File Upload was Declined');
    onClose();
  };

  const handleCancel = () => {
    toast.info('File Upload was Cancelled');
    onClose();
  };


  const handleSelectAll = (tab) => {
    let items = [];
    if (tab === 'added') items = added;
    else if (tab === 'edited') items = edited;
    else if (tab === 'disabled') items = disabled;

    if (selectAll[tab]) {
      setCheckedItems(prevCheckedItems => prevCheckedItems.filter(id => !items.map(user => user.user_data.username).includes(id)));
    } else {
      setCheckedItems(prevCheckedItems => [...new Set([...prevCheckedItems, ...items.map(user => user.user_data.username)])]);
    }
    setSelectAll(prevSelectAll => ({ ...prevSelectAll, [tab]: !prevSelectAll[tab] }));
  };
  return (
    <Dialog open={open} onClose={handleCancel} fullWidth maxWidth="lg">
      <DialogTitle disableTypography>
        <div style={dialogHeaderStyle}>
          <div style={{ flex: 1, textAlign: 'left', fontWeight: 'bold', fontSize: '1.25rem', color: theme.palette.text.primary }}>
            Data Changes Review
          </div>
          <Tabs
            value={selectedTab}
            onChange={(event, newValue) => setSelectedTab(newValue)}
            indicatorColor="primary"
            textColor="primary"
            style={{ flex: 1 }}
          >
            <Tab label="Added" style={tabStyle(0)} />
            <Tab label="Edited" style={tabStyle(1)} />
            <Tab label="Disabled" style={tabStyle(2)} />
          </Tabs>
          <div style={{ flex: 1 }} />
        </div>
      </DialogTitle>
      <DialogContent style={dialogContentStyle}>
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
        <Button onClick={handleDecline} color="primary">
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