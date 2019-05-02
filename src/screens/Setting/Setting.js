import React from 'react';
import DrawerIcon from '@src/components/DrawerIcon';
import MdIcon from 'react-native-vector-icons/MaterialIcons';
import { Button } from '@src/components/core';

class Setting extends React.Component {
  static navigationOptions = () => ({
    drawerLabel: 'Setting',
    drawerIcon: () => (
      <DrawerIcon><MdIcon name='settings' /></DrawerIcon>
    ),
  });

  render() {
    return (
      <Button
        onPress={() => this.props.navigation.goBack()}
        title="Go back home"
      />
    );
  }
}

export default Setting;