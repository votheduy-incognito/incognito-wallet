import React, { memo } from 'react';
import {ScrollView, StyleSheet, View} from 'react-native';
import PropTypes from 'prop-types';
import withEnhance from '@screens/Node/UpdateFirmware/UpdateFirmware.enhance';
import withData from '@screens/Node/UpdateFirmware/UpdateFirware.enhanceData';
import { Header } from '@src/components';
import { compose } from 'recompose';
import { withLayout_2 } from '@components/Layout';
import styles from '@screens/Node/UpdateWifi/style';
import theme from '@src/styles/theme';
import {
  RoundCornerButton,
  Text
} from '@components/core';
import { MESSAGES } from '@src/constants';

const UpdateFirmware = memo(({
  updating,
  updateSuccess,
  onGoBack,
  onButtonPress
}) => {

  const renderTitle = () => (
    <Text style={[theme.text.blackMedium, UpdateFirmwareStyles.title ]}>
      { updateSuccess
        ? MESSAGES.UPDATE_FIRMWARE_NODE_DONE
        : MESSAGES.MAKE_UPDATE_FIRMWARE_NODE
      }
    </Text>
  );

  return (
    <View style={{ flex: 1 }}>
      <Header title='Update Node' onGoBack={onGoBack} />
      <ScrollView>
        {renderTitle()}
        <RoundCornerButton
          disabled={updating}
          title={updateSuccess ? 'OK' : updating ? 'Updating' : 'Update now'}
          isLoading={updating}
          style={[styles.button, theme.BUTTON.NODE_BUTTON]}
          onPress={onButtonPress}
        />
      </ScrollView>
    </View>
  );
});

UpdateFirmware.propTypes = {
  updating: PropTypes.bool.isRequired,
  updateSuccess: PropTypes.bool.isRequired,
  onGoBack: PropTypes.func.isRequired,
  onButtonPress: PropTypes.func.isRequired,
};

const UpdateFirmwareStyles = StyleSheet.create({
  title: {
    lineHeight: 30,
    marginBottom: 20,
    marginTop: 42
  }
});

export default compose(
  withLayout_2,
  withData,
  withEnhance
)(UpdateFirmware);