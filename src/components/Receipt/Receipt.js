import React from 'react';
import PropTypes from 'prop-types';
import SimpleLineIcons from 'react-native-vector-icons/SimpleLineIcons';
import { Text, Container, View } from '@src/components/core';
import styleSheet from './style';
import { COLORS } from '@src/styles';
import formatUtil from '@src/utils/format';

const CommonText = (props) => <Text style={styleSheet.text} numberOfLines={1} ellipsizeMode='tail' {...props} />;
const Receipt = ({ info }) => {
  const { txId, time, amount, amountUnit, toAddress, fromAddress } = info;
  return (
    <Container style={styleSheet.container} >
      <SimpleLineIcons name='check' size={100} color={COLORS.white} />
      <View style={styleSheet.infoContainer}>
        { txId && <CommonText>TxID: {txId}</CommonText> }
        { fromAddress && <CommonText ellipsizeMode='middle'>From: {fromAddress}</CommonText> }
        { toAddress && <CommonText ellipsizeMode='middle'>To: {toAddress}</CommonText> }
        { time && <CommonText>Time: {formatUtil.formatDateTime(time)}</CommonText> }
        { amount && <CommonText>Amount: {formatUtil.amountConstant(amount)} {amountUnit}</CommonText> }
      </View>
    </Container>
  );
};

Receipt.defaultProps = {
  info: {}
};

Receipt.propTypes = {
  info: PropTypes.shape({
    txId: PropTypes.string,
    toAddress: PropTypes.string,
    fromAddress: PropTypes.string,
    time: PropTypes.oneOfType([ PropTypes.string, PropTypes.object, PropTypes.number ]),
    amount: PropTypes.number,
    amountUnit: PropTypes.string
  })
};

export default Receipt;