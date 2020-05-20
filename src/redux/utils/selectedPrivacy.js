import isNaN from 'lodash/isNaN';

export const getPrice = ({ token, exchangeRate }) => {
  const { prv, data } = exchangeRate;
  const defaultValue = {
    pricePrv: 0,
    change: prv?.Change || '0',
  };
  if (!prv) {
    return defaultValue;
  }
  if (token?.isMainCrypto) {
    return {
      ...defaultValue,
      pricePrv: 1,
    };
  }
  const priceOnePRV = Number(prv?.Price);
  // const tokenPairWithPRV = data.find(
  //   item => item?.Base === token?.externalSymbol,
  // );
  // if (tokenPairWithPRV) {
  //   const priceTokenPair = Number(tokenPairWithPRV.Price) / priceOnePRV;
  //   return {
  //     change: tokenPairWithPRV?.Change || defaultValue.change,
  //     pricePrv: !isNaN(priceTokenPair) ? priceTokenPair : defaultValue.price,
  //   };
  // }
  const price = Number(token?.priceUsd) / priceOnePRV;
  return {
    change: token?.change || defaultValue.change,
    pricePrv: token?.pricePrv !== 0 ? token?.pricePrv : price,
  };
};
