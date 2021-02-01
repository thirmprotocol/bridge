import { Container } from '@material-ui/core';
import React from 'react';
import { Route, Switch } from 'react-router-dom';
import FooterBar from './../components/FooterBar/index';
import HeaderBar from './../components/HeaderBar/index';
import { MainContentWrapper } from './globalStyle';
import MainPage from './MainPage/index';
import Web3Wrapper from './Web3Wrapper/index';

function MainContent() {

  return (
    <Container maxWidth="md">
      <MainContentWrapper>
        <HeaderBar />
        <Web3Wrapper>
          <Switch>
            <Route exact path="/" component={() => <MainPage />} />
          </Switch>
        </Web3Wrapper>
        <FooterBar />
      </MainContentWrapper>
    </Container>
  );
}

export default MainContent;