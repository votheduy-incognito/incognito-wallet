import React, { PureComponent } from 'react';
import PropTypes from 'prop-types';
import { Container, Button, View, ScrollView, TextInput, TouchableOpacity, RefreshControl } from '@src/components/core';
import { CustomError, ErrorCode, ExHandler } from '@src/services/exception';
import routeNames from '@src/router/routeNames';
import { COLORS } from '@src/styles';
import Icons from 'react-native-vector-icons/MaterialIcons';
import PappItem from './PappItem';
import styles from './style';

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
      const { title, link } = pApp;
      const _url = link || url;

      if (this.urlValidator(_url)) {
        const { navigation } = this.props;
        navigation.navigate(routeNames.pApp, { url: _url, appName: title ?? _url });
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
    const { papps, onReload, isGettingPapps } = this.props;

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
        <ScrollView
          contentContainerStyle={{ minHeight: '100%' }}
          refreshControl={(
            <RefreshControl
              refreshing={isGettingPapps}
              onRefresh={onReload}
            />
          )}
        >
          <Container style={styles.content}>
            {
              papps?.map(({ id, image1, shortDescription, link, title }) => (
                <PappItem
                  style={styles.pappItem}
                  key={id}
                  imageUrl={image1}
                  title={title}
                  desc={shortDescription}
                  url={link}
                  onPress={() => this.onGo({ id, link, title })}
                />
              ))
            }
          </Container>
        </ScrollView>
      </View>
    );
  }
}

Papps.defaultProps = {
  papps: []
};

Papps.propTypes = {
  navigation: PropTypes.object.isRequired,
  papps: PropTypes.arrayOf(PropTypes.object),
  onReload: PropTypes.func.isRequired,
  isGettingPapps: PropTypes.bool.isRequired
};

export default Papps;