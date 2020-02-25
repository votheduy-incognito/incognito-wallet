import React from 'react';
import PropTypes from 'prop-types';
import { TouchableOpacity, View, Text, ScrollView } from '@src/components/core';
import SendIn from './SendIn';
import SendOut from './SendOut';

import styles from './style';

const modes = [
  {
    text: 'In Network',
    component: SendIn,
  },
  {
    text: 'Out Network',
    component: SendOut,
  }
];

const SendCoin = ({ navigation }) => {
  const [mode, setMode] = React.useState(modes[0]);

  const switchMode = (item) => {
    setMode(item);
  };

  const Component = mode.component;

  return (
    <View style={styles.container}>
      <View style={styles.content}>
        <View style={styles.modes}>
          {modes.map(item => (
            <TouchableOpacity
              key={item.text}
              onPress={() => switchMode(item)}
              style={[styles.mode, item.text !== mode.text && styles.deactiveMode]}
            >
              <Text style={styles.modeText}>{item.text}</Text>
            </TouchableOpacity>
          ))}
        </View>
        <ScrollView style={styles.content}>
          <Component navigation={navigation} />
        </ScrollView>
      </View>
    </View>
  );
};

SendCoin.propTypes = {
  navigation: PropTypes.object.isRequired,
};

export default SendCoin;
