import React from 'react';
import { View, Container } from '@src/components/core';
import DrawerIcon from '@src/components/DrawerIcon';
import MdIcon from 'react-native-vector-icons/MaterialIcons';
import AccountAddress from './AccountAddress';
import AccountBalance from './AccountBalance';
import ActionButtons from './ActionButtons';
import { homeStyle } from './style';

class Home extends React.Component {
  constructor() {
    super();

    this.state = {
      accountAddress: '15624561ajhsdhashjdbjasbdjbjahsbdjbasjhbdjhasbjdbasjhbdjabsjdhba256',
      accountBalance: 10000.2678
    };

    this.actionButtons = [
      {
        label: 'SEND',
        handlePress: null
      },
      {
        label: 'STAKING',
        handlePress: null
      },
      {
        label: 'DEFRAGMENT',
        handlePress: null
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
    const { accountAddress, accountBalance } = this.state;
    return (
      <View style={homeStyle.container}>
        <Container style={homeStyle.mainContainer}>
          <AccountAddress data={accountAddress} />
          <AccountBalance balance={accountBalance} />
          <ActionButtons actions={this.actionButtons} />
        </Container>
      </View>
    );
  }
}

export default Home;