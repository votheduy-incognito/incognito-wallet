
import {
  Container,
  Divider,
  Image,
  Text,
  TouchableOpacity,
  View
} from '@src/components/core';
import { CONSTANT_CONFIGS } from '@src/constants';
import linkingService from '@src/services/linking';
import { hashToIdenticon } from '@src/services/wallet/RpcClientService';
import { ConfirmedTx, SuccessTx } from '@src/services/wallet/WalletService';
import { COLORS } from '@src/styles';
import PropTypes from 'prop-types';
import React, { useEffect, useState } from 'react';
import tokenData from '@src/constants/tokenData';
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
  default:
    statusText = 'Failed';
    statusColor = COLORS.red;
  }

  return {
    statusText,
    statusColor
  };
};

const openTxExplorer = txId =>
  linkingService.openUrl(
    `${CONSTANT_CONFIGS.EXPLORER_CONSTANT_CHAIN_URL}/tx/${txId}`
  );

const HistoryItem = ({ history }) => {
  if (!history) {
    return null;
  }
  const [imageSrc, setImageSrc] = useState(null);
  const { statusText, statusColor } = getStatusData(history.status);

  useEffect(() => {
    history.txID &&
      hashToIdenticon([history.txID]).then(images => {
        setImageSrc(images[0]);
      });
  }, [history.txID]);

  return (
    <>
      <View style={styleSheet.itemContainer}>
        <View style={styleSheet.row}>
          <TouchableOpacity onPress={() => openTxExplorer(history.txID)}>
            {imageSrc && (
              <Image style={styleSheet.image} source={{ uri: imageSrc }} />
            )}
          </TouchableOpacity>
          <Text
            style={styleSheet.timeText}
            numberOfLines={1}
            ellipsizeMode="tail"
          >
            {history.time}
          </Text>
        </View>
        <View style={styleSheet.row}>
          <Text
            style={styleSheet.receiverText}
            numberOfLines={1}
            ellipsizeMode="middle"
          >
            To: 
            {' '}
            {history.receiver}
          </Text>
          <Text
            style={styleSheet.amountText}
            numberOfLines={1}
            ellipsizeMode="tail"
          >
            {history.amountAndSymbol}
          </Text>
        </View>
        <View style={styleSheet.row}>
          <Text
            style={styleSheet.feeText}
            numberOfLines={1}
            ellipsizeMode="tail"
          >
            Fee: 
            {' '}
            {history.fee}
            {' '}
            {tokenData.SYMBOL.MAIN_CRYPTO_CURRENCY}
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
      <Divider style={styleSheet.divider} color={COLORS.lightGrey1} />
    </>
  );
};

const History = ({ histories }) => (
  <Container style={styleSheet.container}>
    {histories &&
      histories.map(history => (
        <HistoryItem key={history.txID} history={history} />
      ))}
  </Container>
);

HistoryItem.propTypes = {
  history: PropTypes.shape({
    txID: PropTypes.string,
    time: PropTypes.string,
    receiver: PropTypes.string,
    amountAndSymbol: PropTypes.string,
    fee: PropTypes.string,
    status: PropTypes.number
  })
};

History.propTypes = {
  histories: PropTypes.objectOf(PropTypes.array)
};

export default History;
