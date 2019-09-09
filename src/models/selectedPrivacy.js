import { CONSTANT_COMMONS } from '@src/constants';
import PToken from './pToken';

class SelectedPrivacy {
  constructor(account = {}, token = {}, pTokenData: PToken = {}) {
    this.isToken = !!token.id;
    this.symbol = this.isToken ? token.symbol : CONSTANT_COMMONS.CRYPTO_SYMBOL.PRV;
    this.name = this.isToken ? (pTokenData.name || token.name) : CONSTANT_COMMONS.CRYPTO_SYMBOL.PRV;
    this.amount = (this.isToken ? token.amount : account.value) || 0;
    this.tokenId = token.id;
    this.contractId = pTokenData.contractId;
    this.isMainCrypto = !this.isToken;
    this.isPToken = !!pTokenData.pSymbol;
    this.decimals = this.isMainCrypto ? CONSTANT_COMMONS.DECIMALS[this.symbol] : pTokenData.decimals;
    this.pDecimals = this.isMainCrypto ? CONSTANT_COMMONS.DECIMALS[this.symbol] : pTokenData.pDecimals;
    this.currencyType = pTokenData.currencyType;
    this.externalSymbol = pTokenData.symbol;
    this.paymentAddress = account.PaymentAddress;
    this.isWithdrawable = this.isPToken;
    this.isDeposable = this.isPToken;
    this.isErc20Token = this.currencyType === CONSTANT_COMMONS.PRIVATE_TOKEN_CURRENCY_TYPE.ERC20;
  }
}

export default SelectedPrivacy;