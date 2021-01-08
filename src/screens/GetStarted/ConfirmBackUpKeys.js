import React, { useState } from 'react';
import PropTypes from 'prop-types';
import { StyleSheet } from 'react-native';
import {
  Image,
  RoundCornerButton,
  Text,
  View,
} from '@src/components/core';
import { COLORS, THEME, UTILS } from '@src/styles';
import { verticalScale } from 'react-native-size-matters';
import checkedIcon from '@assets/images/icons/checked-checkbox.png';
import uncheckedIcon from '@assets/images/icons/unchecked-checkbox.png';
import CheckBox from '@components/core/CheckBox/Component';
import { Header } from '@src/components';
import MainLayout from '@components/MainLayout/index';

const scale = UTILS.deviceHeight() < 550 ? 0.4 : 1;

const styles = StyleSheet.create({
  title: {
    marginTop: 42,
    ...THEME.text.boldTextStyleSuperMedium,
    fontSize: 20,
  },
  button: {
    marginTop: 50,
    backgroundColor: COLORS.black2,
  },
  buttonText: {
    color: COLORS.white,
  },
  subContent: {
    marginTop: 15,
    ...THEME.text.regularSizeMediumFontBlack,
    lineHeight: 24,
  },
  checkboxWrapper: {
    marginTop: 25,
    marginLeft: -10,
  },
  checkbox: {
    backgroundColor: 'transparent',
    borderWidth: 0,
    padding: 0,
    marginTop: -20,
  },
  checkboxTitle: {
    ...THEME.text.mediumTextMotto,
    fontWeight: '400',
    marginTop: 20,
  },
});

const ConfirmBackUp = ({ onNext, onBack }) => {
  const [checked, setChecked] = useState(false);

  return (
    <View>
      <Header title="Confirm" onGoBack={onBack} />
      <Text style={styles.title}>All done?</Text>
      <Text style={styles.subContent}>
        If you lose access to your existing private keys, you lose access to your funds.
      </Text>
      <View style={styles.checkboxWrapper}>
        <CheckBox
          title="I confirm that I have backed up my private keys."
          checked={checked}
          onPress={() => setChecked(!checked)}
          containerStyle={styles.checkbox}
          textStyle={styles.checkboxTitle}
          checkedIcon={<Image source={checkedIcon} />}
          uncheckedIcon={<Image source={uncheckedIcon} />}
          checkedColor='red'
        />
      </View>
      <RoundCornerButton
        style={styles.button}
        titleStyle={styles.buttonText}
        onPress={onNext}
        disabled={!checked}
        title="Proceed update"
      />
    </View>
  );
};

ConfirmBackUp.propTypes = {
  onNext: PropTypes.func.isRequired,
  onBack: PropTypes.func.isRequired,
};

export default ConfirmBackUp;
