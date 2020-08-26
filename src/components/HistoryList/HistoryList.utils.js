import {
  ConfirmedTx,
  FailedTx,
  SuccessTx,
} from '@src/services/wallet/WalletService';
import { CONSTANT_COMMONS } from '@src/constants';
import { COLORS } from '@src/styles';

export const getStatusData = (status, statusCode) => {
  let statusText;
  let statusColor;
  let statusNumber;
  switch (status) {
  case CONSTANT_COMMONS.HISTORY.STATUS_TEXT.PENDING:
    statusNumber = statusCode;
    statusText = 'Pending';
    statusColor = COLORS.blue;
    break;
  case SuccessTx:
    statusNumber = null;
    statusText = 'Pending';
    statusColor = COLORS.blue;
    break;
  case CONSTANT_COMMONS.HISTORY.STATUS_TEXT.SUCCESS:
  case ConfirmedTx:
    statusText = 'Complete';
    statusColor = COLORS.green;
    break;
  case CONSTANT_COMMONS.HISTORY.STATUS_TEXT.FAILED:
  case FailedTx:
    statusText = 'Failed';
    statusColor = COLORS.red;
    break;
  case CONSTANT_COMMONS.HISTORY.STATUS_TEXT.EXPIRED:
    statusText = 'Expired';
    statusColor = COLORS.orange;
    break;
  default:
    statusText = '';
    statusColor = COLORS.lightGrey1;
  }
  return {
    statusText,
    statusColor,
    statusNumber,
  };
};

export const getTypeData = (type, history) => {
  let typeText;
  let balanceDirection;
  let balanceColor;

  switch (type) {
  case CONSTANT_COMMONS.HISTORY.TYPE.WITHDRAW:
    typeText = 'Withdraw';
    balanceColor = COLORS.red;
    balanceDirection = '-';
    break;
  case CONSTANT_COMMONS.HISTORY.TYPE.DEPOSIT:
    typeText = history?.depositAddress ? 'Deposit' : 'Receive';
    balanceColor = COLORS.green;
    balanceDirection = '+';
    break;
  case CONSTANT_COMMONS.HISTORY.TYPE.SEND:
    typeText =
        CONSTANT_COMMONS.HISTORY.META_DATA_TYPE[(history?.metaDataType)] ||
        'Send';
    balanceColor = COLORS.orange;
    balanceDirection = '-';
    break;
  case CONSTANT_COMMONS.HISTORY.TYPE.RECEIVE:
    typeText = 'Receive';
    balanceColor = COLORS.green;
    balanceDirection = '+';
    break;
  }

  return {
    typeText,
    balanceColor,
    balanceDirection,
  };
};
