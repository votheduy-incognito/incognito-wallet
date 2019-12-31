import React from 'react';
import { Button, TextInput, View } from '@components/core';
import Loader from '@components/DialogLoader';
import routeNames from '@routers/routeNames';
import BaseScreen from '@screens/BaseScreen';
import { DEVICES } from '@src/constants/miner';
import Device from '@models/device';
import LocalDatabase from '@utils/LocalDatabase';
import styles from './style';

class AddDebugNode extends BaseScreen {
  state = {
    qrCode: '',
    paymentAddress: '',
    productId: '',
    validatorKey: '',
    loading: false,
  };

  addNode = async () => {
    try {
      this.setState({loading: true});
      const {qrCode, paymentAddress, productId, validatorKey} = this.state;
      const node = new Device({
        minerInfo: {
          qrCodeDeviceId: qrCode,
          PaymentAddress: paymentAddress,
          validatorKey: validatorKey,
          Commission: 1,
        },
        platform: 'MINER',
        product_name: qrCode,
        product_id: productId,
        product_type: DEVICES.MINER_TYPE
      });
      const listDevice = await LocalDatabase.getListDevices();
      listDevice.push(node);
      await LocalDatabase.saveListDevices(listDevice);
      this.goToScreen(routeNames.Node);
    } finally {
      this.setState({ loading: false });
    }
  };

  render() {
    const { container } = styles;
    const { loading } = this.state;
    return (
      <View style={container}>
        <Loader loading={loading} />
        <TextInput
          label="QR Code"
          onChangeText={text => this.setState({ qrCode: text })}
        />
        <TextInput
          label="Product ID"
          onChangeText={text => this.setState({ productId: text })}
        />
        <TextInput
          label="Payment Address"
          onChangeText={text => this.setState({ paymentAddress: text })}
        />
        <TextInput
          label="Validator Key"
          onChangeText={text => this.setState({ validatorKey: text })}
        />
        <Button
          onPress={this.addNode}
          title='Add'
        />
      </View>
    );
  }
}

export default AddDebugNode;
