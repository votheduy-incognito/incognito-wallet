import React from 'react';
import { Image } from 'react-native';
import srcCheckedIcon from '@src/assets/images/icons/checked.png';
import srcUnCheckedIcon from '@src/assets/images/icons/un_checked.png';
import PropTypes from 'prop-types';
import { isIOS } from '@src/utils/platform';

const CheckedIcon = (props) => {
  const { checked } = props;
  return (
    <Image
      style={{
        width: 20,
        height: 21,
        marginBottom: isIOS() ? 0 : 3,
      }}
      source={checked ? srcCheckedIcon : srcUnCheckedIcon}
    />
  );
};

CheckedIcon.propTypes = {
  checked: PropTypes.bool.isRequired,
};

export default CheckedIcon;
