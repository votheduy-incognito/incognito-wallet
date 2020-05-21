export const getPrice = ({ token, tokenUSDT }) => {
  const { pricePrv } = tokenUSDT;
  const defaultValue = {
    pricePrv: 0.5,
    change: '0',
  };
  if (!tokenUSDT || !pricePrv) {
    return defaultValue;
  }
  if (token?.isMainCrypto) {
    return {
      change: '0',
      pricePrv: 1,
    };
  }
  return {
    change: token?.change || defaultValue.change,
    pricePrv:
      token?.pricePrv !== 0 ? token?.pricePrv : token?.priceUsd / pricePrv,
  };
};
