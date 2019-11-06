import { CONSTANT_COMMONS } from '@src/constants';
import PToken from './pToken';

class SelectedPrivacy {
  constructor(account = {}, token = {}, pTokenData: PToken = {}) {
    this.currencyType = pTokenData.currencyType;
    this.isToken = (token?.id !== CONSTANT_COMMONS.PRV_TOKEN_ID) && !!token.id;
    this.isMainCrypto = (token?.id === CONSTANT_COMMONS.PRV_TOKEN_ID) || !this.isToken;
    this.isPToken = !!pTokenData.pSymbol; // pToken is private token (pETH <=> ETH, pBTC <=> BTC, ...)
    this.isIncognitoToken = !this.isPToken; // is tokens were issued from users
    this.isErc20Token = this.currencyType === CONSTANT_COMMONS.PRIVATE_TOKEN_CURRENCY_TYPE.ERC20;
    this.symbol = this.isToken ? token.symbol : CONSTANT_COMMONS.CRYPTO_SYMBOL.PRV;
    this.name = this.isToken ? (pTokenData.name || token.name) : CONSTANT_COMMONS.CRYPTO_SYMBOL.PRV;
    this.amount = (this.isToken ? token.amount : account.value) || 0;
    this.tokenId = this.isMainCrypto ? CONSTANT_COMMONS.PRV_TOKEN_ID : token.id;
    this.contractId = pTokenData.contractId;
    this.decimals = this.isMainCrypto ? CONSTANT_COMMONS.DECIMALS.MAIN_CRYPTO_CURRENCY : pTokenData.decimals;
    this.pDecimals = this.isMainCrypto ? CONSTANT_COMMONS.DECIMALS.MAIN_CRYPTO_CURRENCY : pTokenData.pDecimals;
    this.externalSymbol = pTokenData.symbol;
    this.paymentAddress = account.PaymentAddress;
    this.isWithdrawable = this.isPToken;
    this.isDeposable = this.isPToken;
    this.isDecentralized = this.isToken && (this.externalSymbol === CONSTANT_COMMONS.CRYPTO_SYMBOL.ETH) || this.isErc20Token;
    this.isCentralized = this.isToken && !this.isDecentralized;
  }
}

export default SelectedPrivacy;