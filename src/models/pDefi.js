import formatUtil, { LONG_DATE_TIME_FORMAT } from '@utils/format';
import moment from 'moment';
import { MAX_DEX_FEE, MAX_FEE_PER_TX } from '@components/EstimateFee/EstimateFee.utils';
import BigNumber from 'bignumber.js';

const TYPES = [
  'Incognito',
  'Incognito',
  'Kyber',
  '0x',
  'Uniswap'
];

export class RewardModel {
  constructor(data = {}) {
    this.walletAddress = data.WalletAddress;
    this.amount1 = data.Amount1;
    this.amount2 = data.Amount2;
    this.total = data.TotalAmount;
    this.tokenId1 = data.Token1ID;
    this.tokenId2 = data.Token2ID;
    this.pair = data.Pair;
    this.beaconHeight = data.BeaconHeight;
    this.beaconTime = data.BeaconTimeStamp;
    this.interestRate1 = data.InterestRate1;
    this.interestRate2 = data.InterestRate2;
  }
}

export class DepositResponse {
  constructor(data = {}) {
    this.walletAddress = data.WalletAddress;
    this.depositId = data.DepositID;
  }
}

export class PDexTradeHistoryModel {
  constructor(json, allTokens, accounts) {
    if (!json) {
      return;
    }

    this.id = json.DepositID;
    this.sellTokenId = json.TokenID;
    this.sellAmount = json.Amount;
    this.buyTokenId = json.BuyTokenID;
    this.buyAmount = json.MinimumAmount;
    this.tradingFee = json.TradingFee;
    this.networkFee = json.NetworkFee;
    this.networkFeeTokenId = json.NetworkFeeTokenID;
    this.account = accounts.find(item => item.PaymentAddress === json.ReceiverAddress)?.accountName;
    this.createdAt = moment(json.CreatedAt).format(LONG_DATE_TIME_FORMAT);
    this.type = 'Trade';
    this.status = [
      'Pending',
      'Unsuccessful',
      'Successful',
    ][json.Status];
    this.exchange = TYPES[json.Type] || 'Incognito';

    let buyToken = allTokens.find(token => token.id === this.buyTokenId || token.address === this.buyTokenId);
    const sellToken = allTokens.find(token => token.id === this.sellTokenId || token.address === this.sellTokenId);
    const networkFeeToken = allTokens.find(token => token.id === this.networkFeeTokenId);

    if (this.exchange !== 'Incognito' && buyToken?.address === json.BuyTokenID) {
      this.tradingFee = (this.networkFee - MAX_DEX_FEE) + MAX_FEE_PER_TX;
      this.networkFee = this.networkFee - this.tradingFee;
      this.buyAmount = BigNumber(this.buyAmount);

      // Buy amount of Kyber is expected rate
      if (this.exchange === 'Kyber') {
        const originalSellAmount = BigNumber(this.sellAmount)
          .dividedBy(BigNumber(10).pow(sellToken.pDecimals));

        // Decimals is 18 for all buy tokens returned by Kyber (handled by API)
        this.buyAmount = this.buyAmount
          .dividedBy(BigNumber(10).pow(18))
          .multipliedBy(originalSellAmount);
      }

      // Buy amount of Uniswap is minimum amount
      if (this.exchange === 'Uniswap') {
        this.buyAmount = this.buyAmount
          .dividedBy(BigNumber(10).pow(buyToken.decimals));
      }

      this.buyAmount = this.buyAmount
        .multipliedBy(BigNumber(10).pow(buyToken.pDecimals))
        .toFixed(0);
    }

    if (buyToken) {
      this.buyTokenSymbol = buyToken.symbol;
      this.buyAmount = formatUtil.amountFull(this.buyAmount, buyToken.pDecimals);
    }

    if (sellToken) {
      this.sellTokenSymbol = sellToken.symbol;
      this.sellAmount = formatUtil.amountFull(this.sellAmount, sellToken.pDecimals);
    }

    if (networkFeeToken) {
      this.networkFeeTokenSymbol = networkFeeToken.symbol;
      this.networkFee = Math.round(this.networkFee / 3 * 4);
      this.networkFee = formatUtil.amountFull(this.networkFee, networkFeeToken.pDecimals);
      this.tradingFee = formatUtil.amountFull(this.tradingFee, networkFeeToken.pDecimals);
    }

    this.description = `${this.sellAmount} ${this.sellTokenSymbol} to ${this.buyAmount} ${this.buyTokenSymbol}`;
  }
}
