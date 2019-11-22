import { ActivityIndicator, Text, View } from '@src/components/core';
import { COLORS } from '@src/styles';
import PropTypes from 'prop-types';
import React  from 'react';
import { Modal } from 'react-native';
import style from './style';

const FullScreenLoading = ({ open, text, mainText }) => (
  <Modal animationType="fade" transparent visible={open}>
    <View style={style.container}>
      <ActivityIndicator size="large" color={COLORS.primary} />
      <Text style={style.desc}>
        {text}
      </Text>
      <Text style={style.desc}>
        {mainText ? mainText : 'Completing this action...\n\nPlease do not navigate away from the app.'}
      </Text>
    </View>
  </Modal>
);

FullScreenLoading.defaultProps = {
  text: '',
  mainText: '',
};

FullScreenLoading.propTypes = {
  text: PropTypes.string,
  mainText: PropTypes.string,
  open: PropTypes.bool.isRequired,
};

export default FullScreenLoading;
