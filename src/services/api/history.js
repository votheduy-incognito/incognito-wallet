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