export default {
  /**
   * 
   * @param {number} originAmount 
   * @param {number} decimals 
   * Convert original amount (usualy get from backend) to humain readable amount or display on frontend
   */
  toHumanAmount(originAmount, decimals) {
    const decision_rate = 10**(Number(decimals) || 1);
    const _amount = originAmount/decision_rate;
    return _amount;
  },
  /**
   * 
   * @param {number} humanAmount 
   * @param {number} decimals 
   * Convert humain readable amount (display on frontend) to original amount
   */
  toOriginalAmount(humanAmount, decimals) {
    const decision_rate = 10**(Number(decimals) || 1);
    const _amount = Math.round(humanAmount * decision_rate);
    return _amount;
  }
};