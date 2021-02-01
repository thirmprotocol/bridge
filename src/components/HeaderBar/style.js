import { Card } from '@material-ui/core';
import styled from 'styled-components';


export const HeaderWrapper = styled.div`
  display: flex;
  flex-direction: row;
  align-items: center;
  justify-content: space-between;

`;

export const ConnectionCard = styled(Card)`
  padding: 16px;
  width: 250px;
  .connection-info {
    width: 100%;
    margin: 0;
    padding: 0;
    list-style-type: none;
   .connection-info-list {

     display: flex;
     flex-direction: row;
     justify-content: space-between;
     align-items: center;
     padding: 4px;
     p {
       color: blue;
     }
   }
 }
`;