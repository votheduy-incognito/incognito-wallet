import React, { Component } from 'react';
import PropTypes from 'prop-types';
import Icons from 'react-native-vector-icons/SimpleLineIcons';
import { COLORS } from '@src/styles';
import { Text, View, Container, Modal, TouchableOpacity, Divider } from '../core';
import CryptoIcon from '../CryptoIcon';
import { tokenInfoStyle } from './style';
import SimpleInfo from '../SimpleInfo';

class TokenInfo extends Component {
  constructor() {
    super();

    this.state = {
      isShowInfo: false
    };
  }

  renderInfoItem = (label, value, { useDivider } = {}) => {
    if (value === undefined || value === null || value === '') return null;

    return (
      <>
        <View style={tokenInfoStyle.infoItem}>
          <Text numberOfLines={1} ellipsizeMode="middle" style={tokenInfoStyle.infoItemLabel}>{label}</Text>
          <Text numberOfLines={1} ellipsizeMode="middle" style={tokenInfoStyle.infoItemValue}>{value}</Text>
        </View>
        { useDivider && <Divider color={COLORS.lightGrey5} /> }
      </>
    );
  }

  renderInfo = () => {
    const { selectedPrivacy } = this.props;

    if (!selectedPrivacy) {
      return <SimpleInfo text='There has nothing to display' />;
    }

    const { name, symbol, externalSymbol, incognitoTotalSupply, incognitoOwnerAddress, tokenId, contractId } = selectedPrivacy;

    const infos = [
      { label: 'Name', value: name },
      { label: 'Symbol', value: symbol },
      { label: 'Original Symbol', value: externalSymbol },
      { label: 'Token supply', value: incognitoTotalSupply },
      { label: 'Token ID', value: tokenId },
      { label: 'Contract ID', value: contractId },
      { label: 'Owner address', value: incognitoOwnerAddress },
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
            infos.map((info, index) => this.renderInfoItem(info.label, info.value, { useDivider: (index < infos.length - 1) }))
          }
        </View>
      </Container>
    );
  }

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
        <Modal visible={isShowInfo} close={this.handleToggle} containerStyle={tokenInfoStyle.modalContainer} closeBtnColor={COLORS.primary} headerText='Token info'>
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