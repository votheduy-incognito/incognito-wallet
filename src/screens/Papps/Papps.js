import React, { PureComponent } from 'react';
import PropTypes from 'prop-types';
import { Container, Button, View, ScrollView, TextInput, TouchableOpacity } from '@src/components/core';
import { CustomError, ErrorCode, ExHandler } from '@src/services/exception';
import routeNames from '@src/router/routeNames';
import { COLORS } from '@src/styles';
// import rollDiceImg from '@src/assets/images/papp/diceroll.png';
import Icons from 'react-native-vector-icons/MaterialIcons';
import helloWorldImg from '@src/assets/images/papp/helloworld.png';
import PappItem from './PappItem';
import styles from './style';

const PAPPS = [
  {
    id: 1,
    name: 'Hello World',
    image: helloWorldImg,
    url: 'http://35.185.237.133/',
    title: 'Hello World',
    desc: 'This is a demonstration of a basic pApp'
  },
  // {
  //   id: 1,
  //   name: 'Get crypto rich',
  //   image: rollDiceImg,
  //   url: 'https://enigmatic-sea-09447.herokuapp.com/',
  //   title: 'Get crypto rich',
  //   desc: 'Predict the outcome,  shake the dice, win the crypto.'
  // }
];

class Papps extends PureComponent {
  constructor() {
    super();
    this.state = {
      url: '',
    };
  }

  urlValidator = (url) => {
    // eslint-disable-next-line
    if (!url) throw new CustomError(ErrorCode.paaps_invalid_daap_url);
    return true;
  }

  onGo = (pApp = {}) => {
    try {
      const { url } = this.state;
      const { name, url: pappUrl } = pApp;
      const _url = pappUrl || url;

      if (this.urlValidator(_url)) {
        const { navigation } = this.props;
        navigation.navigate(routeNames.pApp, { url: _url, appName: name ?? _url });
      }
    } catch (e) {
      new ExHandler(e, 'Sorry, we can not open this Papp.').showErrorToast();
    }
  }

  onChangeUrl = url => {
    this.setState({ url }); 
  }

  handleAddProtocol = () => {
    this.setState(({ url }) => {
      return { url: url ? url : 'http://' };
    }); 
  }

  onSubmitted = (/* pappInfo */) => {
    const { navigation } = this.props;
    navigation?.pop();
  }

  hanldeSubmitApp = () => {
    const { navigation } = this.props;
    navigation?.navigate(routeNames.PappSubmit, { onSubmitted: this.onSubmitted }); 
  }

  render() {
    const { url } = this.state;

    return (
      <View style={styles.container}>
        <View style={styles.form}>
          <TextInput
            autoCapitalize='none'
            placeholder='Search or enter website URL'
            placeholderTextColor={COLORS.lightGrey4}
            style={styles.input}
            inputStyle={{ color: COLORS.white, paddingLeft: 10, }}
            containerStyle={{ borderBottomWidth: 0 }}
            value={url}
            onChangeText={this.onChangeUrl}
            onFocus={this.handleAddProtocol}
            onSubmitEditing={this.onGo}
            prependView={(
              <TouchableOpacity style={styles.goBtn} onPress={this.onGo}>
                <Icons name='search' color={COLORS.white} size={30} />
              </TouchableOpacity>
            )}
          />
          <Button style={styles.submitBtn} onPress={this.hanldeSubmitApp}>
            <Icons name='add' color={COLORS.white} size={30} />
          </Button>
        </View>
        <ScrollView contentContainerStyle={{ minHeight: '100%' }}>
          <Container style={styles.content}>
            {
              PAPPS.map(({ id, image, desc, name, url, title }) => (
                <PappItem
                  style={styles.pappItem}
                  key={id}
                  image={image}
                  title={title}
                  desc={desc}
                  url={url}
                  name={name}
                  onPress={() => this.onGo({ id, image, desc, name, url, title })}
                />
              ))
            }
          </Container>
        </ScrollView>
      </View>
    );
  }
}

Papps.propTypes = {
  navigation: PropTypes.object.isRequired
};

export default Papps;