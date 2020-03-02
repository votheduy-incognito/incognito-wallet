import PropTypes from 'prop-types';
import images from '@src/assets';
import {ButtonExtension, Text, TouchableOpacity, Image, ScrollView, View} from '@src/components/core';
import routeNames from '@src/router/routeNames';
import React from 'react';
import styles from '../../styles';

export const TAG = 'FirstScreen';

const FirstScreen = ({ onNext, goToScreen }) => (
  <View style={styles.container}>
    <ScrollView>
      <Text style={styles.title2}>Make sure Node is plugged in.</Text>
      <View style={styles.content}>
        <Image style={styles.content_step1_image} source={images.ic_getstarted_device} />
      </View>
      <View style={styles.footer}>
        <ButtonExtension
          titleStyle={styles.textTitleButton}
          buttonStyle={styles.button}
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
  </View>
);

FirstScreen.propTypes = {
  onNext: PropTypes.func.isRequired,
  goToScreen: PropTypes.func.isRequired,
};

export default FirstScreen;
