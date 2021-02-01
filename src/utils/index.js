import { Contract } from '@ethersproject/contracts';
import ttokensAbi from '../utils/abis/ttokens.json';

export const getThirmTokenContract = (library, account, address) => {
  return new Contract(address, ttokensAbi, library.getSigner(account).connectUnchecked());
}