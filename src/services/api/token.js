import Erc20Token from '@src/models/erc20Token';
import PToken from '@src/models/pToken';
import http from '@src/services/http';

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