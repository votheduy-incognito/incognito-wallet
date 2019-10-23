import React, { PureComponent } from 'react';
import {  View, Text, WebView, Button } from '@src/components/core';

const log = (...args) => console.log('DAPPS', ...args);

const URL = 'http://192.168.1.57:8080';
let webviewInstance;

function sendScript(script) {
  webviewInstance?.injectJavaScript(script);
}

function sendUpdateBalance(balance) {
  const script = `
      incognitoWallet._setData("balance", ${balance});
      true;
    `;
  sendScript(script);
}

function sendUpdatePaymentAddress(address) {
  const script = `
      incognitoWallet._setData("payment_andress", "${address}");
      true;
    `;
  sendScript(script);
}

function sendUpdateTxPendingResult(data) {
  const script = `
      incognitoWallet._setData("tx_pending_result", ${JSON.stringify(data)});
      true;
    `;
  sendScript(script);
}

export default class index extends PureComponent {
  constructor(props) {
    super(props);
    this.state = {
    };
  }

  static getDerivedStateFromProps(nextProps, prevState) {
    const { account } = nextProps;
    sendUpdateBalance(account?.value);
  }

  componentDidMount() {
    // setInterval(() => sendUpdateBalance(Date.now()), 1000);
  }

  testScript = () => {
    sendScript(`
      throw new Error(1);
      true;
    `);
  }

  onWebViewData = async (e) => {
    const { handleSendTx } = this.props;
    const payload = e.nativeEvent.data;
    const [ command, data ] = payload?.split('|');
    const parsedData = JSON.parse(data);
    const { toAddress, amount } = parsedData;
    
    switch(command) {
    case 'send_tx':
      handleSendTx(toAddress, amount)
        .then(rs => {
          sendUpdateTxPendingResult({ pendingTxId: parsedData.pendingTxId, data: rs });
        })
        .catch(e => {
          sendUpdateTxPendingResult({ pendingTxId: parsedData.pendingTxId, error: e });
        });
      break;
    }
  }
  
  render() {
    const { account } = this.props;

    return (
      <View>
        <WebView
          ref={webview => webviewInstance = webview}
          containerStyle={{
            width: '100%',
            height: 700,
            flex: 0
          }}
          source={{ uri: URL }}
          allowsBackForwardNavigationGestures
          cacheEnabled={false}
          cacheMode='LOAD_NO_CACHE'
          onError={(e) => alert('error')}
          onLoadEnd={() => {
            sendUpdateBalance(account?.value);
            sendUpdatePaymentAddress(account?.PaymentAddress);
          }}
          onMessage={this.onWebViewData}
        />
        <Button
          title='Reload'
          onPress={() => {
            webviewInstance?.reload();
          }}
        />

        <Button
          title='Test script'
          onPress={this.testScript}
        />
        <Text>{account?.PaymentAddress}</Text>
        <Text>{account?.value}</Text>
      </View>
    );
  }
}
