export const getPrice = ({ token, tokenUSDT }) => {
  const defaultValue = {
    pricePrv: 0,
    change: '0',
    priceUsd: 0,
  };
  if (!tokenUSDT) {
    return defaultValue;
  }
  const { pricePrv, priceUsd } = tokenUSDT;
  if (token?.isMainCrypto) {
    return {
      change: '0',
      pricePrv: 1,
      priceUsd: priceUsd / pricePrv || 0,
    };
  }
  return {
    change: token?.change || defaultValue.change,
    pricePrv: token?.pricePrv !== 0 ? token?.pricePrv : 0,
    priceUsd: token?.priceUsd !== 0 ? token?.priceUsd : 0,
  };
};
