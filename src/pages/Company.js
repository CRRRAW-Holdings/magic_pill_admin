import React, { useContext, useEffect } from 'react';
import { Link as RouterLink } from 'react-router-dom';
import {
  Wrapper,
  CardContainer,
  CompanyCard,
  CompanyLink,
  Title,
  Content,
  CompanyList,
  SearchBar,
  ErrorMessage
} from '../styles/companyComponents';
import { useDispatch, useSelector } from 'react-redux';
import { setSearchTerm, fetchAdminDetails } from '../slices/companySlice';
import {
  selectCurrentAdmin,
  selectSearchTerm,
  selectHasError,
  selectErrorMessage,
} from '../selectors';
import { CardContent } from '@mui/material';
import { AuthContext } from '../utils/AuthProvider';
import { LogoutButton } from '../styles/buttonComponents';

const Company = () => {
  const dispatch = useDispatch();
  const { currentUser, signOut } = useContext(AuthContext);

  const currentAdmin = useSelector(selectCurrentAdmin);
  const searchTerm = useSelector(selectSearchTerm);
  const hasError = useSelector(selectHasError);
  const errorMessage = useSelector(selectErrorMessage);

  useEffect(() => {
    dispatch(fetchAdminDetails(currentUser.email));

  }, [dispatch]);  

  const filteredCompanies = currentAdmin?.companies?.filter(company =>
    company.name.toLowerCase().includes(searchTerm.toLowerCase())
  ) || [];

  return (
    <Wrapper>
      <Content>
        <Title variant="h4" component="h1" gutterBottom>
          Select Company
        </Title>
        <LogoutButton variant="contained" color="secondary" onClick={signOut}>
          Logout
        </LogoutButton>
        <SearchBar
          type="text"
          placeholder="Search for a company..."
          value={searchTerm}
          onChange={e => dispatch(setSearchTerm(e.target.value))}
        />
        {hasError &&
          <ErrorMessage>
            {errorMessage}
          </ErrorMessage>
        }
        <CompanyList>
          {filteredCompanies.map((company) => (
            <RouterLink
              to={`/company/${company.companyId}`}
              style={{ textDecoration: 'none' }}
              key={company.companyId}
            >
              <CompanyCard>
                <CardContent>
                  <CardContainer>
                    <CompanyLink>
                      {company.name}
                    </CompanyLink>
                  </CardContainer>
                </CardContent>
              </CompanyCard>
            </RouterLink>
          ))}
        </CompanyList>
      </Content>
    </Wrapper>
  );
};

export default Company;