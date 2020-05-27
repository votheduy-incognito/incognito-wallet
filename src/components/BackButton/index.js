import React from 'react';
import PropTypes from 'prop-types';
import { Image } from 'react-native';
import { withNavigation } from 'react-navigation';
import { TouchableOpacity } from '@src/components/core';
import { THEME } from '@src/styles';

import chevronLeft from '@src/assets/images/icons/chevron-left-icon.png';
import {generateTestId} from '@utils/misc';
import {HEADER} from '@src/constants/elements';

const BackButton = ({ onPress, width, height, size, navigation, style }) => {
  const back = () => navigation?.pop();

  return (
    <TouchableOpacity
      onPress={onPress || back}
      style={[{
        display: 'flex',
        justifyContent: 'center',
        width: width,
        paddingLeft: 5,
        paddingRight: 5,
        height: height
      }, style]}
      {...generateTestId(HEADER.BACK_BUTTON)}
    >
      <Image
        style={{
          height: size,
          width: '100%',
        }}
        resizeMode="contain"
        resizeMethod="resize"
        source={chevronLeft}
      />
    </TouchableOpacity>
  );
};

BackButton.propTypes = {
  onPress: PropTypes.func,
  width: PropTypes.number,
  height: PropTypes.number,
  size: PropTypes.number,
  navigation: PropTypes.object.isRequired,
  style: PropTypes.object
};

BackButton.defaultProps = {
  width: 50,
  size: 20,
  height: THEME.header.headerHeight,
  onPress: null,
  style: {}
};

export default withNavigation(BackButton);
