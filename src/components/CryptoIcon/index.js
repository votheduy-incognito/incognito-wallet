import { Image, View } from '@src/components/core';
import defaultTokenIcon from '@src/assets/images/icons/default_token_icon.png';
import PropTypes from 'prop-types';
import React, { Component } from 'react';
import { selectedPrivacySeleclor } from '@src/redux/selectors';
import Icons from 'react-native-vector-icons/MaterialCommunityIcons';
import { connect } from 'react-redux';
import styleSheet from './style';

const getVerifiedFlagStyle = (size) => {
  const verifiedFlagSize = Math.round(size * 0.5);
  const verifiedFlagStyle = {
    borderRadius: Math.round(verifiedFlagSize * 0.5),
    bottom: -Math.round(verifiedFlagSize * 0.25),
    right: -Math.round(verifiedFlagSize * 0.25),
    width: verifiedFlagSize + 1,
    height: verifiedFlagSize + 1
  };

  return [verifiedFlagSize, verifiedFlagStyle];
};

class CryptoIcon extends Component {
  constructor(props) {
    super(props);
    this.state = {
      uri: null,
      imageComponent: null,
      verifiedFlagStyle: null,
      verifiedFlagSize: null
    };
  }

  static getDerivedStateFromProps(nextProps) {
    const { size } = nextProps;

    const [verifiedFlagSize, verifiedFlagStyle] = getVerifiedFlagStyle(size);

    return {
      verifiedFlagStyle,
      verifiedFlagSize
    };
  }

  componentDidMount() {
    const { tokenId, onlyDefault, uri } = this.props;

    tokenId && !onlyDefault && this.getUri(uri);
  }

  componentDidUpdate(prevProps) {
    const { onlyDefault, uri } = this.props;
    const { onlyDefault: oldOnlyDefault, uri: oldUri } = prevProps;

    if (onlyDefault !== oldOnlyDefault || uri !== oldUri) {
      this.getUri(uri);
    }
  }

  getSize = () => {
    const { size } = this.props;

    return { width: Number(size), height: Number(size) };
  }

  getUri = async (defaultUri) => {
    const { token, logoStyle } = this.props;
    const _uri = defaultUri || token?.iconUrl;

    this.setState(({ uri }) => uri !== _uri && ({ uri: _uri, imageComponent: (
      <Image
        style={[styleSheet.logo, logoStyle, this.getSize()]}
        source={{ uri: `${_uri}?t=${new Date().getDate()}.${new Date().getHours()}` }}
        onError={this.onLoadError}
        onLoadStart={this.onLoadStart}
        onLoadEnd={this.onLoadEnd}
      />
    ) }));
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
    const { uri, imageComponent, verifiedFlagStyle, verifiedFlagSize } = this.state;
    const { onlyDefault, containerStyle, logoStyle, size, token, showVerifyFlag } = this.props;
    const { isVerified } = token || {};

    return (
      <View>
        <View style={[styleSheet.container, containerStyle, { borderRadius: size }, this.getSize()]}>
          {
            onlyDefault || !uri
              ? this.renderDefault(logoStyle)
              : imageComponent
          }
        </View>
        { showVerifyFlag && isVerified && (
          <View style={[styleSheet.verifiedFlagContainer, verifiedFlagStyle]}>
            <Icons style={[styleSheet.verifiedFlag]} name='check-circle' size={verifiedFlagSize} />
          </View>
        ) }
      </View>
    );
  }
}

CryptoIcon.defaultProps = {
  onlyDefault: false,
  tokenId: null,
  containerStyle: null,
  logoStyle: null,
  size: 40,
  token: null,
  showVerifyFlag: false,
  uri: null,
};

CryptoIcon.propTypes = {
  tokenId: PropTypes.string,
  onlyDefault: PropTypes.bool,
  containerStyle: PropTypes.object,
  logoStyle: PropTypes.object,
  token: PropTypes.object,
  size: PropTypes.number,
  showVerifyFlag: PropTypes.bool,
  uri: PropTypes.string,
};


const mapState = (state, props) => ({
  token: props?.tokenId && selectedPrivacySeleclor.getPrivacyDataByTokenID(state)(props?.tokenId)
});

export default connect(mapState)(CryptoIcon);
