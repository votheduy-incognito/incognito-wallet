import formatUtil from '@utils/format';
import { MESSAGES, PRV } from '@screens/Dex/constants';

export class TradeHistory {
  constructor(res, inputToken, outputToken, inputValue, outputValue, networkFee, networkFeeUnit, tradingFee, stopPrice) {
    if (!res) {
      return;
    }

    this.txId = res.txId;
    this.lockTime = res.lockTime;
    this.inputToken = inputToken.symbol;
    this.inputTokenId = inputToken.id;
    this.inputValue = formatUtil.amountFull(inputValue, inputToken.pDecimals);
    this.outputToken = outputToken.symbol;
    this.outputTokenId = outputToken.id;
    this.outputValue = formatUtil.amountFull(outputValue, outputToken.pDecimals);
    this.type = MESSAGES.TRADE;
    this.networkFee = formatUtil.amountFull(networkFee, networkFeeUnit === inputToken.symbol ? inputToken.pDecimals : PRV.pDecimals);
    this.networkFeeUnit = networkFeeUnit;
    this.tradingFee = formatUtil.amountFull(tradingFee, inputToken.pDecimals);
    this.stopPrice = formatUtil.amountFull(stopPrice, outputToken.pDecimals);
  }

  static load(historyObject) {
    const history = new TradeHistory();
    Object.keys(historyObject).forEach(key => history[key] = historyObject[key]);
    return history;
  }
}

export class WithdrawHistory {
  constructor(res, token, amount, networkFee, networkFeeUnit, account) {
    if (!res) {
      return;
    }
    this.txId = res.txId;
    this.lockTime = res.lockTime;
    this.txId1 = res.txId;
    this.lockTime1 = res.lockTime;
    this.tokenSymbol = token.symbol;
    this.tokenId = token.id;
    this.tokenName = token.name;
    this.amount = amount;
    this.pDecimals = token.pDecimals || 0;
    this.type = MESSAGES.WITHDRAW;
    this.networkFee = networkFee;
    this.networkFeeDecimals = networkFeeUnit === token.symbol ? token.pDecimals : PRV.pDecimals;
    this.networkFeeUnit = networkFeeUnit;
    this.account = account.AccountName;
    this.paymentAddress = account.PaymentAddress;
    this.checking = false;

    WithdrawHistory.currentWithdraw = this;

    console.debug('CREATED WITHDRAW HISTORY', res.txId);
  }

  updateTx2(res) {
    this.txId2 = res.txId;
    this.lockTime2 = res.lockTime;
    this.checking = false;
    this.status = undefined;
    this.lockTime = res.lockTime;

    console.debug('UPDATE HISTORY', this);
  }

  static currentWithdraw = null;

  static load(historyObject) {
    const history = new WithdrawHistory();
    Object.keys(historyObject).forEach(key => history[key] = historyObject[key]);
    return history;
  }
}

export class DepositHistory {
  constructor(res, token, amount, networkFee, networkFeeUnit, account) {
    if (!res) {
      return;
    }

    this.txId = res.txId;
    this.lockTime = res.lockTime;
    this.tokenSymbol = token.symbol;
    this.tokenId = token.id;
    this.amount = formatUtil.amountFull(amount, token.pDecimals);
    this.type = MESSAGES.DEPOSIT;
    this.networkFee = formatUtil.amountFull(networkFee, networkFeeUnit === token.symbol ? token.pDecimals : PRV.pDecimals);
    this.networkFeeUnit = networkFeeUnit;
    this.account = account.AccountName;
  }

  static load(historyObject) {
    const history = new DepositHistory();
    Object.keys(historyObject).forEach(key => history[key] = historyObject[key]);
    return history;
  }
}
