import { AppBar, Card } from '@material-ui/core';
import Alert from '@material-ui/lab/Alert';
import styled from 'styled-components';


export const MainWrapper = styled.div`
  margin: auto 0px;
`;

export const MainCard = styled(Card)`
  width: 100%;
  min-height: 600px;
`

export const MainAppBar = styled(AppBar)`
  background: #8E2DE2;
  background: -webkit-linear-gradient(to right, #4A00E0, #8E2DE2);
  background: linear-gradient(to right, #4A00E0, #8E2DE2);
  .MuiTabs-flexContainer {
    height: 60px;
  }
`;

export const MainAlert = styled(Alert)`
  margin: 24px 0;
  text-align: center;
`