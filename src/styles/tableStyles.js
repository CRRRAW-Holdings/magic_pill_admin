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

export const HeaderTableRow = styled(TableRow)(({ theme }) => ({
  backgroundColor: theme.palette.grey[200],
  fontWeight: 'bold',
  position: 'sticky',
  top: 0,
  zIndex: 1,
  borderBottom: `2px solid ${theme.palette.grey.main}`,
}));

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
      backgroundColor: theme.palette.error.main,
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
  '& tbody td': {
    borderBottom: `1px solid ${theme.palette.grey.light}`,
    borderRight: `1px solid ${theme.palette.grey.light}`,
    '&:last-child': { borderRight: 'none' }
  },
}));

const tableContainerStyles = (height) => ({ theme }) => ({
  marginTop: '20px',
  border: `1px solid ${theme.palette.grey.main}`,
  borderRadius: '4px',
  backgroundColor: '#ffffff',
  height,
  overflowY: 'auto',
});

export const StyledTableContainer = styled(TableContainer)(tableContainerStyles('77vh'));
export const DialogStyledTableContainer = styled(TableContainer)(tableContainerStyles('450px'));

export const StyledTableCell = styled(TableCell)(({ theme }) => ({
  padding: theme.spacing(1, 2),
  justifyContent: 'space-between',
  textAlign: 'left',
}));

export const HeaderCell = styled(TableCell)(({ theme }) => ({
  fontWeight: 'bold',
  color: theme.palette.text.primary,
  backgroundColor: theme.palette.grey[200],
}));


export const EmployeeRow = styled(({ isActive, ...otherProps }) => <TableRow {...otherProps} />)(({ theme, isActive }) => ({
  backgroundColor: isActive ? theme.palette.action.hover : theme.palette.error.light,
  height: '80px',
  '&:nth-of-type(odd)': {
    backgroundColor: isActive ? 'inherit' : theme.palette.error.light,
  },
  '&:hover': {
    backgroundColor: theme.palette.grey.main,
  },
}));
