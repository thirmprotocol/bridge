import { Stepper } from '@material-ui/core';
import styled from 'styled-components';

export const WithdrawWrapper = styled.div`
  .button-groups {
    button {
      margin: 8px 0;
    }
  }
  .balance-info {
    padding: 0 4px;
    text-align: right;
    p span {
      color: #0652DD;
      font-weight: 500;
      text-decoration: underline;
      cursor: pointer;
    }
  }

  position: relative;
  min-height: 450px;
  padding: 8px 0;
  .next-button {
    position: absolute;
    bottom: 0;
    width: 100%;
    margin: 0;
  }
`;

export const StyledStepper = styled(Stepper)`
  margin-left: -25px;
  margin-right: -30px;
`;