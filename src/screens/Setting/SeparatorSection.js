import React, { useState } from 'react';
import SwitchToggle from 'react-native-switch-toggle';
import {Text, TouchableOpacity} from '@components/core';
import {pinSection, sectionStyle} from '@screens/Setting/style';
import {COLORS} from '@src/styles';
import {getDecimalSeparator, setDecimalSeparator as saveDecimalSeparator} from '@src/resources/separator';
import Section from './Section';

const SeparatorSection = () => {
  const [decimalSeparator, setDecimalSeparator] = useState(getDecimalSeparator());

  const togglePin = () => {
    if (decimalSeparator === '.') {
      setDecimalSeparator(',');
      saveDecimalSeparator(',');
    } else {
      setDecimalSeparator('.');
      saveDecimalSeparator('.');
    }
  };

  return (
    <Section
      label="Decimal Separator"
      customItems={[
        <TouchableOpacity
          key="separator"
          onPress={togglePin}
          style={[
            sectionStyle.item,
            pinSection.item,
          ]}
        >
          <Text style={pinSection.name}>Use comma as decimal separator instead of period</Text>
          <SwitchToggle
            containerStyle={pinSection.switch}
            circleStyle={pinSection.circle}
            onPress={togglePin}
            switchOn={decimalSeparator === ','}
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

export default React.memo(SeparatorSection);
