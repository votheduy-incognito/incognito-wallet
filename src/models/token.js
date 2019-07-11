class TokenModel {
  static fromJson = (data = {}) => ({
    amount: data.Amount,
    id: data.ID,
    isPrivacy: data.IsPrivacy,
    name: data.Name,
    symbol: data.Symbol,
    isInit: data.isInit,
    image: data.Image,
    listTxs: data.ListTxs,
  });

  static toJson = (data = {}) => ({
    Amount: data.amount,
    ID: data.id,
    IsPrivacy: data.isPrivacy,
    Name: data.name,
    Symbol: data.symbol,
    isInit: data.isInit,
    Image: data.image,
    ListTxs: data.listTxs,
  });
}

export default TokenModel;