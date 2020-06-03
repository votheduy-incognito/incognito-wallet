import React from 'react';
import { MESSAGES } from '@screens/Dex/constants';
import { PRV } from '@services/wallet/tokenService';
import { COINS } from '@src/constants';
import { ExHandler } from '@services/exception';
import accountService from '@services/wallet/accountService';
import { deposit as depositAPI, trade as tradeAPI, tradePKyber as TradeKyberAPI } from '@services/api/pdefi';
import { MAX_PDEX_TRADE_STEPS } from '@screens/DexV2/constants';
import convertUtil from '@utils/convert';
import { DEFI_TRADING_FEE } from '@components/EstimateFee/EstimateFee.utils';

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
    isErc20,
    quote,
  } = props;


  const deposit = () => {
    return depositAPI({
      tokenId: inputToken.id,
      amount: inputValue,
      networkFee: fee / MAX_PDEX_TRADE_STEPS * (MAX_PDEX_TRADE_STEPS - 1) + (isErc20 ? DEFI_TRADING_FEE : 0),
      networkFeeTokenId: feeToken.id,
      receiverAddress: account.PaymentAddress,
    });
  };

  const trade = async () => {
    let prvFee = 0;
    let tokenFee = 0;
    // let spendingPRV = false;
    // let spendingCoin = false;
    if (trading) {
      return;
    }

    setTrading(true);
    setError('');

    try {
      if (inputToken?.id === PRV.id) {
        prvFee = fee;
        tokenFee = fee;

        // spendingCoin = spendingPRV = await accountService.hasSpendingCoins(account, wallet, inputValue + prvFee);
      } else {
        prvFee = feeToken.id === COINS.PRV_ID ? fee : 0;
        tokenFee = prvFee > 0 ? 0 : fee;

        // if (prvFee) {
        //   spendingPRV = await accountService.hasSpendingCoins(account, wallet, prvFee);
        //   spendingCoin = await accountService.hasSpendingCoins(account, wallet, inputValue, inputToken.id);
        // } else {
        //   spendingCoin = await accountService.hasSpendingCoins(account, wallet, inputValue + tokenFee, inputToken.id);
        // }
      }

      if (inputBalance < inputValue + tokenFee) {
        return setError(MESSAGES.NOT_ENOUGH_BALANCE_TO_TRADE(inputToken.symbol));
      }

      if (prvBalance < prvFee) {
        return setError({ tradeError: MESSAGES.NOT_ENOUGH_PRV_NETWORK_FEE });
      }

      // if (spendingCoin || spendingPRV) {
      //   return setError(MESSAGES.PENDING_TRANSACTIONS);
      // }

      const depositObject = await deposit();
      const serverFee = tokenFee / MAX_PDEX_TRADE_STEPS * (MAX_PDEX_TRADE_STEPS - 1);
      const tokenNetworkFee = tokenFee / MAX_PDEX_TRADE_STEPS;
      const prvNetworkFee = prvFee / MAX_PDEX_TRADE_STEPS;
      let prvAmount = prvFee / MAX_PDEX_TRADE_STEPS * (MAX_PDEX_TRADE_STEPS - 1);

      if (isErc20) {
        await tradeKyber(depositObject.depositId);
        prvAmount = prvAmount + DEFI_TRADING_FEE;
      } else {
        await tradeAPI({
          depositId: depositObject.depositId,
          buyTokenId: outputToken.id,
          buyAmount: outputValue,
          buyExpectedAmount: outputValue,
          tradingFee: 0,
          minimumAmount,
        });
      }

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
      }
    } catch (error) {
      setError(new ExHandler(error).getMessage(MESSAGES.TRADE_ERROR));
    } finally {
      setTrading(false);
    }
  };

  const tradeKyber = async (depositId) => {
    const originalValue = convertUtil.toDecimals(inputValue, inputToken).toString();

    const data = {
      sellTokenAddress: inputToken.address,
      sellAmount: originalValue,
      buyTokenAddress: outputToken.address,
      expectAmount: quote.expectedRate?.toString(),
      depositId: depositId,
    };

    await TradeKyberAPI(data);
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
