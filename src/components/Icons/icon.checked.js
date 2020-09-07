import React from 'react';
import { Image } from 'react-native';
import srcCheckedIcon from '@src/assets/images/icons/checked.png';
import srcUnCheckedIcon from '@src/assets/images/icons/un_checked.png';
import PropTypes from 'prop-types';

const CheckedIcon = (props) => {
  const { checked } = props;
  return (
    <Image
      source={checked ? srcCheckedIcon : srcUnCheckedIcon}
      style={{
        width: 18,
        height: 18,
      }}
    />
  );
};

CheckedIcon.propTypes = {
  checked: PropTypes.bool.isRequired,
};

export default CheckedIcon;
