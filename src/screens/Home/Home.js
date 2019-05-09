import React from 'react';
import PropTypes from 'prop-types';
import { View, ScrollView, Container } from '@src/components/core';
import DrawerIcon from '@src/components/DrawerIcon';
import MdIcon from 'react-native-vector-icons/MaterialIcons';
import ROUTE_NAMES from '@src/router/routeNames';
import AccountAddress from './AccountAddress';
import AccountBalance from './AccountBalance';
import ActionButtons from './ActionButtons';
import HomeTabs from './HomeTabs';
import { homeStyle } from './style';

class Home extends React.Component {
  constructor(props) {
    super(props);

    this.actionButtons = [
      {
        label: 'SEND',
        handlePress: () => props?.navigation?.navigate(ROUTE_NAMES.SendConstant)
      },
      {
        label: 'STAKING',
        handlePress: () => props?.navigation?.navigate(ROUTE_NAMES.Staking)
      },
      {
        label: 'DEFRAGMENT',
        handlePress: () => props?.navigation?.navigate(ROUTE_NAMES.Defragment)
      }
    ];
  }
  
  static navigationOptions = () => ({
    drawerLabel: 'Home',
    drawerIcon: () => (
      <DrawerIcon><MdIcon name='home' /></DrawerIcon>
    ),
  });

  render() {
    const { account, isGettingBalance, reloadBalance } = this.props;
    return (
      <ScrollView style={homeStyle.container}>
        <Container style={homeStyle.mainContainer}>
          <AccountAddress data={account?.PaymentAddress} /> 
          <AccountBalance balance={account?.value} isGettingBalance={isGettingBalance} onReload={reloadBalance} />
          <ActionButtons actions={this.actionButtons} />
        </Container>
        <View style={homeStyle.tabContainer}>
          <HomeTabs />
        </View>
      </ScrollView>
    );
  }
}

Home.defaultProps = {
  account: {},
  isGettingBalance: false
};

Home.propTypes = {
  account: PropTypes.object,
  reloadBalance: PropTypes.func,
  isGettingBalance: PropTypes.bool
};

export default Home;