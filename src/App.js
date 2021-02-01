import { Web3Provider } from '@ethersproject/providers';
import { Web3ReactProvider } from '@web3-react/core';
import { BrowserRouter as Router } from 'react-router-dom';
import {
  RecoilRoot
} from 'recoil';
import MainContent from './container/index';

function getLibrary(provider) {
  const library = new Web3Provider(provider);
  library.pollingInterval = 12000;
  return library;
}

function App() {
  return (
    <RecoilRoot>
      <Web3ReactProvider getLibrary={getLibrary}>
        <Router>
          <MainContent />
        </Router>
      </Web3ReactProvider>
    </RecoilRoot>
  );
}

export default App;
