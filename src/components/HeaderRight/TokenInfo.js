import React, { Component } from 'react';
import PropTypes from 'prop-types';
import Icons from 'react-native-vector-icons/SimpleLineIcons';
import { COLORS } from '@src/styles';
import formatUtil from '@src/utils/format';
import CopiableText from '@src/components/CopiableText';
import {Icon} from 'react-native-elements';
import { getTokenInfo } from '@src/services/api/token';
import { ExHandler } from '@src/services/exception';
import { Text, View, Container, Modal, TouchableOpacity, Divider } from '../core';
import CryptoIcon from '../CryptoIcon';
import { tokenInfoStyle } from './style';
import SimpleInfo from '../SimpleInfo';

class TokenInfo extends Component {
  constructor() {
    super();

    this.state = {
      isShowInfo: false,
      copied: false,
      copiedLabel: null,
      incognitoInfo: null
    };
  }

  componentDidMount() {
    const { selectedPrivacy } = this.props;
    this.handleGetIncognitoTokenInfo(selectedPrivacy?.tokenId);
  }

  componentDidUpdate(prevProps) {
    const { selectedPrivacy } = this.props;
    const { selectedPrivacy: oldSelectedPrivacy } = prevProps;

    if (selectedPrivacy?.isIncognitoToken && (selectedPrivacy?.tokenId !== oldSelectedPrivacy?.tokenId)) {
      this.handleGetIncognitoTokenInfo(selectedPrivacy.tokenId);
    }
  }

  closeCopied = (label) => {
    this.setState({ copied: true, copiedLabel: label });
    clearTimeout(this.timeout);
    this.timeout = setTimeout(() => {
      this.setState({ copied: false });
    }, 1000);
  };

  handleGetIncognitoTokenInfo = async (tokenId) => {
    try {
      if (!tokenId) return;

      const info = await getTokenInfo({ tokenId });
      this.setState({ incognitoInfo: info });
      return info;
    } catch (e) {
      new ExHandler(e, 'Can not show the token information in detail right now.').showWarningToast();
    }
  }

  renderInfoItem = (label, value, { useDivider } = {}, copyable = false) => {
    if (value === undefined || value === null || value === '') return null;

    return (
      <>
        <View style={tokenInfoStyle.infoItem}>
          <Text numberOfLines={1} ellipsizeMode="middle" style={tokenInfoStyle.infoItemLabel}>{label}</Text>
          {copyable ? (
            <CopiableText
              text={value}
              style={[tokenInfoStyle.infoItemValue, tokenInfoStyle.row]}
              onPress={() => this.closeCopied(label)}
            >
              <Text numberOfLines={1} ellipsizeMode="middle" style={tokenInfoStyle.infoItemValue}>
                {value}
              </Text>
              <View style={tokenInfoStyle.rightBlock}>
                <Icon name="copy" type="font-awesome" size={18} />
              </View>
            </CopiableText>
          )
            :
            <Text numberOfLines={1} ellipsizeMode="middle" style={tokenInfoStyle.infoItemValue}>{value}</Text>
          }
        </View>
        { useDivider && <Divider color={COLORS.lightGrey5} /> }
      </>
    );
  };

  renderInfo = () => {
    const { selectedPrivacy } = this.props;
    const { copied, copiedLabel, incognitoInfo } = this.state;

    if (!selectedPrivacy) {
      return <SimpleInfo text='There has nothing to display' />;
    }

    const { name, symbol, externalSymbol, tokenId, contractId, amount, pDecimals, incognitoTotalSupply } = selectedPrivacy;

    const infos = [
      { label: 'Name', value: name },
      { label: 'Symbol', value: symbol },
      { label: 'Original Symbol', value: externalSymbol },
      { label: 'Coin supply', value: incognitoTotalSupply ? formatUtil.amount(incognitoTotalSupply, pDecimals) : undefined },
      { label: 'Balance', value: formatUtil.amount(amount, pDecimals) },
      { label: 'Coin ID', value: tokenId, copyable: true },
      { label: 'Contract ID', value: contractId, copyable: true  },
      { label: 'Owner address', value: incognitoInfo?.showOwnerAddress ? incognitoInfo?.ownerAddress : undefined, copyable: true  },
      { label: 'Description', value: incognitoInfo?.description },
    ].filter(i => ![undefined, null, ''].includes(i.value));

    return (
      <Container style={tokenInfoStyle.infoContainer}>
        <View style={tokenInfoStyle.header}>
          <CryptoIcon tokenId={tokenId} />
          <View style={tokenInfoStyle.headerTextContainer}>
            <Text numberOfLines={1} ellipsizeMode="middle" style={tokenInfoStyle.headerText}>{selectedPrivacy?.name}</Text>
            <Text numberOfLines={1} ellipsizeMode="middle" style={tokenInfoStyle.headerSubText}>{selectedPrivacy?.networkName}</Text>
          </View>
        </View>
        <View style={tokenInfoStyle.infoItems}>
          {
            infos.map((info, index) => this.renderInfoItem(info.label, info.value, { useDivider: (index < infos.length - 1) }, info.copyable))
          }
        </View>
        {!!copied &&
        (
          <View style={tokenInfoStyle.copied}>
            <Text style={tokenInfoStyle.copiedMessage}>{copiedLabel} was copied</Text>
          </View>
        )}
      </Container>
    );
  };

  handleToggle = () => {
    this.setState(({ isShowInfo }) => ({ isShowInfo: !isShowInfo }));
  }

  render() {
    const { isShowInfo } = this.state;
    const { iconColor } = this.props;

    return (
      <View style={tokenInfoStyle.container}>
        <TouchableOpacity onPress={this.handleToggle}>
          <Icons name='info' style={tokenInfoStyle.icon} size={24} color={iconColor} />
        </TouchableOpacity>
        <Modal visible={isShowInfo} close={this.handleToggle} containerStyle={tokenInfoStyle.modalContainer} closeBtnColor={COLORS.primary} headerText='Coin info'>
          {this.renderInfo()}
        </Modal>
      </View>
    );
  }
}

TokenInfo.defaultProps = {
  iconColor: COLORS.black
};

TokenInfo.propTypes = {
  selectedPrivacy: PropTypes.object.isRequired,
  iconColor: PropTypes.string,
};

export default TokenInfo;
