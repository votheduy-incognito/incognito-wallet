import React from 'react';
import {StyleSheet, View} from 'react-native';
import {COLORS} from '@src/styles';

const styled = StyleSheet.create({
  container: {
    backgroundColor: COLORS.lightGrey5,
    paddingHorizontal: 25,
    paddingVertical: 35,
    flex: 1,
  },
});

const enhance = WrappedComp => props => {
  return (
    <View style={styled.container}>
      <WrappedComp {...props} />
    </View>
  );
};

export default enhance;
