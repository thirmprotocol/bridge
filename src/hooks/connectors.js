/*
 ****************************************************************
 * Connector for web3 To add other connectors
 * check https://codesandbox.io/s/8rg3h?file=/src/connectors.js
 ****************************************************************
 */

import { InjectedConnector } from '@web3-react/injected-connector';
import config from '../utils/config';

export const injected = new InjectedConnector({
  supportedChainIds: [config.chainID],
});
