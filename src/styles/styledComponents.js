import { styled } from '@mui/material/styles';
import PropTypes from 'prop-types';
import { Button, Paper, Table, TableContainer, TableRow, TableCell, TextField, Tooltip, InputAdornment, IconButton } from '@mui/material';
import Background from '../assets/images/background.png';
import SearchIcon from '@mui/icons-material/Search';
import Checkbox from '@mui/material/Checkbox';

// Icon TableCell with adjusted padding and width
export const IconTableCell = styled(TableCell)(({ theme }) => ({
  width: 'auto', 

}));

// Table Row for the Update Tab with a grey background and bold font
export const UpdateTabFirstRow = styled(TableRow)(({ theme }) => ({
  backgroundColor: theme.palette.grey[200],
  fontWeight: 'bold',
}));

// A generic input styled for selecting all items (e.g. checkboxes)
export const SelectAllCheckbox = styled('input')(({ theme }) => ({
  margin: '0 10px',
  cursor: 'pointer',
}));

// Table Row for headers with a grey background and bold font
export const HeaderTableRow = styled(TableRow)(({ theme }) => ({
  backgroundColor: theme.palette.grey[200],
  fontWeight: 'bold',
}));

// A Checkbox styled with margins and a pointer cursor
export const StyledCheckbox = styled(Checkbox)(({ theme }) => ({
  margin: '0 10px',
  cursor: 'pointer',
}));

// Display an error message with theme's error color, centered text and margin at the bottom
export const ErrorMessage = styled('div')(({ theme }) => ({
  color: theme.palette.error.main,
  textAlign: 'center',
  marginBottom: '10px',
}));

// Display a success message with theme's success color, centered text and margin at the bottom
export const SuccessMessage = styled('div')(({ theme }) => ({
  color: theme.palette.success.main,
  textAlign: 'center',
  marginBottom: '10px',
}));

// Large Company Name Header with white color and a shadow for legibility
export const CompanyName = styled('h1')(({ theme }) => ({
  fontSize: '2rem',
  fontFamily: 'Roboto, sans-serif', 
  fontWeight: 'bold',
  color: theme.palette.common.white,
  textShadow: '2px 2px 4px rgba(0, 0, 0, 0.5)', 
}));

// Secondary Company Name styled slightly smaller than the main title
export const ActualCompanyName = styled('h2')(({ theme }) => ({
  fontSize: '1.5rem',
  fontFamily: 'Roboto, sans-serif',
  fontWeight: '600',
  color: theme.palette.common.white,
  textShadow: '1px 1px 3px rgba(0, 0, 0, 0.5)',
}));

// Edit Button with theme's primary light color and hover effects
export const EditButton = styled(Button)(({ theme }) => ({
  ...commonButtonStyles(theme),  // spread the common styles
  backgroundColor: theme.palette.primary.light,
  '&:hover': {
    backgroundColor: theme.palette.primary.main,
  },
}));

// Add Employee Button with a dark success color and hover effects
export const AddEmployeeButton = styled(Button)(({ theme }) => ({
  backgroundColor: theme.palette.success.dark,
  fontSize: '16px',
  padding: '12px 30px',
  minWidth: '150px',
  [theme.breakpoints.down('sm')]: {  // On extra small screens
    width: 'calc(85% - 10px)',   // Take up half the space minus a little for margin
    marginRight: '10px',         // Some margin to separate from the other button
  },
  borderRadius: '8px',
  textTransform: 'uppercase',
  boxShadow: '0px 4px 6px rgba(0, 0, 0, 0.1)',
  '&:hover': {
    backgroundColor: theme.palette.success.light,
    boxShadow: '0px 4px 10px rgba(0, 0, 0, 0.2)',
  },
}));

