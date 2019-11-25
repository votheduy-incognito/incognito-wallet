import { ActivityIndicator, Text, View } from '@src/components/core';
import { COLORS } from '@src/styles';
import PropTypes from 'prop-types';
import React  from 'react';
import style from './style';

const FullScreenLoading = ({ open, mainText }) => !open ? null : (
  <View style={style.container}>
    <ActivityIndicator size="large" color={COLORS.primary} />
    <Text style={style.desc}>
      {mainText ? mainText : 'Completing this action...\n\nPlease do not navigate away from the app.'}
    </Text>
  </View>
);

FullScreenLoading.defaultProps = {
  mainText: '',
};

FullScreenLoading.propTypes = {
  mainText: PropTypes.string,
  open: PropTypes.bool.isRequired,
};

export default FullScreenLoading;
