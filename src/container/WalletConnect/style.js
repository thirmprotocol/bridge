import styled from 'styled-components';


export const ConnectWrapper = styled.div`
  margin: 180px 36px;
  text-align: center;
  .heading-info {
    font-size: 45px;
    margin: 24px 0;
  }
  .sub-heading-info {
    font-size: 18px;
    margin: 36px 0;
  }
  .button-label {
    margin-left: 16px;
  }
  .error-message {
    margin: 36px 0;
  }

  @media (max-width: 680px) {
    margin: 36px 8px;
  }
`;