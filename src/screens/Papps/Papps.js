import React, { PureComponent } from 'react';
import PropTypes from 'prop-types';
import { Container, TextInput, Button, View } from '@src/components/core';
import { CustomError, ErrorCode, ExHandler } from '@src/services/exception';
import routeNames from '@src/router/routeNames';
import styles from './style';

class Papps extends PureComponent {
  constructor() {
    super();
    this.state = {
      url: 'http://192.168.0.124:9000',
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
        const { navigation } = this.props;
        navigation.navigate(routeNames.pApp, { url, appName: 'Gsasd sdd' });
      }
    } catch (e) {
      new ExHandler(e, 'Sorry, we can not open this Papp.').showErrorToast();
    }
  }

  onChangeUrl = url => {
    this.setState({ url });
  }

  render() {
    const { url } = this.state;

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

Papps.propTypes = {
  navigation: PropTypes.object.isRequired
};

export default Papps;