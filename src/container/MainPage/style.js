import { AppBar, Card } from '@material-ui/core';
import styled from 'styled-components';


export const MainWrapper = styled.div`
  margin: auto 0px;
`;

export const MainCard = styled(Card)`
  box-shadow: 0 5px 10px rgba(154, 160, 185, 0.05), 0 15px 40px rgba(166, 173, 201, 0.1);
`

export const MainAppBar = styled(AppBar)`
  background: #8E2DE2;
  background: -webkit-linear-gradient(to right, #4A00E0, #8E2DE2);
  background: linear-gradient(to right, #4A00E0, #8E2DE2);

  .MuiTabs-flexContainer {
    height: 60px;
  }

`