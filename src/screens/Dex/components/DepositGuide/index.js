import React from 'react';
import PropTypes from 'prop-types';
import { Modal } from 'react-native';
import { View, Text, TouchableOpacity, Button } from '@src/components/core';
import style from './style';

const DepositGuide = ({ visible, onClose }) => {
  return (
    <Modal animationType="fade" transparent visible={visible}>
      <TouchableOpacity style={style.guide} onPress={onClose}>
        <View style={style.content}>
          <View style={style.triangle} />
          <View style={style.textContent}>
            <Text style={style.text}>
              It looks like you don&apos;t have sufficient funds at the moment.
            </Text>
            <Text style={[style.text, style.text2]}>
              Simply top up your pDEX account to complete this trade. If you like the rate you see, be quick!
            </Text>
          </View>
        </View>
      </TouchableOpacity>
    </Modal>
  );
};

DepositGuide.propTypes = {
  visible: PropTypes.bool.isRequired,
  onClose: PropTypes.func.isRequired,
};

export default DepositGuide;
