class TradingQuote {
  constructor(json) {
    if (!json) {
      return {};
    }

    this.price = json.price;
    this.amount = json.amount;
    this.maxPrice = json.maxPrice;
    this.minimumAmount = json.minimumAmount;
    this.to = json.to;
    this.data = json.data;
  }
}

export default TradingQuote;
