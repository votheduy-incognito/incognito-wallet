import React from 'react';
import {Image} from 'react-native';
import srcWithdrawIcon from '@src/assets/images/icons/withdraw_icon.png';

const WithdrawIcon = props => {
  const defaultStyle = {
    width: 24,
    height: 16,
  };
  const {style, source, ...rest} = props;
  return (
    <Image source={srcWithdrawIcon} style={[defaultStyle, style]} {...rest} />
  );
};

export default WithdrawIcon;
