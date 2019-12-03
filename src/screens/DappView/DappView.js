import React, { PureComponent } from 'react';
import PropTypes from 'prop-types';
import {  View, Text, WebView, TouchableOpacity, Modal } from '@src/components/core';
import Icons from 'react-native-vector-icons/Ionicons';
import convertUtil from '@src/utils/convert';
import { ExHandler } from '@src/services/exception';
import { COLORS } from '@src/styles';
import Validator from './sdk/validator';
import RequestSendTx from './RequestSendTx';
import { APPSDK, ERRORSDK, CONSTANTSDK } from './sdk';
import styles from './style';

let sdk : APPSDK= null;

const updateDataToDapp = (data) => {
  if (!sdk) return;

  const { selectedPrivacy, listSupportedToken } = data;
  const balance = selectedPrivacy?.amount && convertUtil.toHumanAmount(selectedPrivacy?.amount, selectedPrivacy.pDecimals);
  const paymentAddress = selectedPrivacy?.paymentAddress;

  paymentAddress && sdk.sendUpdatePaymentAddress(paymentAddress);
  selectedPrivacy && sdk.sendUpdateTokenInfo({
    balance,
    id: selectedPrivacy?.tokenId,
    symbol: selectedPrivacy?.symbol,
    name: selectedPrivacy?.name,
    nanoBalance: selectedPrivacy?.amount,
    pDecimals: selectedPrivacy?.pDecimals
  });
  listSupportedToken && sdk.sendListToken(listSupportedToken);
};

class DappView extends PureComponent {
  constructor(props) {
    super(props);
    this.state = {
      modalData: null,
    };
    
    this.webviewInstance = null;
  }

  static getDerivedStateFromProps(nextProps) {
    const { selectedPrivacy, listSupportedToken } = nextProps;
    updateDataToDapp({ selectedPrivacy, listSupportedToken });

    return null;
  }

  closeModal = () => {
    this.setState({ modalData: null });
  }

  onRequestSendTx = ({ toAddress, amount, pendingTxId, info } = {}) => {
    new Validator('onRequestSendTx toAddress', toAddress).required().paymentAddress();
    new Validator('onRequestSendTx amount', amount).required().amount();
    new Validator('onRequestSendTx pendingTxId', pendingTxId).required().string();
    new Validator('onRequestSendTx info', info).string();

    const { selectedPrivacy, url } = this.props;
    this.setState({
      modalData: (
        <RequestSendTx
          url={url}
          toAddress={toAddress}
          amount={amount}
          info={info}
          pendingTxId={pendingTxId}
          selectedPrivacy={selectedPrivacy}
          onCancel={() => {
            sdk?.sendUpdateTxPendingResult({ pendingTxId, error: ERRORSDK.user_cancel_send_tx });
            this.closeModal();
          }}
          onSendSuccess={rs => {
            sdk?.sendUpdateTxPendingResult({ pendingTxId, data: rs });
            this.closeModal();
          }}
          onSendFailed={e => {
            sdk?.sendUpdateTxPendingResult({ pendingTxId, error: ERRORSDK.createError(ERRORSDK.ERROR_CODE.SEND_TX_ERROR, e?.message) });
            this.closeModal();
          }}
        />
      )
    });
  }

  onSdkSelectPrivacyById = tokenID => {
    new Validator('onSdkSelectPrivacyById tokenID', tokenID).required().string();
    
    const { onSelectPrivacyToken } = this.props;
    onSelectPrivacyToken(tokenID);
  }

  onWebViewData = async (e) => {
    try {
      const payload = e.nativeEvent.data;
      new Validator('onWebViewData payload', payload).required().string();

      const [ command, data ] = payload?.split('|');
      new Validator('onWebViewData command', command).required().string();
      new Validator('onWebViewData data', data).string();

      const parsedData = JSON.parse(data);
      
      switch(command) {
      case CONSTANTSDK.COMMANDS.SEND_TX:
        this.onRequestSendTx(parsedData);
        break;
      case CONSTANTSDK.COMMANDS.SELECT_PRIVACY_TOKEN_BY_ID:
        this.onSdkSelectPrivacyById(parsedData?.tokenID);
      }
    } catch (e) {
      new ExHandler(e, 'The pApp occured an error. Please try again.').showErrorToast();
    }
  }

  onDappLoaded = () => {
    const { selectedPrivacy, listSupportedToken } = this.props;
    updateDataToDapp({ selectedPrivacy, listSupportedToken });
  }

  onLoadDappError = () => {
    alert('This Daap can not be opened!');
  }

  renderControlButton = ({ onPress, name, size = 25, style }) => {
    return (
      <TouchableOpacity onPress={onPress} style={styles.controlBtn}>
        <Icons
          name={name}
          size={size}
          color={COLORS.lightGrey3}
          style={style}
        />
      </TouchableOpacity>
    );
  }

  onGoBack = () => {
    this.webviewInstance?.goBack();
  }

  onGoForward = () => {
    this.webviewInstance?.goForward();
  }

  onReload = () => {
    this.webviewInstance?.reload();
  }

  renderControlBar = () => {
    const { url, onCloseDapp } = this.props;
    const onClose = () => {
      this.webviewInstance = null;
      sdk = null;
      onCloseDapp();
    };
    return (
      <View style={styles.controlContainer}>
        <View style={styles.navigateGroup}>
          {this.renderControlButton({ name: 'ios-arrow-back', onPress: this.onGoBack, style: { marginRight: 20 } })}
          {this.renderControlButton({ name: 'ios-arrow-forward', onPress: this.onGoForward })}
          {this.renderControlButton({ name: 'ios-refresh', onPress: this.onReload })}
        </View>
        <Text style={styles.urlText} numberOfLines={1} ellipsizeMode="tail">{url}</Text>
        <View style={styles.btnGroup}>
          {this.renderControlButton({ name: 'ios-close', onPress: onClose, size: 60 })}
        </View>
      </View>
    );
  }

  render() {
    const { modalData } = this.state;
    const {  url } = this.props;
    return (
      <View style={styles.container}>
        {this.renderControlBar()}
        <WebView
          ref={webview => {
            if (webview) {
              sdk = new APPSDK(webview);
              this.webviewInstance = webview;
            }
          }}
          containerStyle={styles.webview}
          source={{ uri: url }}
          allowsBackForwardNavigationGestures
          cacheEnabled={false}
          cacheMode='LOAD_NO_CACHE'
          onError={this.onLoadDappError}
          onLoadEnd={this.onDappLoaded}
          onMessage={this.onWebViewData}
        />
        <Modal visible={!!modalData}>
          { modalData }
        </Modal>
      </View>
    );
  }
}

DappView.propTypes = {
  selectedPrivacy: PropTypes.object.isRequired,
  url: PropTypes.object.isRequired,
  onCloseDapp: PropTypes.func.isRequired,
  onSelectPrivacyToken: PropTypes.func.isRequired,
  listSupportedToken: PropTypes.arrayOf(PropTypes.object).isRequired,
};

export default DappView;