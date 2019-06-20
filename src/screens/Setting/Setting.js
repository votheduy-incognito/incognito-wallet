import { Container, ScrollView } from '@src/components/core';
import DrawerIcon from '@src/components/DrawerIcon';
import React from 'react';
import MdIcon from 'react-native-vector-icons/MaterialIcons';
import NetworkSection from './NetworkSection';
import PreferencesSection from './PreferencesSection';
import PrivacySection from './PrivacySection';

class Setting extends React.Component {
  static navigationOptions = () => ({
    drawerLabel: 'Setting',
    drawerIcon: () => (
      <DrawerIcon>
        <MdIcon name="settings" />
      </DrawerIcon>
    )
  });
  constructor() {
    super();
    this.state = {
      defaultServerId: 1,
      defaultLanguage: 'en'
    };
  }

  render() {
    const { defaultServerId, defaultLanguage } = this.state;
    const { navigation } = this.props;
    return (
      <ScrollView>
        <Container>
          <NetworkSection
            navigation={navigation}
            defaultServerId={defaultServerId}
          />
          <PreferencesSection defaultLanguage={defaultLanguage} />
          <PrivacySection navigation={navigation} />
        </Container>
      </ScrollView>
    );
  }
}

export default Setting;
