class TokenModel {
  static fromJson = (data = {}) => ({
    amount: 0,
    id: data.ID,
    isPrivacy: data.IsPrivacy,
    name: data.Name,
    symbol: data.Symbol,
    isInit: data.isInit,
    image: data.Image,
    listTxs: data.ListTxs,
    metaData: data.metaData,
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
    metaData: data.metaData,
  });
}

export default TokenModel;