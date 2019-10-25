import React, { PureComponent } from 'react';
import {  View, Text, WebView, Button, TouchableOpacity, Modal } from '@src/components/core';
import Icons from 'react-native-vector-icons/Ionicons';
import convertUtil from '@src/utils/convert';
import { ExHandler } from '@src/services/exception';
import { COLORS } from '@src/styles';
import RequestSendTx from './RequestSendTx';
import { APPSDK, ERRORSDK, CONSTANTSDK } from './sdk';
import styles from './style';

let sdk : APPSDK = null;

const updateDataToDapp = (data) => {
  if (!sdk) return;

  const { selectedPrivacy, listSupportedToken } = data;
  const balance = selectedPrivacy?.amount && convertUtil.toHumanAmount(selectedPrivacy?.amount, selectedPrivacy.pDecimals);
  const paymentAddress = selectedPrivacy?.paymentAddress;

  paymentAddress && sdk.sendUpdatePaymentAddress(paymentAddress);
  balance >= 0 && sdk.sendUpdateBalance(selectedPrivacy?.amount);
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

  onRequestSendTx = ({ toAddress, amount, pendingTxId }) => {
    const { selectedPrivacy } = this.props;
    this.setState({
      modalData: (
        <RequestSendTx
          toAddress={toAddress}
          amount={amount}
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
            sdk?.sendUpdateTxPendingResult({ pendingTxId, error: ERRORSDK.createError('send_tx_error', e?.message) });
            this.closeModal();
          }}
        />
      )
    });
  }

  onSdkSelectPrivacyById = tokenID => {
    if (!tokenID) throw new Error('Can not change to invalid tokenID');
    
    const { onSelectPrivacyToken } = this.props;
    onSelectPrivacyToken(tokenID);
  }

  onWebViewData = async (e) => {
    try {
      const payload = e.nativeEvent.data;
      const [ command, data ] = payload?.split('|');
      const parsedData = JSON.parse(data);
      
      switch(command) {
      case CONSTANTSDK.COMMANDS.SEND_TX:
        this.onRequestSendTx(parsedData);
        break;
      case CONSTANTSDK.COMMANDS.SELECT_PRIVACY_TOKEN_BY_ID:
        this.onSdkSelectPrivacyById(parsedData?.tokenID);
      }
    } catch (e) {
      new ExHandler(e, 'Can not process Dapp request.').showErrorToast();
    }
  }

  onDappLoaded = () => {
    const { selectedPrivacy, listSupportedToken } = this.props;
    updateDataToDapp({ selectedPrivacy, listSupportedToken });
  }

  onLoadDappError = (e) => {
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
    return (
      <View style={styles.controlContainer}>
        <View style={styles.navigateGroup}>
          {this.renderControlButton({ name: 'ios-arrow-back', onPress: this.onGoBack, style: { marginRight: 20 } })}
          {this.renderControlButton({ name: 'ios-arrow-forward', onPress: this.onGoForward })}
          {this.renderControlButton({ name: 'ios-refresh', onPress: this.onReload })}
        </View>
        <Text style={styles.urlText} numberOfLines={1} ellipsizeMode="tail">{url}</Text>
        <View style={styles.btnGroup}>
          {this.renderControlButton({ name: 'ios-close', onPress: onCloseDapp, size: 60 })}
        </View>
      </View>
    );
  }

  render() {
    const { modalData } = this.state;
    const { account, selectedPrivacy, url } = this.props;
    return (
      <View style={styles.container}>
        {this.renderControlBar()}
        <WebView
          ref={webview => { sdk = webview && new APPSDK(webview); this.webviewInstance = webview; }}
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


export default DappView;