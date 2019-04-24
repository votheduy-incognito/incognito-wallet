import React from 'react';
import { Image, Button, StyleSheet } from 'react-native';

const styles = StyleSheet.create({
  icon: {
    width: 24,
    height: 24,
  },
});

class Contact extends React.Component {
  static navigationOptions = {
    drawerLabel: 'Contact',
    drawerIcon: () => (
      <Image
        source={require('@src/assets/icon.png')}
        style={[styles.icon]}
      />
    ),
  };

  render() {
    return (
      <Button
        onPress={() => this.props.navigation.goBack()}
        title="Go back home"
      />
    );
  }
}

export default Contact;