import http from '@src/services/http';
import historyModel from '@src/models/history';

export const getpTokenHistory = ({ paymentAddress, tokenId }) => {
  return http.get('eta/history', {
    params: {
      WalletAddress: paymentAddress,
      PrivacyTokenAddress: tokenId
    }
  }).then(res => {
    return res && res.map(history => {
      return historyModel.parsePrivateTokenFromApi(history);
    });
  });
};

export const removeHistory = ({ historyId, currencyType }) => {
  if (typeof historyId !== 'number' && !Number.isFinite(historyId)) return throw new Error('Invalid historyId');
  if (typeof currencyType !== 'number' && !Number.isFinite(currencyType)) return throw new Error('Invalid currencyType');

  return http.post('eta/remove', {
    CurrencyType: currencyType,
    ID: historyId
  });
};