const HELPER_CONSTANT = {
  FEE: {
    title: 'Fee',
    content: 'Incognito charges only network fees. Uniswap and Kyber pools will also incur cross-chain fees.'
  },
  NETWORK: {
    title: 'Pool',
    content: 'The best pool for this trade, taking into account prices and fees from Uniswap, Kyber and Incognito.'
  },
  MAX_PRICE: {
    title: 'Max price',
    content: 'This is the maximum price you are willing to accept for this trade.\n' +
      '\n' +
      'It takes into account 1% slippage tolerance, which covers the potential price variance between the time of trade request and the time of execution. Your trade will go through at this price or better.',
  },
  PRICE_IMPACT: {
    title: 'Max price impact',
    content: 'This is the percentage difference between external market prices and your pDEX trade price. You may experience either positive or negative price impacts.\n\n' +
      '+1% max price impact means you’ll gain at least 1%\n\n' +
      '-1% max price impact means you’ll lose at most 1%\n\n' +
      'The percentage shown for price impact takes into account 1% slippage tolerance by default, and may change in your favor after the trade has been executed.\n\n' +
      'Price impact is affected by the size of your trade in relation to the balance of liquidity available. Bigger trades have larger price impacts.',
  },
  WARNING: {
    title: 'Warning',
    content: 'Do note that due to trade size, the price of this trade varies significantly from market price.',
  }
};

export default { HELPER_CONSTANT };