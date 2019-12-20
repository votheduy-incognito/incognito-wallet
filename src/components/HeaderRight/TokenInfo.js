import React, { Component } from 'react';
import PropTypes from 'prop-types';
import Icons from 'react-native-vector-icons/SimpleLineIcons';
import { COLORS } from '@src/styles';
import formatUtil from '@src/utils/format';
import CopiableText from '@src/components/CopiableText';
import {Icon} from 'react-native-elements';
import { getTokenInfo } from '@src/services/api/token';
import { ExHandler } from '@src/services/exception';
import TokenInfoUpdate from '@src/components/TokenInfoUpdate';
import { Text, View, Container, Modal, TouchableOpacity, Divider, Button, ScrollView } from '../core';
import CryptoIcon from '../CryptoIcon';
import VerifiedText from '../VerifiedText';
import { tokenInfoStyle } from './style';
import SimpleInfo from '../SimpleInfo';

class TokenInfo extends Component {
  constructor() {
    super();

    this.state = {
      isShowInfo: false,
      copied: false,
      copiedLabel: null,
      incognitoInfo: null,
      showUpdateInfoView: false
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
      new ExHandler(e);
    }
  }

  handleUpdated = info => {
    if (info?.tokenID) {
      this.handleGetIncognitoTokenInfo(info.tokenID);
    }
  }

  handleCloseUpdateView = () => this.setState({ showUpdateInfoView: false })

  handleShowUpdateView = () => this.setState({ showUpdateInfoView: true })

  renderInfoItem = (label, value, { useDivider, copyable = false, multiline = false } = {}) => {
    if (value === undefined || value === null || value === '') return null;

    const renderValue = (v, multiline) => {
      if (multiline) {
        return <Text style={tokenInfoStyle.infoItemValue}>{value}</Text>;
      } else {
        return <Text numberOfLines={1} ellipsizeMode="middle" style={tokenInfoStyle.infoItemValue}>{value}</Text>;
      }
    };
    
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
              {renderValue(value, multiline)}
              <View style={tokenInfoStyle.rightBlock}>
                <Icon name="copy" type="font-awesome" size={18} />
              </View>
            </CopiableText>
          )
            :
            renderValue(value, multiline)
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

    const { name, symbol, externalSymbol, tokenId, contractId, amount, pDecimals, incognitoTotalSupply, isVerified } = selectedPrivacy;

    const infos = [
      { label: 'Name', value: name },
      { label: 'Symbol', value: symbol },
      { label: 'Original Symbol', value: externalSymbol },
      { label: 'Coin supply', value: incognitoTotalSupply ? formatUtil.amount(incognitoTotalSupply, pDecimals) : undefined },
      { label: 'Balance', value: formatUtil.amount(amount, pDecimals) },
      { label: 'Coin ID', value: tokenId, copyable: true },
      { label: 'Contract ID', value: contractId, copyable: true  },
      { label: 'Owner address', value: incognitoInfo?.showOwnerAddress ? incognitoInfo?.ownerAddress : undefined, copyable: true  },
    ].filter(i => ![undefined, null, ''].includes(i.value));

    return (
      <View style={tokenInfoStyle.infoContainer}>
        <View style={tokenInfoStyle.header}>
          <View style={tokenInfoStyle.iconContainer}>
            <CryptoIcon size={70} tokenId={tokenId} />
          </View>
          <View style={tokenInfoStyle.headerTextContainer}>
            <VerifiedText
              text={`${selectedPrivacy?.symbol} ${!selectedPrivacy?.isPrivateCoin ? selectedPrivacy?.networkName : ''}`} 
              numberOfLines={1} 
              ellipsizeMode="middle"
              style={tokenInfoStyle.headerText}
              isVerified={isVerified}
            />
            <Text numberOfLines={1} ellipsizeMode="middle" style={tokenInfoStyle.headerSubText}>{selectedPrivacy?.displayName}</Text>
          </View>
        </View>
        <ScrollView>
          <Container>
            {
              incognitoInfo?.description && (
                <View style={tokenInfoStyle.descContainer}>
                  <Text>{incognitoInfo?.description}</Text>
                </View>
              )
            }
            <View style={tokenInfoStyle.infoItems}>
              {
                infos.map((info, index) => this.renderInfoItem(info.label, info.value, { useDivider: (index < infos.length - 1), copyable: info.copyable, multiline: info.multiline },))
              }
            </View>
            {!!copied &&
            (
              <View style={tokenInfoStyle.copied}>
                <Text style={tokenInfoStyle.copiedMessage}>{copiedLabel} was copied</Text>
              </View>
            )}
            {
              incognitoInfo?.isOwner && (
                <View style={tokenInfoStyle.updateBtnContainer}>
                  <Button title='Update' style={tokenInfoStyle.updateBtn} titleStyle={tokenInfoStyle.updateBtnText} onPress={this.handleShowUpdateView} />
                </View>
              )
            }
          </Container>
        </ScrollView>
      </View>
    );
  };

  handleToggle = () => {
    this.setState(({ isShowInfo }) => {
      const newState = !isShowInfo;

      if (newState === false) {
        this.handleCloseUpdateView();
      }

      return { isShowInfo: newState };
    });
  }

  render() {
    const { isShowInfo, incognitoInfo, showUpdateInfoView } = this.state;
    const { iconColor } = this.props;

    return (
      <View style={tokenInfoStyle.container}>
        <TouchableOpacity onPress={this.handleToggle}>
          <Icons name='info' style={tokenInfoStyle.icon} size={24} color={iconColor} />
        </TouchableOpacity>
        <Modal visible={isShowInfo} close={this.handleToggle} containerStyle={tokenInfoStyle.modalContainer} closeBtnColor={COLORS.primary} headerText='Coin info'>
          { showUpdateInfoView
            ? incognitoInfo && <TokenInfoUpdate incognitoInfo={incognitoInfo} onUpdated={this.handleUpdated} onClose={this.handleCloseUpdateView} />
            : this.renderInfo()
          }
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
