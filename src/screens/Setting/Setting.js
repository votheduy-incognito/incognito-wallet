import { Container, ScrollView } from '@src/components/core';
import React from 'react';
import incognitoIcon from '@src/assets/images/icons/incognitoInactive.png';
import TabBarIcon from '@src/components/TabBarIcon';
import NetworkSection from './NetworkSection';
import PreferencesSection from './PreferencesSection';
import PrivacySection from './PrivacySection';

class Setting extends React.Component {
  static navigationOptions = () => ({
    tabBarIcon: props => <TabBarIcon image={incognitoIcon} {...props} />
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
