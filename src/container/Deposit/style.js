import styled from 'styled-components';
import { bridgeTheme } from './../globalStyle';


export const DepositWrapper = styled.div`
  position: relative;
  min-height: 460px;
  padding: 8px 0;
  display: flex;
  flex-direction: column;
  .next-button {
    position: absolute;
    bottom: 0;
    width: 100%;
    margin: 0;
  }
  .balance-info {
    padding: 0 4px;
    text-align: center;
    color: #666;
    p span {
      color: ${bridgeTheme.secondaryColor};
      font-weight: 500;
    }
  }
`;
