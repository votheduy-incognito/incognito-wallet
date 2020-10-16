import http from '@services/http';

export const apiRefreshHistory = async (txID) => {
  /*const result = await http.get(`eta/history/detail/${txID}`, {
    params: {
      ID: txID,
      CurrencyType: 1
    },
  });*/
  return new Promise((resolve, reject) => {
    return http
      .get(`eta/history/detail/${txID}`, {
        params: {
          ID: txID,
          CurrencyType: 1
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