// TableRow with different background colors based on the row type (e.g., add, edit, disable)
export const StyledTableRow = styled(TableRow)(({ theme, rowType }) => {
  switch (rowType) {
  case 'add':
    return {
      '&:hover': { backgroundColor: theme.palette.success.main, borderRadius: '5px' },
      '&:active': { backgroundColor: theme.palette.success.dark, borderRadius: '5px' },
      backgroundColor: theme.palette.success.light,
      borderRadius: '5px',
    };
  case 'edit':
    return {
      '&:hover': { backgroundColor: theme.palette.warning.light, borderRadius: '5px' },
      '&:active': { backgroundColor: theme.palette.warning.light, borderRadius: '5px' },
      backgroundColor: theme.palette.baseWhite.main,
      borderRadius: '5px',
    };
  case 'disable':
    return {
      '&:hover': { backgroundColor: theme.palette.error.main, borderRadius: '5px' },
      '&:active': { backgroundColor: theme.palette.error.dark, borderRadius: '5px' },
      backgroundColor: theme.palette.error.light,
      borderRadius: '5px',
    };
  default:
    return {};
  }
});

// Table with minimum width and adjusted cell borders
export const StyledTable = styled(Table)(({ theme }) => ({
  minWidth: '650px',
  '& thead th': {
    borderBottom: `2px solid ${theme.palette.grey.main}`,
  },
  '& tbody td': {
    borderBottom: `1px solid ${theme.palette.grey.light}`,
    borderRight: `1px solid ${theme.palette.grey.light}`,
    '&:last-child': { borderRight: 'none' }
  },
}));

// Table Container with a defined max height, scroll capability, and border adjustments
export const StyledTableContainer = styled(TableContainer)(({ theme }) => ({
  marginTop: '20px',
  border: `1px solid ${theme.palette.grey.main}`,
  borderRadius: '4px',
  backgroundColor: '#ffffff',
  height: 'auto',  // Make height adaptive to content
  maxHeight: '800px',  // But set a maximum height
  overflowY: 'auto',
}));

const commonButtonStyles = ({ theme }) => ({
  minWidth: '100px',  // or any size that you want
  height: '40px',
  padding: '10px 20px',
});

// Disable Button with rustic redwood theme colors
export const DisableButton = styled(Button)(({ theme }) => ({
  ...commonButtonStyles(theme),  // spread the common styles
  color: theme.palette.common.white,
  backgroundColor: theme.palette.rusticRedwood.light,
  '&:hover': {
    backgroundColor: theme.palette.rusticRedwood.main,
  },
  textAlign: 'justify',
  marginLeft: '20px'
}));

// Enable Button with oceanic deep theme colors
export const EnableButton = styled(Button)(({ theme }) => ({
  ...commonButtonStyles(theme),  // spread the common styles
  color: theme.palette.common.white,
  backgroundColor: theme.palette.oceanicDeep.dark,
  '&:hover': {
    backgroundColor: theme.palette.oceanicDeep.light,
  },
  textAlign: 'justify',
  marginLeft: '20px'
}));


// StyledTooltip for locked state
export const LockedTooltip = styled(Tooltip)(({ theme }) => ({
  '& .MuiTooltip-tooltip': {
    backgroundColor: theme.palette.error.dark,
    color: theme.palette.common.white,
    fontSize: theme.typography.pxToRem(12),
    border: '1px solid ' + theme.palette.error.main,
  },
  '& .MuiTooltip-arrow': {
    color: theme.palette.error.dark,
  }
}));

// Spacing Between Rows and Columns
export const StyledTableCell = styled(TableCell)(({ theme }) => ({
  padding: theme.spacing(1, 2),
  justifyContent: 'space-between',
  textAlign: 'center',
}));

// Table Header Styling
export const HeaderCell = styled(TableCell)(({ theme }) => ({
  fontWeight: 'bold',
  color: theme.palette.text.primary,
  borderBottom: '2px solid ' + theme.palette.divider,
  position: 'sticky',
  top: 0,
  zIndex: 1,  // Optional: to ensure header stays on top
  background: '#fff',
  textAlign: 'center'
}));

