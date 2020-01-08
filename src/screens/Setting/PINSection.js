import PropTypes from 'prop-types';
import React from 'react';
import { Icon } from 'react-native-elements';
import SwitchToggle from 'react-native-switch-toggle';
import routeNames from '@routers/routeNames';
import {connect} from 'react-redux';
import {Text, TouchableOpacity} from '@components/core';
import {pinSection, sectionStyle} from '@screens/Setting/style';
import {COLORS} from '@src/styles';
import Section from './Section';

const PINSection = ({ navigation, pin }) => {
  const items = [];

  if (!pin) {
    items.push({
      title: 'Add PIN code',
      desc: 'Add pin code',
      icon: <Icon type='material' name="add" size={20} />,
      handlePress: () => navigation.navigate(routeNames.AddPin, { action: 'create' }),
    });
  } else {
    items.push({
      title: 'Change PIN code',
      desc: 'Change pin code',
      icon: <Icon type='material' name="edit" size={20} />,
      handlePress: () => navigation.navigate(routeNames.AddPin, { action: 'change' }),
    });
    items.push({
      title: 'Remove PIN code',
      desc: 'Remove pin code',
      icon: <Icon type='material' name="remove" size={20} />,
      handlePress: () => navigation.navigate(routeNames.AddPin, { action: 'remove' }),
    });
  }

  const togglePin = () => {
    if (pin) {
      navigation.navigate(routeNames.AddPin, { action: 'remove' });
    } else {
      navigation.navigate(routeNames.AddPin, { action: 'create' });
    }
  };

  return (
    <Section
      label="Security"
      customItems={[
        <TouchableOpacity
          key="PIN"
          onPress={togglePin}
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
            onPress={togglePin}
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
