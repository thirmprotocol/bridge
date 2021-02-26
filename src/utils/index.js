import { Contract } from '@ethersproject/contracts';
import ttokensAbi from '../utils/abis/ttokens.json';

export const getThirmTokenContract = (library, account, address) => {
  return new Contract(address, ttokensAbi, library.getSigner(account).connectUnchecked());
}

export const formatAddress = (address) => {
  return `${address.substr(0, 8)}...${address.substr(address.length - 4, address.length)}`;
}