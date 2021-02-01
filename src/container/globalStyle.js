import { ListItem } from '@material-ui/core';
import Button from '@material-ui/core/Button';
import styled from 'styled-components';

export const StyledButton = styled(Button)`
  height: 60px;
  margin: 16px 0;
`;

export const StyledListItem = styled(ListItem)`
  margin: 16px 0;
  span.MuiListItemText-primary {
    font-weight: 500;
  }
`;

export const StyledInputArea = styled.div`
  margin: 24px 0;
`;

export const MainContentWrapper = styled.div`
  position: relative;
  height: 100vh;
`;