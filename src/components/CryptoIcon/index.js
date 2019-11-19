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

  getUri = async ({ tokenId }) => {
    const { getIconUrlFromTokenId } = this.props;
    let uri;
    if (tokenId) {
      uri = getIconUrlFromTokenId(tokenId);
    } 

    this.setState({ uri, imageComponent: (
      <Image
        style={styleSheet.logo}
        source={{ uri }}
        onError={this.onLoadError}
        onLoadStart={this.onLoadStart}
        onLoadEnd={this.onLoadEnd}
      />
    ) });
  };

  onLoadError = () => {
    this.setState({ uri: '' });
  };

  renderDefault = () => (
    <Image
      style={styleSheet.logo}
      source={defaultTokenIcon}
    />
  );

  render() {
    const { uri, imageComponent } = this.state;
    const { onlyDefault } = this.props;

    return (
      <View style={styleSheet.container}>
        {
          onlyDefault || !uri
            ? this.renderDefault()
            : imageComponent
        }
      </View>
    );
  }
}

CryptoIcon.defaultProps = {
  onlyDefault: false,
  tokenId: null
};

CryptoIcon.propTypes = {
  tokenId: PropTypes.string,
  onlyDefault: PropTypes.bool,
  getIconUrlFromTokenId: PropTypes.func.isRequired
};


const mapState = state => ({
  getIconUrlFromTokenId: tokenSeleclor.getIconUrlFromTokenId(state)
});

export default connect(mapState)(CryptoIcon);