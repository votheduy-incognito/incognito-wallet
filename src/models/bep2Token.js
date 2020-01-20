class BEP2Token {
  constructor(data = {}) {
    this.symbol = data.symbol;
    this.name = data.name;
    this.originalSymbol = data.original_symbol;
  }
}

export default BEP2Token;
