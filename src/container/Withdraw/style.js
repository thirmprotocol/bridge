import { StepContent } from '@material-ui/core';
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
`;

export const StyledStepContent = styled(StepContent)`
  margin-right: -30px;
`;