import http from '@src/services/http';

export const apiGetMasterAddress = () => http.get('pool/staker/master-address');

export const apiGetStakerInfo = ({paymentAddress}) =>
  http.get(`pool/staker/info?p_stake_address=${paymentAddress}`);

export const apiCreateStake = (
  data = {
    IncognitoTx: '',
    PStakeAddress: '',
    SignPublicKeyEncode: '',
  },
) => http.post('pool/staker/create-stake', data);

export const apiUnStake = (
  data = {
    PStakeAddress: '',
    SignEncode: '',
    PaymentAddress: '',
    Amount: 0,
  },
) => http.post('pool/staker/create-unstake', data);

export const apiUnStakeRewards = (
  data = {
    PStakeAddress: '',
    SignEncode: '',
    PaymentAddress: '',
    Amount: 0,
  },
) => http.post('pool/staker/create-unstake-rewards', data);
