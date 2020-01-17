import PropTypes from 'prop-types';
import React, { useState } from 'react';
import storageService from '@src/services/storage';
import { Icon } from 'react-native-elements';
import SwitchToggle from 'react-native-switch-toggle';
import routeNames from '@routers/routeNames';
import {connect} from 'react-redux';
import {Text, TouchableOpacity, Alert} from '@components/core';
import {pinSection, sectionStyle} from '@screens/Setting/style';
import { CONSTANT_KEYS } from '@src/constants';
import {COLORS} from '@src/styles';
import Section from './Section';

const PINSection = ({ navigation, pin }) => {
  const [isBackedUpAccount, setBackupAccount] = useState(false);

  navigation.addListener('willFocus', () => {
    storageService.getItem(CONSTANT_KEYS.IS_BACKEDUP_ACCOUNT)
      .then((isBackedUp) => setBackupAccount(!!JSON.parse(isBackedUp)))
      .catch(() => setBackupAccount(false));
  });


  const showLockAlert = () => {
    Alert.alert(
      'Backup your account first',
      'Please back up your accounts before using pass code',
      [
        {
          text: 'Later',
          style: 'cancel'
        },
        {
          text: 'Back up now',
          onPress: () => {
            navigation?.navigate(routeNames.BackupKeys);
          }
        }
      ],
      { cancelable: false }
    );
  };

  const togglePin = () => {
    if (pin) {
      navigation.navigate(routeNames.AddPin, { action: 'remove' });
    } else {
      navigation.navigate(routeNames.AddPin, { action: 'create' });
    }
  };

  const handlePressToggle = () => {
    return isBackedUpAccount ? togglePin() : showLockAlert();
  };

  return (
    <Section
      label="Security"
      customItems={[
        <TouchableOpacity
          key="PIN"
          onPress={handlePressToggle}
          style={[
            sectionStyle.item,
            pinSection.item,
          ]}
        >
          <Icon type='material' name="lock" size={20} containerStyle={pinSection.icon} />
          <Text style={pinSection.name}>Passcode</Text>
          <SwitchToggle
            containerStyle={pinSection.switch}
            circleStyle={pinSection.circle}
            onPress={handlePressToggle}
            switchOn={!!pin}
            backgroundColorOn={COLORS.dark1}
            backgroundColorOff={COLORS.lightGrey5}
            circleColorOff={COLORS.lightGrey1}
            circleColorOn={COLORS.primary}
          />
        </TouchableOpacity>
      ]}
    />
  );
};

PINSection.defaultProps = {
  pin: '',
};

PINSection.propTypes = {
  navigation: PropTypes.object.isRequired,
  pin: PropTypes.string,
};

const mapState = state => ({
  pin: state.pin.pin,
});

export default connect(mapState)(PINSection);
