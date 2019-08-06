
import {
  Container,
  Divider,
  Text,
  View
} from '@src/components/core';
import { ConfirmedTx, SuccessTx } from '@src/services/wallet/WalletService';
import { COLORS } from '@src/styles';
import PropTypes from 'prop-types';
import React from 'react';
import formatUtil from '@src/utils/format';
import { CONSTANT_COMMONS } from '@src/constants';
import styleSheet from './style';

const getStatusData = statusCode => {
  let statusText;
  let statusColor;
  switch (statusCode) {
  case SuccessTx:
    statusText = 'Success';
    statusColor = COLORS.green;
    break;
  case ConfirmedTx:
    statusText = 'Confirmed';
    statusColor = COLORS.blue;
    break;
  case CONSTANT_COMMONS.HISTORY.STATUS_TEXT.NewAddress:
    statusText = 'Pending';
    statusColor = COLORS.blue;
    break;
  case CONSTANT_COMMONS.HISTORY.STATUS_TEXT.ReceivedDepositAmount:
    statusText = 'Received Deposit Amount';
    statusColor = COLORS.blue;
    break;
  case CONSTANT_COMMONS.HISTORY.STATUS_TEXT.MintingPrivacyToken:
    statusText = 'Minting Privacy Token';
    statusColor = COLORS.blue;
    break;
  case CONSTANT_COMMONS.HISTORY.STATUS_TEXT.MintedPrivacyToken:
    statusText = 'Minted Privacy Token';
    statusColor = COLORS.blue;
    break;
  case CONSTANT_COMMONS.HISTORY.STATUS_TEXT.SendingToMasterAccount:
    statusText = 'Sending To Master Account';
    statusColor = COLORS.blue;
    break;
  case CONSTANT_COMMONS.HISTORY.STATUS_TEXT.SendedToMasterAccount:
    statusText = 'Success';
    statusColor = COLORS.green;
    break;
  case CONSTANT_COMMONS.HISTORY.STATUS_TEXT.ReceivedWithdrawAmount:
    statusText = 'Received Withdraw Amount';
    statusColor = COLORS.blue;
    break;
  case CONSTANT_COMMONS.HISTORY.STATUS_TEXT.BurningPrivacyToken:
    statusText = 'Burning Privacy Token';
    statusColor = COLORS.blue;
    break;
  case CONSTANT_COMMONS.HISTORY.STATUS_TEXT.BurnedPrivacyToken:
    statusText = 'Burned Privacy Token';
    statusColor = COLORS.blue;
    break;
  case CONSTANT_COMMONS.HISTORY.STATUS_TEXT.SendingToUserAddress:
    statusText = 'Sending To User Address';
    statusColor = COLORS.blue;
    break;
  case CONSTANT_COMMONS.HISTORY.STATUS_TEXT.SendedToUserAddress:
    statusText = 'Success';
    statusColor = COLORS.green;
    break;
  default:
    statusText = 'Failed';
    statusColor = COLORS.red;
  }

  return {
    statusText,
    statusColor
  };
};

const getTypeData = type => {
  let typeText;
  let typeColor;
  switch (type) {
  case CONSTANT_COMMONS.HISTORY.TYPE.WITHDRAW:
    typeText = 'Withdraw';
    typeColor = COLORS.green;
    break;
  case CONSTANT_COMMONS.HISTORY.TYPE.DEPOSIT:
    typeText = 'Deposit';
    typeColor = COLORS.orange;
    break;
  case CONSTANT_COMMONS.HISTORY.TYPE.SEND:
    typeText = 'Send';
    typeColor = COLORS.blue;
    break;
  }

  return {
    typeText,
    typeColor
  };
};

// const getAddress = history => {
//   if ([CONSTANT_COMMONS.HISTORY.TYPE.SEND, CONSTANT_COMMONS.HISTORY.TYPE.WITHDRAW].includes(history?.type)) {
//     return ['To', history?.toAddress];
//   } else if ([CONSTANT_COMMONS.HISTORY.TYPE.DEPOSIT].includes(history?.type)) {
//     return ['From', history?.fromAddress];
//   }
// };

const HistoryItem = ({ history }) => {
  if (!history) {
    return null;
  }

  const { statusText, statusColor } = getStatusData(history.statusCode);
  const { typeText } = getTypeData(history.type);
  // const [addressDirection, address] = getAddress(history);

  return (
    <>
      <View style={styleSheet.itemContainer}>
        <View style={styleSheet.row}>
          <Text
            style={[styleSheet.typeText]}
            numberOfLines={1}
            ellipsizeMode="tail"
          >
            {typeText}
          </Text>
          <Text
            style={styleSheet.timeText}
            numberOfLines={1}
            ellipsizeMode="tail"
          >
            {formatUtil.formatDateTime(history.time)}
          </Text>
        </View>
        <View style={styleSheet.row}>
          <Text
            style={styleSheet.amountText}
            numberOfLines={1}
            ellipsizeMode="tail"
          >
            {
              history.amount
                ? formatUtil.amount(history.amount, history.decimals)
                : formatUtil.amount(history.requestedAmount)
            } 
            {' '}
            { history.currencyType ?? history.symbol }
          </Text>
          <Text
            style={[styleSheet.statusText, { color: statusColor }]}
            numberOfLines={1}
            ellipsizeMode="tail"
          >
            {statusText}
          </Text>
        </View>
      </View>
      <Divider color={COLORS.lightGrey4} />
    </>
  );
};

const HistoryList = ({ histories }) => (
  <Container style={styleSheet.container}>
    {histories &&
      histories.map(history => (
        <HistoryItem key={history.id} history={history} />
      ))}
  </Container>
);

HistoryItem.defaultProps = {
  history: {
    id: null,
    time: null,
    type: null,
    amount: null,
    symbol: null,
    fromAddress: null,
    toAddress: null,
    statusCode: null,
  }
};

HistoryItem.propTypes = {
  history: PropTypes.shape({
    id: PropTypes.oneOfType([PropTypes.string, PropTypes.number]),
    time: PropTypes.string,
    type: PropTypes.oneOfType([PropTypes.string, PropTypes.number]),
    amount: PropTypes.oneOfType([PropTypes.string, PropTypes.number]),
    symbol: PropTypes.string,
    fromAddress: PropTypes.string, 
    toAddress: PropTypes.string, 
    statusCode: PropTypes.oneOfType([PropTypes.string, PropTypes.number]),
  })
};

HistoryList.defaultProps = {
  histories: null
};

HistoryList.propTypes = {
  histories: PropTypes.array
};

export default HistoryList;
