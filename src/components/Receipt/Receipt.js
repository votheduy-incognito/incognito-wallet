/* eslint-disable react-native/no-raw-text */
import { Container, Text, View } from '@src/components/core';
import { COLORS } from '@src/styles';
import formatUtil from '@src/utils/format';
import PropTypes from 'prop-types';
import React from 'react';
import tokenData from '@src/constants/tokenData';
import SimpleLineIcons from 'react-native-vector-icons/SimpleLineIcons';
import styleSheet from './style';


const CommonText = props => (
  <Text
    style={styleSheet.text}
    numberOfLines={1}
    ellipsizeMode="tail"
    {...props}
  />
);
const Receipt = ({ info }) => {
  const { txId, time, amount, amountUnit, toAddress, fromAddress, fee, feeUnit } = info;
  return (
    <Container style={styleSheet.container}>
      <SimpleLineIcons name="check" size={100} color={COLORS.white} />
      <View style={styleSheet.infoContainer}>
        {!!txId && <CommonText>{`TxID:${txId}`}</CommonText>}
        {!!fromAddress && (
          <CommonText ellipsizeMode="middle">{`From:${fromAddress}`}</CommonText>
        )}
        {!!toAddress && (
          <CommonText ellipsizeMode="middle">
            To:
            {toAddress}
          </CommonText>
        )}
        {!!time && (
          <CommonText>
            Time:
            {formatUtil.formatDateTime(time)}
          </CommonText>
        )}
        {(amount === 0 || !!amount) && (
          <CommonText>
            Amount: 
            {' '}
            {formatUtil.amount(amount, amountUnit)} 
            {' '}
            {amountUnit}
          </CommonText>
        )}
        {(fee === 0 || !!fee) && (
          <CommonText>
            Fee: 
            {' '}
            {formatUtil.amount(fee, feeUnit)}
            {' '}
            {feeUnit}
          </CommonText>
        )}
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
    time: PropTypes.oneOfType([
      PropTypes.string,
      PropTypes.object,
      PropTypes.number
    ]),
    amount: PropTypes.number,
    amountUnit: PropTypes.string,
    fee: PropTypes.number,
    feeUnit: PropTypes.string,
  })
};

export default Receipt;
