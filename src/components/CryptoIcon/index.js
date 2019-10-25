import { ActivityIndicator, Image, View } from '@src/components/core';
import { CONSTANT_CONFIGS } from '@src/constants';
import defaultTokenIcon from '@src/assets/images/icons/default_token_icon.png';
import PropTypes from 'prop-types';
import React, { Component } from 'react';
import { Platform } from 'react-native';
import styleSheet from './style';

export default class CryptoIcon extends Component {
  constructor(props) {
    super(props);
    this.state = {
      uri: null,
      isLoading: true,
    };
  }

  componentDidMount() {
    const { symbol } = this.props;

    this.getUri(symbol);
  }

  preFormatSymbol = symbol => {
    if (!symbol) return;

    return String(symbol).toLowerCase();
  };

  getUri = async symbol => {
    const formatedSymbol = this.preFormatSymbol(symbol);
    const uri =  formatedSymbol && `${CONSTANT_CONFIGS.CRYPTO_ICON_URL}/${formatedSymbol}@2x.png`;
    this.setState({ uri });
  };

  onLoadError = () => {
    this.setState({ uri: '', isLoading: false });
  };

  onLoadStart = () => {
    this.setState({ isLoading: true });
  };

  onLoadEnd = () => {
    this.setState({ isLoading: false });
  };

  renderDefault = () => <Image
    style={this.getStyle(false)}
    source={defaultTokenIcon}
  />;

  getStyle = (isLoading) => {
    const styles = [styleSheet.logo];

    return Platform.OS === 'android' ? [...styles, isLoading && styleSheet.hidden] : styles;
  };

  render() {
    const { uri, isLoading } = this.state;

    return (
      <View style={styleSheet.container}>
        { isLoading &&
          <View style={styleSheet.loadingIcon}>
            <ActivityIndicator size="small" />
          </View>
        }
        {
          uri
            ? (
              <Image
                style={this.getStyle(isLoading)}
                source={{ uri }}
                onError={this.onLoadError}
                onLoadStart={this.onLoadStart}
                onLoadEnd={this.onLoadEnd}
              />
            )
            : this.renderDefault()
        }
      </View>
    );
  }
}

CryptoIcon.propTypes = {
  symbol: PropTypes.string.isRequired
};
