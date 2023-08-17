import { styled } from '@mui/material/styles';
import PropTypes from 'prop-types';
import { Button, Paper, Table, TableContainer, TableRow, TableCell, TextField, Tooltip, InputAdornment, IconButton } from '@mui/material';
import Background from '../assets/images/background.png';
import SearchIcon from '@mui/icons-material/Search';
import Checkbox from '@mui/material/Checkbox';


export const IconTableCell = styled(TableCell)(({ theme }) => ({
  padding: theme.spacing(0.5, 1),
  width: '40px', // assuming icons are around this size, adjust if necessary
}));

// 2. Update Tab's First Row
export const UpdateTabFirstRow = styled(TableRow)(({ theme }) => ({
  backgroundColor: theme.palette.grey[200],
  fontWeight: 'bold',
}));

// 3. Select All Checkbox
export const SelectAllCheckbox = styled('input')(({ theme }) => ({
  margin: '0 10px',
  cursor: 'pointer',
}));

// 2. Update Tab's First Row
export const HeaderTableRow = styled(TableRow)(({ theme }) => ({
  backgroundColor: theme.palette.grey[200],
  fontWeight: 'bold',
}));

// 3. Select All Checkbox Style
export const StyledCheckbox = styled(Checkbox)(({ theme }) => ({
  margin: '0 10px',
  cursor: 'pointer',
}));

export const ErrorMessage = styled('div')(({ theme }) => ({
  color: theme.palette.error.main,
  textAlign: 'center',
  marginBottom: '10px',
}));

// SuccessMessage styled component
export const SuccessMessage = styled('div')(({ theme }) => ({
  color: theme.palette.success.main,
  textAlign: 'center',
  marginBottom: '10px',
}));

// CompanyName styled component
export const CompanyName = styled('h1')(({ theme }) => ({
  fontSize: '2rem',
  fontFamily: 'Roboto, sans-serif',  // Ensuring Roboto font
  fontWeight: 'bold',
  marginBottom: '20px',
  color: theme.palette.common.white,  // Bright color for dark background
  textShadow: '2px 2px 4px rgba(0, 0, 0, 0.5)', // Optional: adding a subtle shadow for better legibility
}));

export const ActualCompanyName = styled('h2')(({ theme }) => ({
  fontSize: '1.5rem',      // Slightly smaller than the main title
  fontFamily: 'Roboto, sans-serif',  // Ensuring Roboto font
  fontWeight: '600',       // Semi-bold, not as bold as the main title
  marginBottom: '15px',    // Some space before the next element
  color: theme.palette.common.white,  // Bright color for dark background
  textShadow: '1px 1px 3px rgba(0, 0, 0, 0.5)', // Optional: subtle shadow for better legibility
}));

export const EditButton = styled(Button)(({ theme }) => ({
  backgroundColor: theme.palette.primary.light,
  '&:hover': {
    backgroundColor: theme.palette.primary.main,
  },
}));

export const AddEmployeeButton = styled(Button)(({ theme }) => ({
  backgroundColor: theme.palette.success.dark,
  fontSize: '16px',
  padding: '12px 30px',  // increased horizontal padding for more width
  minWidth: '150px',  // set a minimum width to ensure it's always wide, adjust as needed
  borderRadius: '8px',
  textTransform: 'uppercase',  // making sure it's uppercase
  boxShadow: '0px 4px 6px rgba(0, 0, 0, 0.1)',

  '&:hover': {
    backgroundColor: theme.palette.success.light,
    boxShadow: '0px 4px 10px rgba(0, 0, 0, 0.2)',
  },
}));




// StyledTable for MUI Table component
export const StyledTable = styled(Table)(({ theme }) => ({
  minWidth: '650px',
  '& thead th': {
    borderBottom: `2px solid ${theme.palette.grey.main}`,  // Stronger border for header
  },
  '& tbody td': {
    borderBottom: `1px solid ${theme.palette.grey.light}`,  // Subtle border for body rows
    borderRight: `1px solid ${theme.palette.grey.light}`,  // Column separators
    '&:last-child': {
      borderRight: 'none',  // Remove border for the last cell
    }
  },
}));

// StyledTableContainer for MUI TableContainer component
export const StyledTableContainer = styled(TableContainer)(({ theme }) => ({
  marginTop: '20px',
  border: `1px solid ${theme.palette.grey.main}`,  // Table border
  borderRadius: '4px',  // Optional: small border radius for softness
  backgroundColor: '#ffffff',  // Setting table's direct background to white (or any color you prefer)
  maxHeight: '90%',
  height: '600px',
  overflowY: 'auto',
}));

// DisableButton styled component
export const DisableButton = styled(Button)(({ theme }) => ({
  color: theme.palette.common.white,
  backgroundColor: theme.palette.rusticRedwood.light,  // changed from main to light
  '&:hover': {
    backgroundColor: theme.palette.rusticRedwood.main,  // changed from dark to main
  },
  textAlign: 'justify',
  marginLeft: '20px'
}));

// EnableButton styled component
export const EnableButton = styled(Button)(({ theme }) => ({
  color: theme.palette.common.white,
  backgroundColor: theme.palette.success.dark,  // changed from main to light
  '&:hover': {
    backgroundColor: theme.palette.success.light,  // changed from dark to main
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
  justifyContent: 'space-between'
}));

// Alternating Row Colors
export const EmployeeRow = styled(({ isActive, ...otherProps }) => <TableRow {...otherProps} />)(({ theme, isActive }) => ({
  backgroundColor: isActive ? theme.palette.action.hover : theme.palette.error.light,
  '&:nth-of-type(odd)': {
    backgroundColor: isActive ? 'inherit' : theme.palette.error.light,
  },
  '&:hover': {
    backgroundColor: theme.palette.grey.main,
  },
}));

// Table Header Styling
export const HeaderCell = styled(TableCell)(({ theme }) => ({
  fontWeight: 'bold',
  color: theme.palette.text.primary,
  borderBottom: '2px solid ' + theme.palette.divider,
  position: 'sticky',
  top: 0,
  zIndex: 1,  // Optional: to ensure header stays on top
  background: '#fff'
}));

export const UploadCSVButton = styled(Button)(({ theme }) => ({
  variant: 'contained',
  backgroundColor: theme.palette.primary.light,
  color: theme.palette.primary.contrastText,
  fontSize: '16px',
  padding: '12px 30px',
  minWidth: '150px',
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

export const StyledPaper = styled(Paper)(({ theme }) => ({
  padding: '20px',
  margin: '16px 32px',
  boxShadow: '0 4px 6px rgba(0, 0, 0, 0.1)',
  backgroundImage: `url(${Background})`,
  backgroundSize: 'cover',
  backgroundRepeat: 'no-repeat',
  backgroundPosition: 'center',
}));



export const SearchBar = styled(TextField)(({ theme }) => ({
  marginBottom: '20px',
  padding: '10px',
  width: '50%',
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
