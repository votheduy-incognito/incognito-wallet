import { ActivityIndicator, Image, View } from '@src/components/core';
import { CONSTANT_CONFIGS } from '@src/constants';
import { COLORS } from '@src/styles';
import PropTypes from 'prop-types';
import React, { Component } from 'react';
import { Platform } from 'react-native';
import { Icon } from 'react-native-elements';
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
  }

  getUri = async symbol => {
    const formatedSymbol = this.preFormatSymbol(symbol);
    const uri =  formatedSymbol && `${CONSTANT_CONFIGS.CRYPTO_ICON_URL}/${formatedSymbol}@2x.png`;
    this.setState({ uri });
  }

  onLoadError = () => {
    this.setState({ uri: null, isLoading: false });
  }

  onLoadStart = () => {
    this.setState({ isLoading: true });
  }

  onLoadEnd = () => {
    this.setState({ isLoading: false });
  }

  renderDefault = () => <Icon type='material-community' name='circle' size={28} color={COLORS.primary} />

  getStyle = (isLoading) => {
    const styles = [styleSheet.logo];

    return Platform.OS === 'android' ? [...styles, isLoading && styleSheet.hidden] : styles;
  }

  render() {
    const { uri, isLoading } = this.state;

    return (
      <View style={styleSheet.container}>
        { isLoading && <ActivityIndicator /> }
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