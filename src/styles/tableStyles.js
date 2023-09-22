import { styled } from '@mui/material/styles';
import clsx from 'clsx';
import {
  TableRow,
  TableCell,
  Table,
  TableContainer,
} from '@mui/material';

// Icon TableCell with adjusted padding and width
export const IconTableCell = styled(TableCell)(({ theme }) => ({
  width: 'auto', 
}));

// Table Row for the Update Tab with a grey background and bold font
export const UpdateTabFirstRow = styled(TableRow)(({ theme }) => ({
  backgroundColor: theme.palette.grey[200],
  fontWeight: 'bold',
}));

// Table Row for headers with a grey background and bold font
export const HeaderTableRow = styled(TableRow)(({ theme }) => ({
  backgroundColor: theme.palette.grey[200],
  fontWeight: 'bold',
}));

// TableRow with different background colors based on the row type (e.g., add, edit, disable)
export const StyledTableRow = styled(TableRow)(({ theme, rowType }) => {
  const classes = {
    add: {
      '&:hover': { backgroundColor: theme.palette.success.main, borderRadius: '5px' },
      '&:active': { backgroundColor: theme.palette.success.dark, borderRadius: '5px' },
      backgroundColor: theme.palette.success.light,
      borderRadius: '5px',
    },
    edit: {
      '&:hover': { backgroundColor: theme.palette.warning.light, borderRadius: '5px' },
      '&:active': { backgroundColor: theme.palette.warning.light, borderRadius: '5px' },
      backgroundColor: theme.palette.baseWhite.main,
      borderRadius: '5px',
    },
    disable: {
      '&:hover': { backgroundColor: theme.palette.error.main, borderRadius: '5px' },
      '&:active': { backgroundColor: theme.palette.error.dark, borderRadius: '5px' },
      backgroundColor: theme.palette.error.light,
      borderRadius: '5px',
    },
  };
  return clsx(classes[rowType]);
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


export const StyledTableCell = styled(TableCell)(({ theme }) => ({
  padding: theme.spacing(1, 2),
  justifyContent: 'space-between',
  textAlign: 'left',  // Change this to 'left'
}));

export const HeaderCell = styled(TableCell)(({ theme }) => ({
  fontWeight: 'bold',
  color: theme.palette.text.primary,
  borderBottom: '2px solid ' + theme.palette.divider,
  position: 'sticky',
  top: 0,
  zIndex: 1,  // Optional: to ensure header stays on top
  background: '#fff',
  textAlign: 'left'  // Change this to 'left'
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
  