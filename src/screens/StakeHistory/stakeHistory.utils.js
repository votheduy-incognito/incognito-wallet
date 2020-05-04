import format from '@src/utils/format';
import {CONSTANT_COMMONS, CONSTANT_CONFIGS} from '@src/constants';

export const STATUS_HISTORY = {
  0: 'Pending',
  1: 'Processing',
  2: 'Successful',
  3: 'Unsuccessful',
  4: 'Queued',
};

export const STATUS_HISTORY_COLOR = {
  0: '#00CFD9',
  1: '#FF8D01',
  2: '#23C64C',
  3: '#FE4E4E',
  4: '#25CDD6',
};

export const TYPE_HISTORY = {
  0: 'None',
  1: 'Deposit',
  2: 'Withdraw',
  3: 'Auto Stake On',
  4: 'Auto Stake Off',
  5: 'Reward',
  6: 'Claim Reward',
};

export const standardizeData = item => {
  return {
    id: item?.ID || null,
    userId: item?.UserID || null,
    amount: format.amount(item?.Amount || 0, CONSTANT_COMMONS.PRV.pDecimals),
    type: TYPE_HISTORY[item?.Type || 0],
    status: STATUS_HISTORY[item?.Status || 0],
    address: item?.Address || '',
    incognitoTx: item?.IncognitoTx || '',
    masterAddress: item?.MasterAddress || '',
    paymentAddress: item?.PaymentAddress || '',
    createdAt: format.formatDateTime(
      item?.CreatedAt || new Date().getTime / 1000,
    ),
    statusColor: STATUS_HISTORY_COLOR[item?.Status || 0],
    symbol: CONSTANT_COMMONS.PRV.symbol,
    txLink: `${CONSTANT_CONFIGS.EXPLORER_CONSTANT_CHAIN_URL}/tx/${item?.IncognitoTx}`,
    retryWithdraw: null,
    retryDeposit: !!(item?.RetryDeposit && item?.Status === 3) || null,
  };
};

export const mappingData = items => items.map(item => standardizeData(item));

export const delay = ms => new Promise(resolve => setTimeout(resolve, ms));

export const mockupData = async () => {
  await delay(500);
  return [...Array(20)].map((item, index) => ({
    ID: index,
    CreatedAt: '2020-03-23T17:37:09Z',
    UpdatedAt: '2020-03-23T17:38:16Z',
    UserID: 5713,
    Type: Math.floor(Math.random() * 6),
    Address: '',
    Amount: 1000000000000,
    Status: Math.floor(Math.random() * 4),
    IncognitoTx:
      'eeff66c926a1b52f12921d9654761166e0b469b8a1549b17029e9ee09769b185',
    MasterAddress:
      '12RpNYT9JaUwFNTzQayuxsVTHirZ267UPcDkfKNgLtK91Lyip2ui7qiwrxhX12x5xC2NHNpJP3GyCJ6BtgqVSCncMcLGTuRDwq2i4d1',
    PaymentAddress:
      '12S5Lrs1XeQLbqN4ySyKtjAjd2d7sBP2tjFijzmp6avrrkQCNFMpkXm3FPzj2Wcu2ZNqJEmh9JriVuRErVwhuQnLmWSaggobEWsBEci',
  }));
};
