import { createSelector } from 'reselect';
import format from '@utils/format';
import { PRV_ID } from '@screens/Dex/constants';
import memoize from 'memoize-one';
import { COINS } from '@src/constants';
import {getTradingFee} from '@screens/DexV2/components/Trade/TradeV2/Trade.utils';

export const tradeSelector = createSelector(
  (state) => state.trade,
  (trade) => {
    return {
      ...trade,

      loadingPair:      trade?.loadingPair,
      pairs:            trade?.pairs,
      tokens:           trade?.tokens,
      pairTokens:       trade?.pairTokens,
      shares:           trade?.shares,
      erc20Tokens:      trade?.erc20Tokens,

      pair:             trade?.pair,

      fee:              trade?.fee,
      feeToken:         trade?.feeToken,
      originalFee:      trade?.originalFee,
      originalFeeToken: trade?.originalFeeToken,
      canChooseFee:     trade?.canChooseFee,

      inputToken:       trade?.inputToken,

      inputText:        trade?.inputText,
      inputValue:       trade?.inputValue,

      outputToken:      trade?.outputToken,
      outputList:       trade?.outputList,

      outputText:       trade?.outputText,
      minimumAmount:    trade?.minimumAmount,
      loadingBox:       trade?.loadingBox,
      quote:            trade?.quote,
      isErc20:          !!(trade?.inputToken?.address && trade?.outputToken?.address),
      priority:         trade?.priority,
      priorityList:     trade?.priorityList,

      inputBalance:     trade?.inputBalance,
      inputBalanceText: trade?.inputBalanceText,
      prvBalance:       trade?.prvBalance,
      lastInputToken:   trade?.lastInputToken,
      lastAccount:      trade?.lastAccount
    };
  }
);

export const tradingFeeSelector = createSelector(
  tradeSelector,
  ({ priority, priorityList }) =>
    memoize(() =>{
      if (priority && priorityList) {
        return {
          tradingFee: getTradingFee(priority, priorityList),
          tradingFeeToken: COINS.PRV
        };
      }
      return {
        tradingFee: 0,
        tradingFeeToken: COINS.PRV
      };
    })
);

export const totalFeeSelector = createSelector(
  tradeSelector,
  ({ fee, feeToken, priority, priorityList }) =>
    memoize(() => {
      let pDexFee = fee;
      if (priority && priorityList && feeToken?.id === PRV_ID) {
        pDexFee += getTradingFee(priority, priorityList);
      }
      return format.amount(pDexFee, feeToken.pDecimals);
    })
);