import React from 'react';
import PropTypes from 'prop-types';
import { View, Text } from '@src/components/core';
import BackButton from '../BackButton';
import styles from './style';

const HeaderBar = (props) => {
  const { navigation, scene, index } = props;
  const { options } = scene.descriptor;
  const back = () => navigation.pop();

  return (
    <View style={[
      styles.container,
      {
        backgroundColor: options?.headerBackground,
      }
    ]}
    >
      <View style={styles.left}>
        { index > 0 && <BackButton onPress={back} />}
      </View>
      <View style={styles.center}>
        <Text style={styles.title} numberOfLines={1} ellipsizeMode='tail'>{options.title}</Text>
      </View>
      <View style={styles.right}>
        { options?.headerRight }
      </View>
    </View>
  );
};

HeaderBar.propTypes = {
  navigation: PropTypes.object.isRequired,
  scene: PropTypes.object.isRequired,
  index: PropTypes.number.isRequired,
};

export default HeaderBar;