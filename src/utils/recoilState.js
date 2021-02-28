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

export const thirmBalState = atom({
  key: 'thirm',
  default: "0.00000000",
});

export const tokenBalState = atom({
  key: 'token',
  default: "0.00000000",
});