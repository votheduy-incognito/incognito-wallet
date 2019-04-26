import React from 'react';
import { Button, Text, View } from '@core';
import { ROUTE_NAMES } from '@src/router';

class Home extends React.Component {
  constructor() {
    super();
    this.openDrawer = this.openDrawer.bind(this);
  }
  static navigationOptions = ({ navigation }) => ({
    // drawerLabel: 'Home',
    // drawerIcon: () => (
    //   <Text>OK</Text>
    // ),
    title: 'Home Title',
    headerRight: (
      <Button
        onPress={navigation.getParam('increaseCount')}
        title="+1"
        color="#fff"
      />
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