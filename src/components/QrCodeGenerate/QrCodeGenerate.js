import React, { useState } from 'react';
import { View, Text } from '@src/components/core';
import PropTypes from 'prop-types';
import QRCode from 'react-native-qrcode-svg';
import { COLORS } from '@src/styles';
import styleSheet from './style';

const QrCodeGenerate = ({ value, size, style }) => {
  const [error, setError] = useState(null);

  return (
    <View style={[styleSheet.container, style]}>
      {
        error ? (
          <Text>Can not show QR code</Text>
        ) : (
          <QRCode
            value={value}
            size={size}
            onError={setError}
          />
        )
      }
    </View>
  );
};

QrCodeGenerate.defaultProps = {
  size: 200,
  bgColor: COLORS.black,
  fgColor: COLORS.white,
};

QrCodeGenerate.propTypes = {
  value: PropTypes.string.isRequired,
  size: PropTypes.number,
};

export default QrCodeGenerate;