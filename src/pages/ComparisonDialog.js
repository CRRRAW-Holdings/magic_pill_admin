import React, { useState, useContext } from 'react';
import PropTypes from 'prop-types';
import { useDispatch, useSelector } from 'react-redux';
import {
  CircularProgress, Dialog, DialogTitle, DialogContent, DialogActions,
  Button, Tabs, Tab
} from '@mui/material';
import theme from '../theme';
import AddIcon from '@mui/icons-material/Add';
import EditIcon from '@mui/icons-material/Edit';
import UserTable from './UserTable';
import { approveEmployeeChangesThunk } from '../slices/employeeSlice';
import { showErrorToast, showInfoToast, showSuccessToast } from '../utils/toastUtil';
import { AuthContext } from '../utils/AuthProvider';

const dialogContentStyle = {
  height: '600px',
  overflow: 'hidden',
};

const dialogHeaderStyle = {
  display: 'flex',
  justifyContent: 'space-between',
  alignItems: 'center',
};

const columnToTitleMapping = {
  email: 'Email',
  planName: 'Plan Name',
  isActive: 'Is Active',
  address: 'Address',
  dob: 'Date of Birth',
  age: 'Age',
  company: 'Company',
  firstName: 'First Name',
  lastName: 'Last Name',
  phone: 'Phone',
};

const addTabColumns = [
  'email', 'planName', 'isActive',
  'address', 'dob', 'company', 'firstName', 'lastName',
];

const updateTabColumns = addTabColumns;

const ComparisonDialog = ({ open, onClose, employeeChanges, companyId }) => {
  const dispatch = useDispatch();
  const { getIdToken } = useContext(AuthContext);

  const [selectedTab, setSelectedTab] = useState(0);
  const isLoading = useSelector(state => state.employee.uploadProgress.isLoading);

  const added = employeeChanges.adds || [];
  const edited = employeeChanges.edits || [];
  const editedForDisplay = edited.map(edit => {
    const displayChanges = Object.entries(edit.changes).map(([key, { oldValue, newValue }]) => ({
      field: key,
      change: `${oldValue} → ${newValue}`
    }));
    return { ...edit, changes: displayChanges };
  });

  const tabStyle = (index) => ({
    backgroundColor: selectedTab === index ? theme.palette.primary.main : 'transparent',
    color: selectedTab === index ? 'white' : theme.palette.text.primary
  });

  const handleApprove = async () => {
    const processedAdded = added;

    const processedEdited = edited.map(edit => ({
      ...edit.updatedObject,
      documentId: edit.id
    }));

    const approvedData = {
      added: processedAdded,
      edited: processedEdited,
    };

    try {
      const token = await getIdToken();
      if (!token) {
        throw new Error('Authentication error: Unable to retrieve token');
      }

      dispatch(approveEmployeeChangesThunk({ approvedData, companyId, token }))
        .then(() => {
          showSuccessToast('Changes Approved and Sent to Database');
          onClose(); 
        })
        .catch((error) => {
          showErrorToast('Error approving changes: ' + error);
        });
    } catch (error) {
      showErrorToast(error.message);
    }
  };
  
  const handleDecline = () => {
    showInfoToast('File Upload was Declined');
    onClose();
  };

  const handleCancel = () => {
    showInfoToast('File Upload was Cancelled');
    onClose();
  };

  return (
    <Dialog open={open} onClose={handleCancel} fullWidth maxWidth="lg">
      <DialogTitle>
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
            IconComponent={AddIcon}
            columnMapping={columnToTitleMapping}
          />
        )}
        {selectedTab === 1 && (
          <UserTable
            type="edited"
            columns={updateTabColumns}
            users={editedForDisplay}
            IconComponent={EditIcon}
            columnMapping={columnToTitleMapping}
          />
        )}
      </DialogContent>
      <DialogActions>
        {isLoading && (
          <div style={{ position: 'absolute', top: '50%', left: '50%', transform: 'translate(-50%, -50%)' }}>
            <CircularProgress />
          </div>
        )}
        <Button onClick={handleDecline} color="primary" disabled={isLoading}>
          Decline Changes
        </Button>
        <Button
          onClick={handleApprove}
          color="primary"
          variant="contained"
          disabled={isLoading}
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
  employeeChanges: PropTypes.shape({
    adds: PropTypes.arrayOf(PropTypes.object),
    edits: PropTypes.arrayOf(PropTypes.object),
  }).isRequired,
  companyId: PropTypes.string.isRequired,
};

export default ComparisonDialog;
