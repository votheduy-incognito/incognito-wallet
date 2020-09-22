import React from 'react';
import { Linking, Text, StyleSheet } from 'react-native';
import { Toast, TouchableOpacity } from '@src/components/core';
import PropTypes from 'prop-types';

const styled = StyleSheet.create({
  container: {},
  content: {},
});

export const useLinking = (props) => {
  const { url } = props;
  const handlePress = React.useCallback(async () => {
    const supported = await Linking.canOpenURL(url);
    if (supported) {
      await Linking.openURL(url);
    } else {
      Toast.showError(`Don't know how to open this URL: ${url}`);
    }
  }, [url]);

  return [handlePress];
};

const Link = (props) => {
  const { url, content, contentStyle, containerStyle } = props;
  const [handlePress] = useLinking({ url });
  return (
    <TouchableOpacity
      style={[styled.container, containerStyle]}
      onPress={handlePress}
    >
      <Text style={[styled.content, contentStyle]}>{content}</Text>
    </TouchableOpacity>
  );
};

Link.defaultProps = {
  contentStyle: {},
  containerStyle: {},
};

Link.propTypes = {
  url: PropTypes.string.isRequired,
  content: PropTypes.string.isRequired,
  contentStyle: PropTypes.any,
  containerStyle: PropTypes.any,
};

export default React.memo(Link);
