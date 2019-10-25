import React, { PureComponent } from 'react';
import { Container, TextInput, Button, View, Text } from '@src/components/core';
import DappView from '@src/screens/DappView';
import { CustomError, ErrorCode, ExHandler } from '@src/services/exception';
import Icons from 'react-native-vector-icons/Ionicons';
import styles from './style';


class Dapps extends PureComponent {
  constructor() {
    super();
    this.state = {
      url: 'http://192.168.1.57:8080',
      openDapp: false,
    };
  }

  urlValidator = (url) => {
    if (!url) throw new CustomError(ErrorCode.daaps_invalid_daap_url);
    return true;
  }

  onGo = () => {
    try {
      const { url } = this.state;
      if (this.urlValidator(url)) {
        this.setState({ openDapp:  true });
      }
    } catch (e) {
      new ExHandler(e, 'Sorry, we can not open this Dapp.').showErrorToast();
    }
  }

  onChangeUrl = url => {
    this.setState({ url });
  }

  closeDapp = () => {
    this.setState({ openDapp: false });
  }

  render() {
    const { url, openDapp } = this.state;

    if (openDapp) {
      return (
        <DappView url={url} onCloseDapp={this.closeDapp} />
      );
    }

    return (
      <Container style={styles.container}>
        <View style={styles.form}>
          <TextInput placeholder='Dapp URL (https://game-url.com)' style={styles.input} value={url} onChangeText={this.onChangeUrl} />
          <Button title='Go' style={styles.submitBtn} onPress={this.onGo} />
        </View>
      </Container>
    );
  }
}

export default Dapps;