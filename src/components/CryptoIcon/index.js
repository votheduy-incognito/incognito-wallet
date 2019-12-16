import { Image, View } from '@src/components/core';
import defaultTokenIcon from '@src/assets/images/icons/default_token_icon.png';
import PropTypes from 'prop-types';
import React, { Component } from 'react';
import { tokenSeleclor } from '@src/redux/selectors';
import { connect } from 'react-redux';
import styleSheet from './style';

class CryptoIcon extends Component {
  constructor(props) {
    super(props);
    this.state = {
      uri: null,
      imageComponent: null,
    };
  }

  componentDidMount() {
    const { tokenId, onlyDefault } = this.props;

    tokenId && !onlyDefault && this.getUri({ tokenId });
  }

  componentDidUpdate(prevProps) {
    const { tokenId, onlyDefault } = this.props;
    const { tokenId: oldTokenId, onlyDefault: oldOnlyDefault } = prevProps;

    if (tokenId !== oldTokenId || onlyDefault !== oldOnlyDefault) {
      this.getUri({ tokenId });
    }
  }

  getSize = () => {
    const { size } = this.props;

    return { width: Number(size), height: Number(size) };
  }

  getUri = async ({ tokenId }) => {
    const { getIconUrlFromTokenId, logoStyle } = this.props;
    let uri;
    if (tokenId) {
      uri = getIconUrlFromTokenId(tokenId);
    }

    this.setState({ uri, imageComponent: (
      <Image
        style={[styleSheet.logo, logoStyle, this.getSize()]}
        source={{ uri: `${uri}?t=${new Date().getHours()}` }}
        onError={this.onLoadError}
        onLoadStart={this.onLoadStart}
        onLoadEnd={this.onLoadEnd}
      />
    ) });
  };

  onLoadError = () => {
    this.setState({ uri: '' });
  };

  renderDefault = (logoStyle) => (
    <Image
      style={[styleSheet.logo, logoStyle, this.getSize()]}
      source={defaultTokenIcon}
    />
  );

  render() {
    const { uri, imageComponent } = this.state;
    const { onlyDefault, containerStyle, logoStyle } = this.props;

    return (
      <View style={[styleSheet.container, containerStyle, this.getSize()]}>
        {
          onlyDefault || !uri
            ? this.renderDefault(logoStyle)
            : imageComponent
        }
      </View>
    );
  }
}

CryptoIcon.defaultProps = {
  onlyDefault: false,
  tokenId: null,
  containerStyle: null,
  logoStyle: null,
  size: 35
};

CryptoIcon.propTypes = {
  tokenId: PropTypes.string,
  onlyDefault: PropTypes.bool,
  getIconUrlFromTokenId: PropTypes.func.isRequired,
  containerStyle: PropTypes.object,
  logoStyle: PropTypes.object,
  size: PropTypes.number,
};


const mapState = state => ({
  getIconUrlFromTokenId: tokenSeleclor.getIconUrlFromTokenId(state)
});

export default connect(mapState)(CryptoIcon);
