import React from 'react';
import { Image, StyleSheet } from 'react-native';
import srcOpenUrl from '@src/assets/images/icons/open_url.png';

const styled = StyleSheet.create({
  container: {
    width: 15,
    height: 14,
  },
});

const IconOpenUrl = props => {
  return <Image style={[styled.container, props?.style]} source={srcOpenUrl} />;
};

IconOpenUrl.propTypes = {};

export default IconOpenUrl;
