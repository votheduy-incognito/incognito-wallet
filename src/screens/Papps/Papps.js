import React, { PureComponent } from 'react';
import { Container, TextInput, Button, View } from '@src/components/core';
import PappView from '@src/screens/PappView';
import { CustomError, ErrorCode, ExHandler } from '@src/services/exception';
import styles from './style';


class Papps extends PureComponent {
  constructor() {
    super();
    this.state = {
      url: 'http://192.168.0.124:9000',
      openPapp: false,
    };
  }

  urlValidator = (url) => {
    if (!url) throw new CustomError(ErrorCode.paaps_invalid_daap_url);
    return true;
  }

  onGo = () => {
    try {
      const { url } = this.state;
      if (this.urlValidator(url)) {
        this.setState({ openPapp:  true });
      }
    } catch (e) {
      new ExHandler(e, 'Sorry, we can not open this Papp.').showErrorToast();
    }
  }

  onChangeUrl = url => {
    this.setState({ url });
  }

  closePapp = () => {
    this.setState({ openPapp: false });
  }

  render() {
    const { url, openPapp } = this.state;

    if (openPapp) {
      return (
        <PappView url={url} onClosePapp={this.closePapp} />
      );
    }

    return (
      <Container style={styles.container}>
        <View style={styles.form}>
          <TextInput placeholder='Papp URL (https://game-url.com)' style={styles.input} value={url} onChangeText={this.onChangeUrl} />
          <Button title='Go' style={styles.submitBtn} onPress={this.onGo} />
        </View>
      </Container>
    );
  }
}

export default Papps;