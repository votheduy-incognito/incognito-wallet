import http from '@src/services/http';
import {RewardModel} from '@models/pDefi';

export const getRewards = (paymentAddress) => {
  return http.get(`auth/liquidity-reward?wallet=${paymentAddress}`)
    .then(data => data.List.map(item => new RewardModel(item)));
};
