import React, { Component } from 'react';
import { ScrollView, View, Text } from '@src/components/core';
import styles from './style';


const Screen = ({ children }) => (
  <View style={styles.screen}>
    {children}
  </View>
);
export class Wizard extends Component {
  render() {
    return (
      <ScrollView horizontal pagingEnabled>
        <Screen><Text>Screen 1</Text></Screen>
        <Screen><Text>Screen 2</Text></Screen>
        <Screen><Text>Screen 3</Text></Screen>
      </ScrollView>
    );
  }
}

export default Wizard;
