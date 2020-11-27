import React from 'react';
import PropTypes from 'prop-types';
import { StyleSheet } from 'react-native';
import {
  RoundCornerButton,
  Text,
  TouchableOpacity,
  View,
} from '@src/components/core';
import { COLORS, THEME, UTILS } from '@src/styles';
import { verticalScale } from 'react-native-size-matters';

const scale = UTILS.deviceHeight() < 550 ? 0.4 : 1;

const styles = StyleSheet.create({
  title: {
    marginTop: verticalScale(120 * scale),
    ...THEME.text.boldTextStyleSuperMedium,
    fontSize: 30,
    textAlign: 'center',
  },
  button: {
    marginTop: verticalScale(40 * scale),
    backgroundColor: COLORS.black2,
  },
  buttonText: {
    color: COLORS.white,
  },
  subContent: {
    marginTop: verticalScale(40 * scale),
    ...THEME.text.regularSizeMediumFontBlack,
  },
  bold: {
    ...THEME.text.boldTextStyle,
  },
  subButton: {
    marginTop: verticalScale(20 * scale),
    textAlign: 'center',
    ...THEME.text.mediumTextMotto,
  },
});

const WelcomeOldUser = ({ onCreate, onImport }) => {
  return (
    <View>
      <Text style={styles.title}>Hello again.</Text>
      <Text style={styles.subContent}>
        Things may look a little different since the last time you visited, but don’t worry!
        <Text style={styles.bold}> Your data is safe.</Text>
        {'\n\n'}
        Simply create a master key to continue as you were. You’ll find your old keychains in the Keychain tab.
      </Text>
      <RoundCornerButton
        style={styles.button}
        titleStyle={styles.buttonText}
        onPress={onCreate}
        title="Create your master key"
      />
      <TouchableOpacity
        onPress={onImport}
      >
        <Text style={styles.subButton}>Restore from phrase</Text>
      </TouchableOpacity>
    </View>
  );
};

WelcomeOldUser.propTypes = {
  onCreate: PropTypes.func.isRequired,
  onImport: PropTypes.func.isRequired,
};

export default WelcomeOldUser;
