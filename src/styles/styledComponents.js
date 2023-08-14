import { styled } from '@mui/material/styles';
import { Button, Paper, Table, TableContainer, TableRow, TableCell, Tooltip } from '@mui/material';
import Background from '../assets/images/background.png';

// CompanyName styled component
export const CompanyName = styled('h1')(({ theme }) => ({
  fontSize: '2rem',
  fontWeight: 'bold',
  marginBottom: '20px',
  color: theme.palette.common.white,  // Bright color for dark background
  textShadow: '2px 2px 4px rgba(0, 0, 0, 0.5)', // Optional: adding a subtle shadow for better legibility
}));

export const ActualCompanyName = styled('h2')(({ theme }) => ({
  fontSize: '1.5rem',      // Slightly smaller than the main title
  fontWeight: '600',       // Semi-bold, not as bold as the main title
  marginBottom: '15px',    // Some space before the next element
  color: theme.palette.common.white,  // Bright color for dark background
  textShadow: '1px 1px 3px rgba(0, 0, 0, 0.5)', // Optional: subtle shadow for better legibility
}));



export const EditButton = styled(Button)(({ theme }) => ({
  backgroundColor: theme.palette.oceanicDeep.light,
  '&:hover': {
    backgroundColor: theme.palette.oceanicDeep.main,
  },
}));

export const AddEmployeeButton = styled(Button)(({ theme }) => ({
  backgroundColor: theme.palette.primary.light,
  '&:hover': {
    backgroundColor: theme.palette.primary.main,
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
}));

// DisableButton styled component
export const DisableButton = styled(Button)(({ theme }) => ({
  color: theme.palette.common.white,
  backgroundColor: theme.palette.rusticRedwood.light,  // changed from main to light
  '&:hover': {
    backgroundColor: theme.palette.rusticRedwood.main,  // changed from dark to main
  }
}));

// EnableButton styled component
export const EnableButton = styled(Button)(({ theme }) => ({
  color: theme.palette.common.white,
  backgroundColor: theme.palette.primary.light,  // changed from main to light
  '&:hover': {
    backgroundColor: theme.palette.primary.main,  // changed from dark to main
  }
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
}));

// Alternating Row Colors
export const EmployeeRow = styled(({ isActive, ...otherProps }) => <TableRow {...otherProps} />)(({ theme, isActive }) => ({
  backgroundColor: isActive ? theme.palette.action.hover : theme.palette.error.light,
  '&:nth-of-type(odd)': {
    backgroundColor: isActive ? 'inherit' : theme.palette.error.light,
  },
  '&:hover': {
    backgroundColor: theme.palette.action.selected,
  },
}));

// Table Header Styling
export const HeaderCell = styled(TableCell)(({ theme }) => ({
  fontWeight: 'bold',
  color: theme.palette.text.primary,
  borderBottom: '2px solid ' + theme.palette.divider,
}));

export const UploadCSVButton = styled(Button)(({ theme }) => ({
  backgroundColor: theme.palette.urbanJungle.light,  // changed from main to light
  color: theme.palette.urbanJungle.contrastText,
  '&:hover': {
    backgroundColor: theme.palette.urbanJungle.main,  // changed from dark to main
  },
}));

export const BulkEditButton = styled(Button)(({ theme }) => ({
  backgroundColor: theme.palette.earthyClay.light,  // changed from main to light
  color: theme.palette.earthyClay.contrastText,
  '&:hover': {
    backgroundColor: theme.palette.earthyClay.main,  // changed from dark to main
  },
}));

export const StyledPaper = styled(Paper)(({ theme }) => ({
  padding: '20px',
  boxShadow: '0 4px 6px rgba(0, 0, 0, 0.1)',
  backgroundImage: `url(${Background})`,
  backgroundSize: 'cover',  // This will ensure the image covers the entire paper.
  backgroundRepeat: 'no-repeat',
  backgroundPosition: 'center',  // This will center the image in the paper.
}));