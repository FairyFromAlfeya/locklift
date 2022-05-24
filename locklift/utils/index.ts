import fs from 'fs';
import { BigNumber } from 'bignumber.js';

export const loadJSONFromFile = (filePath) => {
  return JSON.parse(fs.readFileSync(filePath, 'utf8'));
};

export const loadBase64FromFile = (filePath) => {
  return fs.readFileSync(filePath, 'utf8').split('\n').join('');
};

export const convertCrystal = (amount, dimension) => {
  const crystalBN = new BigNumber(amount);

  if (dimension === 'nano') {
    return crystalBN.times(10 ** 9).toFixed(0);
  } else if (dimension === 'ton') {
    return crystalBN.div(new BigNumber(10).pow(9));
  }
};

export const getRandomNonce = () => (Math.random() * 64000) | 0;

export const zeroAddress =
  '0:0000000000000000000000000000000000000000000000000000000000000000';
