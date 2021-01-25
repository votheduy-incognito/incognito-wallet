import http from '@services/http';

export const apiRefreshHistory = async (txID, currencyType, signPublicKeyEncode, decentralized) => {
  return new Promise((resolve, reject) => {
    return http
      .post('eta/history/detail', {
        ID: txID,
        Decentralized: Number(decentralized),
        CurrencyType: currencyType,
        SignPublicKeyEncode: signPublicKeyEncode,
      })
      .then((res) => {
        resolve(res);
      })
      .catch((error) => {
        reject(error);
      });
  });
};