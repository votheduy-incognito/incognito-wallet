const checkAmount = (amount) => {
  if (!Number.isFinite(amount)) throw new Error('Can not format invalid amount');
};

export default {
  /**
   *
   * @param {number} originAmount
   * @param {number} decimals
   * Convert original amount (usualy get from backend) to humain readable amount or display on frontend
   */
  toHumanAmount(originAmount, decimals) {
    try {
      const amount = Number(originAmount);
      checkAmount(amount);

      const decision_rate = Number(decimals) ? 10 ** (Number(decimals)) : 1;
      const _amount = amount / decision_rate;
      return _amount;
    } catch {
      return originAmount;
    }
  },
  /**
   *
   * @param {number} humanAmount
   * @param {number} decimals
   * Convert humain readable amount (display on frontend) to original amount
   */
  toOriginalAmount(humanAmount, decimals) {
    const amount = Number(humanAmount);
    checkAmount(amount);

    const decision_rate = Number(decimals) ? 10**(Number(decimals)) : 1;
    const _amount = Math.round(amount * decision_rate);
    return _amount;
  },

  toRealTokenValue(tokens, tokenId, value) {
    const token = tokens.find(item => item.id === tokenId);
    return value / Math.pow(10, token.pDecimals || 0);
  }
};
