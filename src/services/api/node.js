import http from '@src/services/http';

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
