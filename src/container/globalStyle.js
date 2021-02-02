import { List, ListItem } from '@material-ui/core';
import Button from '@material-ui/core/Button';
import styled from 'styled-components';

export const StyledButton = styled(Button)`
  height: 60px;
  margin: 16px 0;
  span {
    margin-right: 4px;
  }
  svg {
    font-size: 32px;
  }
`;

export const StyledListItem = styled(ListItem)`
  margin: 12px 0;
  span.MuiListItemText-primary {
    font-weight: 500;
  }
`;

export const StyledList = styled(List)`
  margin: 16px 0;
  background: #f1f1f1;
  background: -webkit-linear-gradient(to right, #eef2f3, #f1f1f1);
  background: linear-gradient(to right, #eef2f3, #f1f1f1); 
  border: 1px solid #e3e3e3;
  padding: 8px 4px;
  border-radius: 5px;

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