export const UploadCSVButton = styled(Button)(({ theme }) => ({
  variant: 'contained',
  backgroundColor: theme.palette.primary.light,
  color: theme.palette.primary.contrastText,
  fontSize: '16px',
  padding: '12px 30px',
  minWidth: '150px',
  [theme.breakpoints.down('sm')]: {  // On extra small screens
    width: 'calc(85% - 10px)',   // Take up half the space minus a little for margin
  },
  borderRadius: '8px',
  textTransform: 'uppercase',
  boxShadow: '0px 4px 6px rgba(0, 0, 0, 0.1)',

  '&:hover': {
    backgroundColor: theme.palette.primary.main,
    boxShadow: '0px 4px 10px rgba(0, 0, 0, 0.2)',
  },
}));


export const BulkEditButton = styled(Button)(({ theme }) => ({
  backgroundColor: theme.palette.primary.light,  // changed from main to light
  color: theme.palette.primary.contrastText,
  '&:hover': {
    backgroundColor: theme.palette.primary.main,  // changed from dark to main
  },
}));

export const EmployeeRow = styled(({ isActive, ...otherProps }) => <TableRow {...otherProps} />)(({ theme, isActive }) => ({
  backgroundColor: isActive ? theme.palette.action.hover : theme.palette.error.light,
  '&:nth-of-type(odd)': {
    backgroundColor: isActive ? 'inherit' : theme.palette.error.light,
  },
  '&:hover': {
    backgroundColor: theme.palette.grey.main,
  },
}));

export const StyledPaper = styled(Paper)(({ theme }) => ({
  padding: '10px',
  margin: '16px 32px',
  boxShadow: '0 4px 6px rgba(0, 0, 0, 0.1)',
  backgroundImage: `url(${Background})`,
  backgroundSize: 'cover',
  backgroundRepeat: 'no-repeat',
  backgroundPosition: 'center',
}));


export const SearchBar = styled(TextField)(({ theme }) => ({
  padding: '10px',
  width: '80%',
  display: 'block',  // Ensure it's a block-level element by default
  [theme.breakpoints.up('sm')]: {  // On small screens and up
    width: 'calc(100% - 20px)',   // Full width minus paddings
    marginBottom: '10px',  // Margin to separate from the following items
  },
  [theme.breakpoints.up('md')]: {  // On medium screens and up
    width: '60%',   // Adjust width
  },
  fontFamily: 'Roboto, sans-serif',  // Ensuring Roboto font
  '& .MuiInputBase-root': {
    color: '#fff',
    backgroundColor: 'rgba(255, 255, 255, 0.2)',  // Increase the alpha for a lighter feel
    border: '1px solid #ddd',  // Brighter border
    borderRadius: '4px',
    '& .MuiInputBase-input': {
      color: '#fff',
      '&::placeholder': {
        color: '#fff',  // Slightly brighter placeholder
      },
    },
    '&:hover .MuiOutlinedInput-notchedOutline': {
      borderColor: '#888',  // Brighter hover effect
    },
    '&.Mui-focused .MuiOutlinedInput-notchedOutline': {
      borderColor: '#888',  // Brighter focus effect
    },
  },
  '& .MuiOutlinedInput-notchedOutline': {
    borderColor: '#ddd',  // Brighter overall border
  },
}));

export function StyledSearchBar(props) {
  return (
    <SearchBar
      variant="outlined"
      placeholder="Search..."
      fullWidth
      InputProps={{
        startAdornment: (
          <InputAdornment position="start">
            <IconButton>
              <SearchIcon color="action" style={{ color: '#fff' }} />
            </IconButton>
          </InputAdornment>
        ),
        ...props.InputProps  // This allows users to pass additional InputProps if needed
      }}
      {...props}
    />
  );
}

StyledSearchBar.propTypes = {
  InputProps: PropTypes.object,
  // If you want to validate other props as well, you'd list them here
};