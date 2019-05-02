import React from 'react';
import { Button, Text, View } from '@src/components/core';
import DrawerIcon from '@src/components/DrawerIcon';
import MdIcon from 'react-native-vector-icons/MaterialIcons';
import ROUTE_NAMES from '@src/router/routeNames';

class Home extends React.Component {
  constructor() {
    super();
    this.openDrawer = this.openDrawer.bind(this);
  }
  
  static navigationOptions = () => ({
    drawerLabel: 'Home',
    drawerIcon: () => (
      <DrawerIcon><MdIcon name='home' /></DrawerIcon>
    ),
  });

  openDrawer() {
    this.props.navigation.openDrawer();
  }

  componentDidMount() {
    this.openDrawer();
  }

  render() {
    return (
      <View>
        <Text>Home</Text>
        <Button
          onPress={() => this.props.navigation.navigate(ROUTE_NAMES.Contact)}
          title="Go to contact"
        />
        <Button
          onPress={() => this.props.navigation.navigate(ROUTE_NAMES.Login)}
          title="Go to login"
        />
      </View>
    );
  }
}

export default Home;