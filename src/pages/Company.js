import React, { useEffect } from 'react';
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
import { setSearchTerm, fetchCompanies } from '../slices/companySlice';
import { getAdminByEmail } from '../slices/authSlice';
import {
  selectSearchTerm,
  selectHasError,
  selectErrorMessage,
  selectFilteredCompanies
} from '../selectors';
import { CardContent } from '@mui/material';

const Company = () => {
  const dispatch = useDispatch();
  
  const searchTerm = useSelector(selectSearchTerm);
  const hasError = useSelector(selectHasError);
  const errorMessage = useSelector(selectErrorMessage);

  useEffect(() => {
    dispatch(fetchCompanies());
  
    // Fetch admin data
    const email = window.localStorage.getItem('emailForSignIn');
    if (email) {
      dispatch(getAdminByEmail(email));
    }
  }, [dispatch]);  
  


  const filteredCompanies = useSelector(selectFilteredCompanies);

  return (
    <Wrapper>
      <Content>
        <Title variant="h4" component="h1" gutterBottom>
          Select Company
        </Title>
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
              to={`/company/${company.insurance_company_id}`}
              style={{ textDecoration: 'none' }}
              key={company.insurance_company_id}
            >
              <CompanyCard>
                <CardContent>
                  <CardContainer>
                    <CompanyLink>
                      {company.insurance_company_name}
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