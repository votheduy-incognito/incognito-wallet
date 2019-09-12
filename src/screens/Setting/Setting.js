import { ScrollView, View } from '@src/components/core';
import PropTypes from 'prop-types';
import React from 'react';
// import PrivacySection from './PrivacySection';
import AccountSection from './AccountSection';
import NetworkSection from './NetworkSection';
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
      <ScrollView contentContainerStyle={{ flexGrow:1 }}>
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
