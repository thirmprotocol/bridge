import {
  atom
} from 'recoil';

export const amountState = atom({
  key: 'amount',
  default: "",
});

export const addressState = atom({
  key: 'address',
  default: "",
});

export const assetState = atom({
  key: 'asset',
  default: 0,
});