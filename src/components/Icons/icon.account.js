import React from 'react';
import {Image} from 'react-native';
import srcAccountIcon from '@src/assets/images/icons/ic_account_active.png';
import PropTypes from 'prop-types';

const AccountIcon = props => {
  const defaultStyle = {
    width: 32,
    height: 32,
  };
  const {style, source, ...rest} = props;
  return (
    <Image
      source={source ? source : srcAccountIcon}
      style={[defaultStyle, style]}
      {...rest}
    />
  );
};

AccountIcon.defaultProps = {
  source: srcAccountIcon,
  style: {},
};

AccountIcon.propTypes = {
  style: PropTypes.any,
  source: PropTypes.any,
};

export default AccountIcon;
