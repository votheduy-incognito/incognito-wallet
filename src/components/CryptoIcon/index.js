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
    const { symbol, tokenId, onlyDefault } = this.props;

    !onlyDefault && this.getUri({ symbol, tokenId });
  }

  preFormat = data => {
    if (!data) return;

    return String(data).toLowerCase();
  };

  getUri = async ({ symbol, tokenId }) => {
    let uri;
    if (tokenId) {
      const formatedTokenId = this.preFormat(tokenId);
      uri =  formatedTokenId && `${CONSTANT_CONFIGS.INCOGNITO_TOKEN_ICON_URL}/${formatedTokenId}.png`;
    } else if (symbol) {
      const formatedSymbol = this.preFormat(symbol);
      uri =  formatedSymbol && `${CONSTANT_CONFIGS.CRYPTO_ICON_URL}/${formatedSymbol}@2x.png`;
    }

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

  renderDefault = () => (
    <Image
      style={this.getStyle(false)}
      source={defaultTokenIcon}
    />
  );

  getStyle = (isLoading) => {
    const styles = [styleSheet.logo];

    return Platform.OS === 'android' ? [...styles, isLoading && styleSheet.hidden] : styles;
  };

  render() {
    const { uri, isLoading } = this.state;
    const { onlyDefault } = this.props;

    return (
      <View style={styleSheet.container}>
        { isLoading && !onlyDefault && (
          <View style={styleSheet.loadingIcon}>
            <ActivityIndicator size="small" />
          </View>
        )
        }
        {
          onlyDefault || !uri
            ? this.renderDefault()
            : (
              <Image
                style={this.getStyle(isLoading)}
                source={{ uri }}
                onError={this.onLoadError}
                onLoadStart={this.onLoadStart}
                onLoadEnd={this.onLoadEnd}
              />
            )
        }
      </View>
    );
  }
}

CryptoIcon.defaultProps = {
  onlyDefault: false,
  symbol: null,
  tokenId: null
};

CryptoIcon.propTypes = {
  symbol: PropTypes.string,
  tokenId: PropTypes.string,
  onlyDefault: PropTypes.bool
};
