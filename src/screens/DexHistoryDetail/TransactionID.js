import React from 'react';
import PropTypes from 'prop-types';
import {TouchableOpacity, Image, Text, View} from '@components/core';
import linkingService from '@services/linking';
import {CONSTANT_CONFIGS} from '@src/constants';
import external from '@assets/images/icons/external.png';
import stylesheet from './style';

const TransactionID = ({ txId }) => {
  return (
    <View style={stylesheet.row}>
      <Text style={stylesheet.field}>TRANSACTION ID</Text>
      <TouchableOpacity style={stylesheet.txButton} onPress={() => { linkingService.openUrl(`${CONSTANT_CONFIGS.EXPLORER_CONSTANT_CHAIN_URL}/tx/${txId}`); }}>
        <Text style={[stylesheet.textRight, stylesheet.id]} numberOfLines={1} ellipsizeMode="middle">{txId}</Text>
        <Image
          source={external}
          resizeMode="contain"
          resizeMethod="resize"
          style={{position: 'absolute', top: 2, right: 0, width: 14, height: 14 }}
        />
      </TouchableOpacity>
    </View>
  );
};

TransactionID.propTypes = {
  txId: PropTypes.string.isRequired,
};

export default TransactionID;
