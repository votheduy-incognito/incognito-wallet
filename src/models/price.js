class PriceModel {
  constructor(json) {
    if (!json) {
      return {};
    }

    this.pair = json.Pair;
    this.time = json.Timestamp;
    this.value = json.Value;
  }
}

export default PriceModel;
