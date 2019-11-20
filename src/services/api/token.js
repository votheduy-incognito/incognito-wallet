import Erc20Token from '@src/models/erc20Token';
import PToken from '@src/models/pToken';
import BEP2Token from '@models/bep2Token';
import http from '@src/services/http';
import { CONSTANT_CONFIGS } from '@src/constants';
import axios from 'axios';

let BEP2Tokens = [];

export const getTokenList = () =>
  http.get('ptoken/list')
    .then(res => res.map(token => new PToken(token)));

export const detectERC20Token = erc20Address => {
  if (!erc20Address) throw new Error('Missing erc20Address to detect');
  return http.post('eta/detect-erc20', {
    Address: erc20Address
  })
    .then(res => new Erc20Token(res));
};

export const detectBEP2Token = async (symbol) => {
  if (!symbol) throw new Error('Missing BEP2 symbol to detect');

  if (BEP2Token.length === 0) {
    const res = await axios.get(`${CONSTANT_CONFIGS.DEX_BINANCE_TOKEN_URL}?limit=1000000`);
    BEP2Tokens = res.data.map(item => new BEP2Token(item));
  }

  return BEP2Tokens.find(item => item.originalSymbol === symbol);
};

export const addERC20Token = ({ symbol, name, contractId, decimals }) => {
  const parseDecimals = Number(decimals);

  if (!symbol) throw new Error('Missing symbol');
  if (!name) throw new Error('Missing name');
  if (!contractId) throw new Error('Missing contractId');
  if (!Number.isInteger(parseDecimals)) throw new Error('Invalid decimals');

  return http.post('ptoken/add', {
    Symbol: symbol,
    Name: name,
    ContractID: contractId,
    Decimals: parseDecimals
  })
    .then(res => new PToken(res));
};

export const addBEP2Token = ({ symbol, name, originalSymbol }) => {
  if (!symbol) throw new Error('Missing symbol');
  if (!name) throw new Error('Missing name');
  if (!originalSymbol) throw new Error('Missing originalSymbol');

  return http.post('ptoken/bep2/add', {
    Symbol: symbol,
    Name: name,
    OriginalSymbol: originalSymbol,
  }).then(res => new PToken(res));
};
