import PropTypes from 'prop-types';
import {Button, Text, TouchableOpacity, Image, ScrollView, View} from '@src/components/core';
import routeNames from '@src/router/routeNames';
import nodeStep1 from '@src/assets/images/node/node_setup_step1.png';
import React from 'react';
import styles from '../../styles';

const FirstScreen = ({ onNext, goToScreen }) => (
  <ScrollView>
    <Text style={styles.title2}>{'Plug in your Node.\nYou\'ll see a blue light.'}</Text>
    <View style={styles.content}>
      <Image
        style={styles.content_step1_image}
        source={nodeStep1}
      />
    </View>
    <View style={styles.footer}>
      <Button
        onPress={onNext}
        title="Done"
      />
      <TouchableOpacity
        onPress={() => goToScreen(routeNames.LinkDevice)}
      >
        <Text style={styles.linkBtn}>
                Add an existing node
        </Text>
      </TouchableOpacity>
    </View>
  </ScrollView>
);

FirstScreen.propTypes = {
  onNext: PropTypes.func.isRequired,
  goToScreen: PropTypes.func.isRequired,
};

export default FirstScreen;
