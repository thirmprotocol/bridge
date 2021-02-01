import {
  atom
} from 'recoil';

export const amountState = atom({
  key: 'amount',
  default: null,
});

export const addressState = atom({
  key: 'address',
  default: null,
});

export const assetState = atom({
  key: 'asset',
  default: 0,
});