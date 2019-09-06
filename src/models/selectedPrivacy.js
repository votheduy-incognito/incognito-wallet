import tokenData from '@src/constants/tokenData';
import { CONSTANT_COMMONS } from '@src/constants';
import PToken from './pToken';

class SelectedPrivacy {
  constructor(account = {}, token = {}, pTokenData: PToken = {}) {
    const symbol = token.symbol || tokenData.SYMBOL.MAIN_CRYPTO_CURRENCY;
    const name = pTokenData.name || token.name || tokenData.SYMBOL.MAIN_CRYPTO_CURRENCY;

    this.amount = token.amount ?? account.value || 0;
    this.tokenId = token.id;
    this.contractId = pTokenData.contractId;
    this.isToken = !!token.id;
    this.isMainCrypto = !token.id;
    this.isPToken = !!pTokenData.pSymbol;
    this.decimals = this.isMainCrypto ? CONSTANT_COMMONS.DECIMALS[symbol] : pTokenData.decimals;
    this.pDecimals = this.isMainCrypto ? CONSTANT_COMMONS.DECIMALS[symbol] : pTokenData.pDecimals;
    this.symbol = symbol;
    this.currencyType = pTokenData.currencyType;
    this.externalSymbol = pTokenData.symbol;
    this.name = name;
    this.paymentAddress = account.PaymentAddress;
    this.isWithdrawable = this.isPToken;
    this.isDeposable = this.isPToken;
    this.isErc20Token = this.currencyType === CONSTANT_COMMONS.PRIVATE_TOKEN_CURRENCY_TYPE.ERC20;
  }
}

export default SelectedPrivacy;