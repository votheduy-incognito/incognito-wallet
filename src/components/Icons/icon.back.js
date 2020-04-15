import React from 'react';
import {Image, StyleSheet, View} from 'react-native';
import srcBackIcon from '@src/assets/images/icons/back.png';

const styled = StyleSheet.create({
  defaultStyle: {
    width: 10,
    height: 18,
  },
  container: {
    padding: 10,
  },
});

const ReadIcon = props => {
  const {style, source, ...rest} = props;
  return (
    <View style={styled.container}>
      <Image
        source={srcBackIcon}
        style={[styled.defaultStyle, style]}
        {...rest}
      />
    </View>
  );
};

export default ReadIcon;
