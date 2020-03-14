import React from 'react';
import PropTypes from 'prop-types';
import {ExHandler} from '@services/exception';
import { Toast } from '@components/core';
import {unstakePNode} from '@services/api/node';
import Unstake from './Unstake';

const UnstakePNode = ({ device, wallet, onFinish }) => {
  const [isUnstaking, setUnstaking] = React.useState(false);
  const handleUnstake = async () => {
    if (isUnstaking) {
      return;
    }

    console.debug('PAYMENT', device.PaymentAddress, device.qrCodeDeviceId, device.ProductId);

    try {
      setUnstaking(true);
      const rs = await unstakePNode({
        qrCode: device.qrCodeDeviceId,
        productId: device.ProductId,
        wallet,
        paymentAddress: device.PaymentAddress,
      });
      Toast.showInfo('Unstaking complete.');
      onFinish();
    } catch (e) {
      new ExHandler(e).showErrorToast(true);
    } finally {
      setUnstaking(false);
    }
  };

  return (
    <Unstake
      device={device}
      isUnstaking={isUnstaking}
      onUnstake={handleUnstake}
    />
  );
};

UnstakePNode.propTypes = {
  wallet: PropTypes.object.isRequired,
  device: PropTypes.object.isRequired,
  onFinish: PropTypes.object.isRequired,
};

export default UnstakePNode;
