import React from 'react';
import PropTypes from 'prop-types';
import { View, ScrollView } from '@src/components/core';
import NetworkSection from './NetworkSection';
// import PrivacySection from './PrivacySection';
import AccountSection from './AccountSection';
import { settingStyle } from './style';

class Setting extends React.Component {
  constructor() {
    super();
    this.state = {
      defaultServerId: 1,
    };
  }

  render() {
    const { defaultServerId } = this.state;
    const { navigation } = this.props;
    return (
      <ScrollView contentContainerStyle={{ minHeight: '100%' }}>
        <View style={settingStyle.container}>
          <AccountSection navigation={navigation} />
          <NetworkSection
            navigation={navigation}
            defaultServerId={defaultServerId}
          />
          {/* <PrivacySection navigation={navigation} /> */}
        </View>
      </ScrollView>
    );
  }
}

Setting.propTypes = {
  navigation: PropTypes.object.isRequired
};

export default Setting;
