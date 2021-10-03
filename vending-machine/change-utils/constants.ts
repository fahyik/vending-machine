import { Change } from "../bank";

export const DENOMINATION_VALUE: Change = {
  "1p": 1,
  "2p": 2,
  "5p": 5,
  "10p": 10,
  "20p": 20,
  "50p": 50,
  "100p": 100,
  "200p": 200,
};

export const DENOMINATIONS: (keyof Change)[] = [
  "1p",
  "2p",
  "5p",
  "10p",
  "20p",
  "50p",
  "100p",
  "200p",
];
