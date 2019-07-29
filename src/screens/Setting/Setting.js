import React from 'react';
import PropTypes from 'prop-types';
import { Container, ScrollView } from '@src/components/core';
import NetworkSection from './NetworkSection';
// import PrivacySection from './PrivacySection';
import WalletSection from './WalletSection';

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
      <ScrollView>
        <Container>
          <WalletSection navigation={navigation} />
          <NetworkSection
            navigation={navigation}
            defaultServerId={defaultServerId}
          />
          {/* <PrivacySection navigation={navigation} /> */}
        </Container>
      </ScrollView>
    );
  }
}

Setting.propTypes = {
  navigation: PropTypes.object.isRequired
};

export default Setting;
