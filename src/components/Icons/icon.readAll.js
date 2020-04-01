import React from 'react';
import {TouchableOpacity, Image, View, StyleSheet} from 'react-native';
import srcReadAll from '@src/assets/images/icons/read_all.png';

const styled = StyleSheet.create({
  icon: {
    width: 24,
    height: 22,
  },
  container: {
    marginRight: 20,
  },
});

const ReadAllIcon = props => {
  return (
    <View style={[styled.container]}>
      <TouchableOpacity {...props}>
        <Image style={[styled.icon]} source={srcReadAll} />
      </TouchableOpacity>
    </View>
  );
};
ReadAllIcon.defaultProps = {};

ReadAllIcon.propTypes = {};

export default ReadAllIcon;
