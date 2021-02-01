import { Container } from '@material-ui/core';
import React from 'react';
import { Route, Switch } from 'react-router-dom';
import HeaderBar from './../components/HeaderBar/index';
import MainPage from './MainPage/index';
import Web3Wrapper from './Web3Wrapper/index';

function MainContent() {

  return (
    <Container maxWidth="md">
      <HeaderBar />
      <Web3Wrapper>
        <Switch>
          <Route exact path="/" component={() => <MainPage />} />
        </Switch>
      </Web3Wrapper>
    </Container>
  );
}

export default MainContent;