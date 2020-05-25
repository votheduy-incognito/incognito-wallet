import React from 'react';
import { MESSAGES } from '@screens/Dex/constants';
import { PRV } from '@services/wallet/tokenService';
import { logEvent } from '@services/firebase';
import { COINS, CONSTANT_EVENTS } from '@src/constants';
import { ExHandler } from '@services/exception';
import accountService from '@services/wallet/accountService';
import { deposit as depositAPI, trade as tradeAPI } from '@services/api/pdefi';
import { MAX_PDEX_TRADE_STEPS } from '@screens/DexV2/constants';

const withTrade = WrappedComp => (props) => {
  const [error, setError] = React.useState('');
  const [trading, setTrading] = React.useState(false);
  const {
    inputValue,
    inputToken,
    inputBalance,
    outputToken,
    outputValue,
    minimumAmount,
    prvBalance,
    fee,
    feeToken,
    onTradeSuccess,
    wallet,
    account,
  } = props;


  const deposit = () => {
    return depositAPI({
      tokenId: inputToken.id,
      amount: inputValue,
      networkFee: fee / MAX_PDEX_TRADE_STEPS * (MAX_PDEX_TRADE_STEPS - 1),
      networkFeeTokenId: feeToken.id,
      receiverAddress: account.PaymentAddress,
    });
  };

  const trade = async () => {
    let prvFee = 0;
    let tokenFee = 0;
    if (trading) {
      return;
    }

    setTrading(true);
    setError('');

    try {
      if (inputToken?.id === PRV.id) {
        prvFee = fee;
        tokenFee = fee;
      } else {
        prvFee = feeToken.id === COINS.PRV_ID ? fee : 0;
        tokenFee = prvFee > 0 ? 0 : fee;
      }

      if (inputBalance < inputValue + tokenFee) {
        return setError(MESSAGES.NOT_ENOUGH_BALANCE_TO_TRADE(inputToken.symbol));
      }

      if (prvBalance < prvFee) {
        return setError({ tradeError: MESSAGES.NOT_ENOUGH_PRV_NETWORK_FEE });
      }

      await logEvent(CONSTANT_EVENTS.TRADE, {
        inputTokenId: inputToken.id,
        inputTokenSymbol: inputToken.symbol,
        outputTokenId: outputToken.id,
        outputTokenSymbol: outputToken.symbol,
      });

      const depositObject = await deposit();
      const serverFee = tokenFee / MAX_PDEX_TRADE_STEPS * (MAX_PDEX_TRADE_STEPS - 1);
      const prvAmount = prvFee / MAX_PDEX_TRADE_STEPS * (MAX_PDEX_TRADE_STEPS - 1);
      const tokenNetworkFee = tokenFee / MAX_PDEX_TRADE_STEPS;
      const prvNetworkFee = prvFee / MAX_PDEX_TRADE_STEPS;

      await tradeAPI({
        depositId: depositObject.depositId,
        buyTokenId: outputToken.id,
        buyAmount: outputValue,
        buyExpectedAmount: outputValue,
        tradingFee: 0,
        minimumAmount,
      });

      const result = await accountService.createAndSendToken(
        account,
        wallet,
        depositObject.walletAddress,
        inputValue + serverFee,
        inputToken.id,
        prvNetworkFee,
        tokenNetworkFee,
        prvAmount,
      );
      if (result && result.txId) {
        onTradeSuccess(true);
        await logEvent(CONSTANT_EVENTS.TRADE_SUCCESS, {
          inputTokenId: inputToken.id,
          inputTokenSymbol: inputToken.symbol,
          outputTokenId: outputToken.id,
          outputTokenSymbol: outputToken.symbol,
        });
      }
    } catch (error) {
      await logEvent(CONSTANT_EVENTS.TRADE_FAILED, {
        inputTokenId: inputToken.id,
        inputTokenSymbol: inputToken.symbol,
        outputTokenId: outputToken.id,
        outputTokenSymbol: outputToken.symbol,
      });

      setError(new ExHandler(error).getMessage(MESSAGES.TRADE_ERROR));
    } finally {
      setTrading(false);
    }
  };

  return (
    <WrappedComp
      {...{
        ...props,
        trading,
        onTrade: trade,
        error,
      }}
    />
  );
};

export default withTrade;
