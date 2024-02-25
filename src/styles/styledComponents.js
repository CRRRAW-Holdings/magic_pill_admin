import { styled } from '@mui/material/styles';
import PropTypes from 'prop-types';
import { Paper, Tooltip, InputAdornment, IconButton } from '@mui/material';
import Background from '../assets/images/background.png';
import SearchIcon from '@mui/icons-material/Search';
import Checkbox from '@mui/material/Checkbox';
import { SearchBar } from './buttonComponents';

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
// 2. Headers
export const CompanyName = styled('h1')(({ theme }) => ({
  fontSize: '2rem',
  fontFamily: 'Roboto, sans-serif',
  fontWeight: 'bold',
  color: theme.palette.common.white,
  textShadow: '2px 2px 4px rgba(0, 0, 0, 0.5)',
}));

export const ActualCompanyName = styled('h2')(({ theme }) => ({
  fontSize: '1.5rem',
  fontFamily: 'Roboto, sans-serif',
  fontWeight: '600',
  color: theme.palette.common.white,
  textShadow: '1px 1px 3px rgba(0, 0, 0, 0.5)',
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

// 5. Containers
export const StyledPaper = styled(Paper)(({ theme }) => ({
  padding: '10px',
  margin: '16px 32px',
  boxShadow: '0 4px 6px rgba(0, 0, 0, 0.1)',
  backgroundImage: `url(${Background})`,
  backgroundSize: 'cover',
  backgroundRepeat: 'no-repeat',
  backgroundPosition: 'center',
  
}));

// 6. Tooltips
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

StyledSearchBar.propTypes = {
  InputProps: PropTypes.object,
};
