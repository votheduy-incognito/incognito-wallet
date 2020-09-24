import React from 'react';
import _ from 'lodash';
import { View, RoundCornerButton } from '@components/core';
import Loader from '@components/DialogLoader';
import routeNames from '@routers/routeNames';
import BaseScreen from '@screens/BaseScreen';
import { DEVICES } from '@src/constants/miner';
import Device from '@models/device';
import LocalDatabase from '@utils/LocalDatabase';
import InputQRField from '@components/core/reduxForm/fields/inputQR';
import NodeService from '@services/NodeService';
import { ExHandler } from '@services/exception';
import Header from '@src/components/Header';
import theme from '@src/styles/theme';
import styles from './style';

class LinkDevice extends BaseScreen {
  constructor(props) {
    super(props);
    this.state = {
      nodeInfo: null,
      loading: false,
    };

    this.handleGetNodeInfo = _.debounce(this.handleGetNodeInfo, 2000);
  }

  addNode = async () => {
    try {
      this.setState({ loading: true });
      const { nodeInfo } = this.state;
      const { qrCode, paymentAddress, productId, commission } = nodeInfo;
      const node = new Device({
        minerInfo: {
          qrCodeDeviceId: qrCode,
          PaymentAddress: paymentAddress,
          Commission: commission,
        },
        platform: 'MINER',
        linked: true,
        product_name: qrCode,
        product_id: productId,
        product_type: DEVICES.MINER_TYPE
      });
      let listDevice = await LocalDatabase.getListDevices();
      let isDuplicate = false;
      for (let i = 0; i < listDevice?.length; i++) {
        if (listDevice[i]?.minerInfo?.qrCodeDeviceId === qrCode) {
          isDuplicate = true;
          break;
        }
      }
      if (isDuplicate) {
        this.goToScreen(routeNames.Node);
      } else {
        const newListDevice = [node, ...listDevice];
        await LocalDatabase.saveListDevices(newListDevice);
        this.goToScreen(routeNames.Node);
      }
    } finally {
      this.setState({ loading: false });
    }
  };

  handleGetNodeInfo = async (qrCode) => {
    if (!qrCode) {
      return;
    }

    try {
      this.setState({ loading: true, qrCode });
      const nodeInfo = await NodeService.getInfoByQrCode(qrCode);
      this.setState({
        nodeInfo: {
          qrCode,
          productId: nodeInfo.ProductID,
          paymentAddress: nodeInfo.PaymentAddress,
          stakerAddress: nodeInfo.StakerAddress,
          validatorKey: nodeInfo.ValidatorKey,
          commission: nodeInfo.Commission,
        }
      });
    } catch (e) {
      new ExHandler(e).showErrorToast(true);
    } finally {
      this.setState({ loading: false });
    }
  };

  handleChangeQRCode = async (qrCode) => {
    this.setState({ qrCode });
    this.handleGetNodeInfo(qrCode);
  };

  render() {
    const { container } = styles;
    const { loading, nodeInfo, qrCode } = this.state;
    return (
      <View style={container}>
        <Loader loading={loading} />
        <Header
          title="Add existing Node"
        />
        <InputQRField
          input={{
            onChange: this.handleChangeQRCode
          }}
          label='QR Code'
          placeholder='Scan Node QR code'
          style={[styles.input]}
          inputStyle={styles.inputStyle}
          labelStyle={theme.text.BUTTON_TITLE}
          value={qrCode}
        />
        <RoundCornerButton
          onPress={this.addNode}
          disabled={!nodeInfo}
          title='Add'
          style={[theme.BUTTON.NODE_BUTTON]}
        />
      </View>
    );
  }
}

export default LinkDevice;
