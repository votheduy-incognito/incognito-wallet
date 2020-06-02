import React from 'react';
import PropTypes from 'prop-types';
import { View, Button } from '@src/components/core';
import { withNavigation } from 'react-navigation';
import ROUTE_NAMES from '@src/router/routeNames';
import { backupStyle } from './style';

const SendReceiveGroup = ({ navigation }) => {
  const goToBackup = () => {
    navigation.navigate(ROUTE_NAMES.BackupKeys);
  };

  return (
    <View style={backupStyle.container}>
      <Button title='Back up' onPress={goToBackup} style={backupStyle.button} titleStyle={backupStyle.buttonText} />
    </View>
  );
};

SendReceiveGroup.propTypes = {
  navigation: PropTypes.object.isRequired
};

export default withNavigation(SendReceiveGroup);
