import React from 'react';
import DrawerIcon from '@src/components/DrawerIcon';
import MdIcon from 'react-native-vector-icons/MaterialIcons';
import { ScrollView, Container } from '@src/components/core';
import NetworkSection from './NetworkSection';
import PreferencesSection from './PreferencesSection';
import PrivacySection from './PrivacySection';

class Setting extends React.Component {
  constructor() {
    super();
    this.state = {
      defaultServerId: 1,
      defaultLanguage: 'en',
      passphrase: 'passphrase_placeholder'
    };
  }
  static navigationOptions = () => ({
    drawerLabel: 'Setting',
    drawerIcon: () => (
      <DrawerIcon><MdIcon name='settings' /></DrawerIcon>
    ),
  });

  render() {
    const { defaultServerId, defaultLanguage, passphrase } = this.state;
    const { navigation } = this.props;
    return (
      <ScrollView>
        <Container>
          <NetworkSection navigation={navigation} defaultServerId={defaultServerId} />
          <PreferencesSection defaultLanguage={defaultLanguage} />
          <PrivacySection passphrase={passphrase} />
        </Container>
      </ScrollView>
    );
  }
}

export default Setting;