import { Stepper } from '@material-ui/core';
import styled from 'styled-components';

export const WithdrawWrapper = styled.div`
  .button-groups {
    button {
      margin: 8px 0;
    }
  }
  position: relative;
  min-height: 470px;
  padding: 0;
  .next-button {
    position: absolute;
    bottom: 0;
    width: 100%;
    margin: 0;
  }
`;

export const StyledStepper = styled(Stepper)`
  margin: 24px 0;
`;