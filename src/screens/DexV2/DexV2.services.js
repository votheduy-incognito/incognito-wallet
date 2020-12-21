import { CONSTANT_COMMONS, TRADING } from '@src/constants';
import http from '@src/services/http';
import convertUtils from '@utils/convert';
import BigNumber from 'bignumber.js';
import { sortBy } from 'lodash';

const { PROTOCOLS } = TRADING;

export const apiGetQuote = async ({
  inputToken,
  outputToken,
  protocol,
  amountIn,
  amountOut,
}) => {
  const supportedProtocols = {
    [PROTOCOLS.KYBER]: apiGetKyberQuote,
  };
  return await supportedProtocols[protocol]({
    inputToken,
    outputToken,
    amountIn,
    amountOut,
  });
};

export const apiGetKyberQuote = async ({ inputToken, outputToken, amountIn, amountOut }) => {
  let srcToken = inputToken?.address;
  let destToken = outputToken?.address;
  let originaAmount;
  let suffix;
  if (amountIn) {
    originaAmount = convertUtils.toDecimals(amountIn || 0, inputToken);
    suffix = 'AmountIn';
  } else {
    originaAmount = convertUtils.toDecimals(amountOut || 0, outputToken);
    suffix = 'AmountOut';
  }
  if (inputToken.symbol === CONSTANT_COMMONS.CRYPTO_SYMBOL.ETH) {
    srcToken = '0x0000000000000000000000000000000000000000';
  }
  if (outputToken?.symbol === CONSTANT_COMMONS.CRYPTO_SYMBOL.ETH) {
    destToken = '0x0000000000000000000000000000000000000000';
  }

  const rates = await http.get(
    `uniswap/rate?SrcToken=${srcToken}&DestToken=${destToken}&${suffix}=${originaAmount}`,
  );
  const bestRate = rates?.ListRate?.find(
    (rate) => rate?.DappName === rates?.DappName,
  );
  let expectAmount, protocol, dAppAddress, maxAmountIn, maxAmountOut;
  let priorityList = {};
  if (bestRate) {
    try {
      maxAmountIn = BigNumber(
        bestRate?.AmountInput || rates?.AmountInput || 0,
      )
        .dividedToIntegerBy(1)
        .toNumber();
      maxAmountOut = BigNumber(
        bestRate?.AmountOutput || rates?.AmountOutput || 0,
      )
        .dividedToIntegerBy(1)
        .toNumber();
      expectAmount  = bestRate?.RatioTrade || rates?.RatioTrade;
      protocol      = bestRate?.DappName || rates?.DappName;
      dAppAddress   = bestRate?.DappAddress || rates?.DappAddress;

      const priorityArray = sortBy(bestRate?.Fee || [], ['PRVAmount']);
      priorityArray.forEach((priority, index) => {
        const key          = priority?.Name.toUpperCase();
        const tradingFee   = BigNumber(priority?.PRVAmount || 0)
          .dividedToIntegerBy(1)
          .toNumber() || 0;
        const gasPrice     = priority?.GasPrice;
        const number       = ++index;
        priorityList[key]  = { key, tradingFee, number, gasPrice };
      });
    } catch (e) {
      console.debug('ERROR', e);
    }
  }
  const data = {
    maxAmountOut,
    maxAmountIn,
    expectAmount,
    protocol,
    dAppAddress,
    priorityList,
    network: TRADING.ERC20_NETWORK[protocol] || TRADING.ERC20_NETWORK['PDex'],
    crossTrade:
      TRADING.ERC20_NETWORK[protocol] === TRADING.ERC20_NETWORK['PDex'],
  };
  console.debug('RESPONSE GETTING QUOTE ERC20 BEST RATE: ', bestRate);
  console.debug('RESPONSE GETTING QUOTE ERC20 DATA: ', data);
  return data;
};

export const apiTradePKyber = (data) => http.post('/uniswap/execute', data);
