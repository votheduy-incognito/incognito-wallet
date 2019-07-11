import { CONSTANT_COMMONS } from '@src/constants';

export default {
  /**
   * 
   * @param {number} originAmount 
   * @param {string} tokenSymbol 
   * Convert original amount (usualy get from backend) to humain readable amount or display on frontend
   */
  toHumanAmount(originAmount, tokenSymbol) {
    const decision_rate = CONSTANT_COMMONS.DECISION_RATE[tokenSymbol] || 1;
    const _amount = originAmount/decision_rate;
    return _amount;
  },
  /**
   * 
   * @param {number} humanAmount 
   * @param {string} tokenSymbol 
   * Convert humain readable amount (display on frontend) to original amount
   */
  toOriginalAmount(humanAmount, tokenSymbol) {
    const decision_rate = CONSTANT_COMMONS.DECISION_RATE[tokenSymbol] || 1;
    const _amount = humanAmount * decision_rate;
    return _amount;
  }
};