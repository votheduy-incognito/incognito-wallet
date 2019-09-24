
import {
  Container,
  Divider,
  Text,
  View,
  TouchableOpacity
} from '@src/components/core';
import Swipeout from 'react-native-swipeout';
import { ConfirmedTx, SuccessTx, FailedTx } from '@src/services/wallet/WalletService';
import { COLORS } from '@src/styles';
import PropTypes from 'prop-types';
import React from 'react';
import formatUtil from '@src/utils/format';
import { CONSTANT_COMMONS } from '@src/constants';
import routeNames from '@src/router/routeNames';
import styleSheet from './style';

const getStatusData = (status, statusCode) => {
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
  default:
    statusText = '';
    statusColor = COLORS.lightGrey1;
  }

  return {
    statusText,
    statusColor,
    statusNumber
  };
};

const getTypeData = type => {
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
    typeText = 'Deposit';
    balanceColor = COLORS.green;
    balanceDirection = '+';
    break;
  case CONSTANT_COMMONS.HISTORY.TYPE.SEND:
    typeText = 'Send';
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
    balanceDirection
  };
};

// const getAddress = history => {
//   if ([CONSTANT_COMMONS.HISTORY.TYPE.SEND, CONSTANT_COMMONS.HISTORY.TYPE.WITHDRAW].includes(history?.type)) {
//     return ['To', history?.toAddress];
//   } else if ([CONSTANT_COMMONS.HISTORY.TYPE.DEPOSIT].includes(history?.type)) {
//     return ['From', history?.fromAddress];
//   }
// };

const HistoryItemWrapper = ({ history, onCancelEtaHistory, ...otherProps }) => {
  const component = <HistoryItem history={history} {...otherProps} />;
  if (history?.cancelable) {
    return (
      <Swipeout
        style={{
          backgroundColor: 'transparent'
        }}
        right={[
          { text: 'Cancel', backgroundColor: COLORS.red, onPress: () => onCancelEtaHistory(history) }
        ]}
      >
        {component}
      </Swipeout>
    );
  }

  return component;
};

const HistoryItem = ({ history, divider, navigation }) => {
  if (!history) {
    return null;
  }

  const { statusText, statusColor, statusNumber } = getStatusData(history.status, history.statusCode);
  const { typeText, balanceColor, balanceDirection } = getTypeData(history.type);
  // const [addressDirection, address] = getAddress(history);
  const onPress = () => {
    navigation?.navigate(routeNames.TxHistoryDetail, { data: { history, typeText, balanceColor, balanceDirection, statusText, statusColor, statusNumber } });
  };

  return (
    <>
      <TouchableOpacity onPress={onPress} style={styleSheet.itemContainer}>
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
            style={[styleSheet.amountText, {
              color: balanceColor
            }]}
            numberOfLines={1}
            ellipsizeMode="tail"
          >
            {`${balanceDirection} `}
            {
              history.amount
                ? formatUtil.amount(history.amount, history.pDecimals)
                : formatUtil.amount(history.requestedAmount)
            } 
            {' '}
            { history.symbol }
          </Text>
          <Text
            style={[styleSheet.statusText, { color: statusColor }]}
            numberOfLines={1}
            ellipsizeMode="tail"
          >
            {statusText} {(!!statusNumber || statusNumber === 0) ? `[${statusNumber}]` : null}
          </Text>
        </View>
      </TouchableOpacity>
      {divider && <Divider height={2} color={COLORS.lightGrey6} />}
    </>
  );
};

const EmptyHistory = ({ actionButton }) => (
  <Container style={styleSheet.noHistoryContainer}>
    <Text style={styleSheet.noHistoryText}>No transactions yet.</Text>
    <View style={styleSheet.noHistoryActionButton}>
      {actionButton}
    </View>
  </Container>
);

const HistoryList = ({ histories, actionButton, onCancelEtaHistory, navigation }) => (
  histories && histories.length
    ? (
      <Container style={styleSheet.container}>
        <View style={styleSheet.content}>
          {
            histories.map((history, index) => (
              <HistoryItemWrapper key={history.id} history={history} divider={index < (histories.length - 1)} onCancelEtaHistory={onCancelEtaHistory} navigation={navigation} />
            ))
          }
        </View>
      </Container>
    )
    : <EmptyHistory actionButton={actionButton} />
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
    status: null,
  },
  divider: false
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
    cancelable: PropTypes.bool,
    pDecimals: PropTypes.number,
    requestedAmount: PropTypes.oneOfType([PropTypes.string, PropTypes.number]),
    status: PropTypes.string,
  }),
  divider: PropTypes.bool,
};

HistoryList.defaultProps = {
  histories: null,
  actionButton: null,
  onCancelEtaHistory: null
};

HistoryList.propTypes = {
  histories: PropTypes.array,
  actionButton: PropTypes.element,
  onCancelEtaHistory: PropTypes.func
};

EmptyHistory.defaultProps = {
  actionButton: null
};

EmptyHistory.propTypes = {
  actionButton: PropTypes.element
};

export default HistoryList;
