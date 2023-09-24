import { styled } from '@mui/material/styles';
import {

  Button, Checkbox, TextField
} from '@mui/material';
import { commonButtonStyles } from '../theme';


export const EditButton = styled(Button)(({ theme }) => ({
  ...commonButtonStyles,  // spread the common styles
  backgroundColor: theme.palette.primary.light,
  '&:hover': {
    backgroundColor: theme.palette.primary.main,
  },
}));

export const AddEmployeeButton = styled(Button)(({ theme }) => ({
  backgroundColor: theme.palette.success.dark,
  fontSize: '1rem',
  padding: '10px 20px',
  minWidth: '100px',
  [theme.breakpoints.down('sm')]: {
    width: 'calc(85% - 10px)',
    marginRight: '10px',
  },
  borderRadius: '8px',
  textTransform: 'uppercase',
  boxShadow: '0px 4px 6px rgba(0, 0, 0, 0.1)',
  '&:hover': {
    backgroundColor: theme.palette.success.light,
    boxShadow: '0px 4px 10px rgba(0, 0, 0, 0.2)',
  },
}));

export const DisableButton = styled(Button)(({ theme }) => ({
  ...commonButtonStyles,  // spread the common styles
  color: theme.palette.common.white,
  backgroundColor: theme.palette.rusticRedwood.light,
  '&:hover': {
    backgroundColor: theme.palette.rusticRedwood.main,
  },
  textAlign: 'justify',
  marginLeft: '20px'
}));

export const EnableButton = styled(Button)(({ theme }) => ({
  ...commonButtonStyles,  // spread the common styles
  color: theme.palette.common.white,
  backgroundColor: theme.palette.oceanicDeep.dark,
  '&:hover': {
    backgroundColor: theme.palette.oceanicDeep.light,
  },
  textAlign: 'justify',
  marginLeft: '20px'
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
  backgroundColor: theme.palette.primary.light,
  color: theme.palette.primary.contrastText,
  '&:hover': {
    backgroundColor: theme.palette.primary.main,
  },
}));

// 4. Form Elements
export const StyledCheckbox = styled(Checkbox)(({ theme }) => ({
  margin: '0 10px',
  cursor: 'pointer',
}));

export const SearchBar = styled(TextField)(({ theme }) => ({
  padding: '10px',
  width: '100%',
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