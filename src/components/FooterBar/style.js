import styled from 'styled-components';

export const FooterWrapper = styled.div`
  display: flex;
  flex-direction: row;
  align-items: center;
  justify-content: space-between;
  padding-top: 40px;
  padding-bottom: 40px;
  width: 100%;
  .footer-menu {
    margin: 0;
    padding: 0;
    list-style-type: none;
    li {
      padding: 4px;
      display: inline-block;
    }
  }

  @media (max-width: 680px) {
    flex-direction: column;
  }
  
`;