import styled from 'styled-components';
import Card from '@mui/material/Card';
import Button from '@mui/material/Button';
import Typography from '@mui/material/Typography';
import Background from '../assets/images/background.png';

// Wrapper styles
const Wrapper = styled.div`
  background-size: cover;
  display: flex;
  flex-direction: column;
  align-items: center;
  min-height: 100vh;
  background: url(${Background}) no-repeat center center fixed;
  -webkit-background-size: cover;
  -moz-background-size: cover;
  -o-background-size: cover;
`;

// CardContainer styles
const CardContainer = styled.div`
  display: flex;
  flex-direction: column;
  align-items: center;
  justify-content: center;
  width: 100%;
`;

// CompanyCard styles
const CompanyCard = styled(Card)`
  width: 400px;
  flex-direction: column;
  align-items: center;
  justify-content: center;
  margin: 10px 0;
  padding: 10px;
  cursor: pointer;
  transition: transform 0.2s;
  box-shadow: 0 4px 8px rgba(0, 0, 0, 0.2);
  border-radius: 5px;
  background-color: rgba(255, 255, 255, 0.1);
  
  &:hover {
    transform: scale(1.1);
  }
`;

// CompanyLink styles
const CompanyLink = styled(Button)`
  color: purple;
  text-decoration: none;

  &:hover {
    background-color: rgba(75, 0, 130, 0.1);
    text-decoration: none;
    transform: none;
  }
  
  &:active {
    color: #a0a0a0;
  }
  && {
    font-family: 'Roboto', sans-serif;
    font-size: 1.5em;
    color: purple;
    text-decoration: none;
  
    &:hover {
      background-color: rgb(75,0,130);
      color: #FFFFFF;
      text-decoration: none;
      transform: none;
    }
  
    &:active {
      color: #a0a0a0;
    }
  }
  
`;

// Title styles
const Title = styled(Typography)`
  font-family: 'Roboto', sans-serif;
  margin-top: 50px;
  color: #ffffff;
  font-weight: 500;
  font-size: 3em;  // Increased from default size
  letter-spacing: 1.2px;
  text-transform: capitalize;
`;

// Content styles
const Content = styled.div`
  margin-top: 40px;
  display: flex;
  flex-direction: column;
  align-items: center;
  height: calc(100vh - someValue);
  justify-content: flex-start;
`;

// CompanyList styles
const CompanyList = styled.div`
  display: flex;
  flex-direction: column;
  align-items: center;
  width: 700px;
  max-height: calc(100vh - someValue);
  overflow-y: scroll;

  &::-webkit-scrollbar-thumb {
    background-color: rgba(128, 0, 128, 0.4);
    border-radius: 10px;
  }
  
  &::-webkit-scrollbar-track {
    background-color: rgba(0, 0, 0, 0.2);
  }
`;

// SearchBar styles
const SearchBar = styled.input`
  margin-bottom: 20px;
  padding: 10px;
  width: 90%;
  border: 1px solid #ccc;
  border-radius: 4px;
  outline: none;
  background-color: rgba(255, 255, 255, 0.1);
  color: #fff;

  &::placeholder {
    color: #aaa;
  }

  &:focus {
    border-color: #666;
  }
`;

// ErrorMessage styles
const ErrorMessage = styled.div`
  color: #ff0000;
  font-size: 0.9em;
  margin-top: 20px;
  display: flex;
  align-items: center;
  gap: 10px;
`;

export {
  Wrapper,
  CardContainer,
  CompanyCard,
  CompanyLink,
  Title,
  Content,
  CompanyList,
  SearchBar,
  ErrorMessage
};