import http from '@src/services/http';
import PToken from '@models/pToken';

const url = 'pool/request-unstake';

export const unstakePNode = ({ productId, qrCode, paymentAddress }) => {
  return http.post(url, {
    ProductID: productId,
    QRCode: qrCode,
    PaymentAddress: paymentAddress,
  });
};

export const getUnstakePNodeStatus = async ({ paymentAddress }) => {
  try {
    const data = await http.get(url, {
      params: {
        PaymentAddress: paymentAddress,
      }
    });

    return data.Status;
  } catch {
    return 0;
  }
};

export const getPTokenSupportForBuyingDevice = () => {
  return http.get('order/tokens-support')
    .then(res => res.map(token => new PToken(token)));
};

export const getNodePrice = () => {
  return http.get('order/price');
};
