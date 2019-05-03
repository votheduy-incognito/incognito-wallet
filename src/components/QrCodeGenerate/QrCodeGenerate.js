import React from 'react';
import { View } from 'react-native';
import PropTypes from 'prop-types';
import QRCode from 'react-native-qrcode';
import { COLORS } from '@src/styles';
import styleSheet from './style';

const QrCodeGenerate = ({ data, size, bgColor, fgColor, style }) => (
  <View style={[styleSheet.container, style]}>
    <QRCode
      value={data}
      size={size}
      bgColor={bgColor}
      fgColor={fgColor}/>
  </View>
);

QrCodeGenerate.defaultProps = {
  size: 200,
  bgColor: COLORS.black,
  fgColor: COLORS.white,
};

QrCodeGenerate.propTypes = {
  data: PropTypes.string.isRequired,
  size: PropTypes.number,
  bgColor: PropTypes.string,
  fgColor: PropTypes.string,
};

export default QrCodeGenerate;