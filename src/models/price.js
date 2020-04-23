import _ from 'lodash';

class PriceModel {
  constructor(json) {
    if (!json) {
      return {};
    }

    this.pair = json.Pair;
    this.time = json.Timestamp;
    this.value = _.floor(json.Value, 4);
  }
}

export default PriceModel;
