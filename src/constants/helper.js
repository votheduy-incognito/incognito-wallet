const HELPER_CONSTANT = {
  FEE: {
    title: 'Fee',
    content: 'Incognito charges only network fees. Uniswap and Kyber pools will also incur cross-chain fees.'
  },
  COMPANY: {
    content: 'The best pool for this trade, taking into account prices and fees from Uniswap, Kyber and Incognito.'
  },
  MAX_PRICE: {
    title: 'Max price',
    content: 'Max price represents the maximum price you are willing to accept for this trade. This takes into account a 1% slippage tolerance, which covers the potential variance in price between the time of trade request and the time of execution. Your trade will go through at this prize or better.',
  },
  PRICE_IMPACT: {
    title: 'Price impact',
    content: 'Price impact is a percentage difference between market price and trade price based on the size of your trade. Bigger trades have larger price impacts.\n\n' +
      '-1% price impact means you’ll lose 1% on this trade, compared to market value.\n\n' +
      '+1% price impact means you’ll gain 1% on top of market value for this trade.\n\n' +
      'The percentage shown for price impact takes into account 1% slippage tolerance by default, and as such, may change in your favor after the trade has been executed.',
  },
  WARNING: {
    title: 'Warning',
    content: 'Do note that due to trade size, the price of this trade varies significantly from market price.',
  }
};

export default { HELPER_CONSTANT };