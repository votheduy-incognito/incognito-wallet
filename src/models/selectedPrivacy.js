import tokenData from '@src/constants/tokenData';
import { CONSTANT_COMMONS } from '@src/constants';

class SelectedPrivacy {
  constructor(account = {}, token = {}) {
    const symbol = token.symbol || tokenData.SYMBOL.MAIN_CRYPTO_CURRENCY;
    const name = token.name || tokenData.SYMBOL.MAIN_CRYPTO_CURRENCY;

    this.amount = token.amount ?? account.value || 0;
    this.tokenId = token.id;
    this.isToken = !!token.id;
    this.isMainCrypto = !token.id;
    this.isPToken = !!token?.metaData?.pSymbol;
    this.isErc20Token = !!token?.metaData?.contractId;
    this.pTokenType = token?.metaData?.pTokenType;
    this.decimals = this.isMainCrypto ? CONSTANT_COMMONS.DECIMALS[symbol] : token?.metaData?.decimals;
    this.pDecimals = this.isMainCrypto ? CONSTANT_COMMONS.DECIMALS[symbol] : token?.metaData?.pDecimals;
    this.symbol = symbol;
    this.externalSymbol = token?.metaData?.symbol;
    this.name = name;
    this.paymentAddress = account.PaymentAddress;
    this.isWithdrawable = this.isPToken;
    this.isDeposable = this.isPToken;
  }
}

export default SelectedPrivacy;