import http from '@src/services/http';
import PriceModel from '@models/price';

/**
 * Get Price Data
 * @param {string} pair
 * @param {number} intervalMs
 * @returns {Array<PriceModel>}
 */
export const getPriceData = ({
  pair,
  intervalMs,
}) => {
  return http.get(`/chart/price?pair=${pair}&granularity=${intervalMs}&start=1552987804&end=${Math.round(Date.now()/1000)}`)
    .then(res => res.List.map(item => new PriceModel(item)));
};
