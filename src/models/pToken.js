import TokenModel from './token';

class PToken {
  constructor(data = {}) {
    this.id = data.ID;
    this.createdAt = data.CreatedAt;
    this.updatedAt = data.UpdatedAt;
    this.deletedAt = data.DeletedAt;
    this.tokenId = data.TokenID;
    this.symbol = data.Symbol;
    this.name = data.Name;
    this.contractId = data.ContractID;
    this.decimals = data.Decimals;
    this.pDecimals = data.PDecimals;
    this.type = data.Type;
    this.pSymbol = data.PSymbol;
    this.default = data.Default;
    this.userId = data.UserID;
    this.verified = data.Verified;
  }
  /**
   * Convert to data structure of token which stored in wallet object
   */
  convertToToken() {
    return TokenModel.toJson({
      id: this.tokenId,
      isPrivacy: true,
      name: this.name,
      symbol: this.pSymbol,
      isInit: false,
      metaData: {
        decimals: this.decimals,
        pDecimals: this.pDecimals,
        pSymbol: this.pSymbol,
        symbol: this.symbol,
        contractId: this.contractId,
        pTokenType: this.type
      }
      // listTxs,
      // image,
      // amount
    });
  }
}

export default PToken;
