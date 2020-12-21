import React from 'react';
import { StyleSheet, View, Text, TouchableOpacity } from 'react-native';
import { COLORS, FONT } from '@src/styles';

const BtnRetryGrey = (props) => {
  return (
    <TouchableOpacity {...props}>
      <View style={styles.wrapper}>
        <Text style={styles.icon}>
          􀅈
        </Text>
      </View>
    </TouchableOpacity>
  );
};

const styles = StyleSheet.create({
  wrapper: {
    backgroundColor: COLORS.lightGrey19,
    justifyContent: 'center',
    alignItems: 'center',
    width: 56,
    borderRadius: 20
  },
  icon: {
    ...FONT.STYLE.medium,
    fontSize: FONT.SIZE.medium,
    color: COLORS.newGrey,
    lineHeight: 32
  }
});

export default React.memo(BtnRetryGrey);