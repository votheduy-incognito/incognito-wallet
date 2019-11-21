import { CONSTANT_COMMONS } from '@src/constants';
import PToken from './pToken';

function getNetworkName() {
  let name = 'Unknown';
  if (this.isPrivateCoin) {
    name = `${this.name} network`;
  } else if (this.isErc20Token) {
    name = 'ERC20';
  } else if (this.isBep2Token) {
    name = 'BEP2';
  } else if (this.isIncognitoToken || this.isMainCrypto) {
    name = 'Incognito network';
  }

  return name;
}

class SelectedPrivacy {
  constructor(account = {}, token = {}, pTokenData: PToken = {}) {
    this.currencyType = pTokenData.currencyType;
    this.isToken = (token?.id !== CONSTANT_COMMONS.PRV_TOKEN_ID) && !!token.id; // all kind of tokens (private tokens, incognito tokens)
    this.isMainCrypto = (token?.id === CONSTANT_COMMONS.PRV_TOKEN_ID) || !this.isToken; // PRV
    this.isPrivateToken = pTokenData?.type === CONSTANT_COMMONS.PRIVATE_TOKEN_TYPE.TOKEN; // ERC20 tokens, BEP2 tokens
    this.isPrivateCoin = pTokenData?.type === CONSTANT_COMMONS.PRIVATE_TOKEN_TYPE.COIN; // pETH, pBTC, pTOMO,...
    this.isPToken = !!pTokenData.pSymbol; // pToken is private token (pETH <=> ETH, pBTC <=> BTC, ...)
    this.isIncognitoToken = !this.isPToken && !this.isMainCrypto; // is tokens were issued from users
    this.isErc20Token = this.isPrivateToken && this.currencyType === CONSTANT_COMMONS.PRIVATE_TOKEN_CURRENCY_TYPE.ERC20;
    this.isBep2Token = this.isPrivateToken && this.currencyType === CONSTANT_COMMONS.PRIVATE_TOKEN_CURRENCY_TYPE.BNB_BEP2;
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
    this.networkName = getNetworkName.call(this);
  }
}

export default SelectedPrivacy;