import { styled } from '@mui/material/styles';

export const NavbarContainer = styled('div')({
  display: 'flex',
  justifyContent: 'space-between',
  alignItems: 'center',
  padding: '10px 20px',
  borderBottom: '1px solid #e0e0e0',
});

export const ActionContainer = styled('div')({
  display: 'flex',
  alignItems: 'center',
  justifyContent: 'space-between',  // Ensures spacing between the elements
  width: '80%',  // Adjust width to fit your design
});