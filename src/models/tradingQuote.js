class TradingQuote {
  constructor(json) {
    if (!json) {
      return {};
    }

    this.price = json.price;
    this.amount = json.amount;
    this.to = json.to;
    this.data = json.data;
  }
}

export default TradingQuote;
