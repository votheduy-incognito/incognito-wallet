import formatUtil from '@utils/format';
import { MESSAGES, PRV } from '@screens/Dex/constants';

function parseHistory(history, historyObject) {
  Object.keys(historyObject).forEach(key => history[key] = historyObject[key]);
  history.updatedAt = history.updatedAt || history.lockTime || 0;
  return history;
}

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
    this.updatedAt = Math.floor(new Date().getTime() / 1000);
  }

  static load(historyObject) {
    const history = new TradeHistory();
    return parseHistory(history, historyObject);
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
    this.updatedAt = Math.floor(new Date().getTime() / 1000);

    WithdrawHistory.currentWithdraw = this;
  }

  updateTx2(res) {
    this.txId2 = res.txId;
    this.lockTime2 = res.lockTime;
    this.checking = false;
    this.status = undefined;
    this.lockTime = res.lockTime;
    this.updatedAt = Math.floor(new Date().getTime() / 1000);
  }

  static currentWithdraw = null;

  static load(historyObject) {
    const history = new WithdrawHistory();
    return parseHistory(history, historyObject);
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
    this.updatedAt = Math.floor(new Date().getTime() / 1000);
  }

  static load(historyObject) {
    const history = new DepositHistory();
    return parseHistory(history, historyObject);
  }
}
