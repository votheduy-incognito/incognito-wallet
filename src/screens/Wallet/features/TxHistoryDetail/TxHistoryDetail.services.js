import http from '@services/http';

export const apiRefreshHistory = async (txID, currencyType, signPublicKeyEncode) => {
  return new Promise((resolve, reject) => {
    return http
      .get(`eta/history/detail/${txID}`, {
        params: {
          ID: txID,
          CurrencyType: currencyType,
          SignPublicKeyEncode: signPublicKeyEncode,
        },
      })
      .then((res) => {
        resolve(res);
      })
      .catch((error) => {
        reject(error);
      });
  });
};