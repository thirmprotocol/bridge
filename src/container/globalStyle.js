import { List, ListItem } from '@material-ui/core';
import Button from '@material-ui/core/Button';
import styled from 'styled-components';

export const StyledButton = styled(Button)`
  height: 60px;
  margin: 16px 0;
  background-image: linear-gradient(to right, #0652DD 0%, #512DA8  51%, #673AB7  100%);
  text-align: center;
  text-transform: uppercase;
  transition: 0.5s;
  background-size: 200% auto;
  color: white;            
  box-shadow: 0 0 20px #eee;
  border-radius: 6px;
  &:hover {
    background-position: right center;
    color: #fff;
    text-decoration: none;
  }

  &.Mui-disabled {
    background-image: none;
    background-color: #67e6d2;
  }

  span {
    margin-right: 4px;
  }
  svg {
    font-size: 32px;
  }
`;


export const StyledListItem = styled(ListItem)`
  margin: 4px 0;
  span.MuiListItemText-primary {
    font-weight: 500;
    @media screen and (max-width: 325px) {
      font-size: 0.75rem;
    }
    @media screen and (max-width: 375px) and (min-width: 325px){
      font-size: 0.9rem;
    }
  }
`;

export const StyledList = styled(List)`
  margin: 16px 0;
  background: #f1f1f1;
  background: -webkit-linear-gradient(to right, #eef2f3, #f1f1f1);
  background: linear-gradient(to right, #eef2f3, #f1f1f1); 
  border: 1px solid #e3e3e3;
  padding: 12px 4px;
  border-radius: 5px;

  @media screen and (max-width: 325px) {
    font-size: 0.75rem;
  }

  @media screen and (max-width: 375px) and (min-width: 325px) {
    font-size: 0.9rem;
  }

`;

export const StyledInputArea = styled.div`
  margin: 24px 0;
`;

export const MainContentWrapper = styled.div`
  height: 100vh;
  display: flex;
  flex-direction: column;
`;

export const GoBackButton = styled(Button)`
  margin: 8px 0;
`;