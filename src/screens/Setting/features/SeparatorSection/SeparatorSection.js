import React, { useState } from 'react';
import { Switch } from '@components/core';
import {
  getDecimalSeparator,
  setDecimalSeparator as saveDecimalSeparator,
} from '@src/resources/separator';
import Section, { sectionStyle } from '@screens/Setting/features/Section';
import { Text, View } from 'react-native';

const SeparatorSection = () => {
  const [decimalSeparator, setDecimalSeparator] = useState(
    getDecimalSeparator(),
  );

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
        <View
          key="separator"
          onPress={togglePin}
          style={[sectionStyle.subItem]}
        >
          <Text style={[sectionStyle.desc]}>
            {'Use decimal comma\ninstead of point'}
          </Text>
          <Switch onValueChange={togglePin} value={decimalSeparator === ','} />
        </View>,
      ]}
    />
  );
};

export default React.memo(SeparatorSection);
