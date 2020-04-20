import React from 'react';
import PropTypes from 'prop-types';
import { TouchableWithoutFeedback } from 'react-native';
import { Image } from '@src/components/core';
import { withNavigation } from 'react-navigation';
import setting from '@assets/images/setting_white.png';
import ROUTE_NAMES from '@routers/routeNames';
import { generateTestId } from '@utils/misc';
import { WALLET } from '@src/constants/elements';
import styles from './style';

const SettingIcon = ({ navigation }) => {
  return (
    <TouchableWithoutFeedback
      onPress={() => navigation.navigate(ROUTE_NAMES.Setting)}
      {...generateTestId(WALLET.SETTING_BTN)}
    >
      <Image source={setting} style={styles.setting} />
    </TouchableWithoutFeedback>
  );
};

SettingIcon.propTypes = {
  navigation: PropTypes.object.isRequired,
};

export default withNavigation(SettingIcon);
