import React from 'react';
import PropTypes from 'prop-types';
import {
  Button,
  Text,
  View,
} from '@components/core/index';
import {Overlay} from 'react-native-elements';
import mainStyle from './style';

const WithdrawMainnet = ({onClose, visible}) => {
  return (
    <Overlay isVisible={visible} overlayStyle={mainStyle.dialog}>
      <View style={[mainStyle.dialogContent]}>
        <View style={mainStyle.textContent}>
          <Text style={mainStyle.title}>
            pUniswap is on the testnet
          </Text>
          <Text style={mainStyle.desc}>
            Testnet tokens here cannot be withdrawn to another wallet account.
          </Text>
        </View>
        <Button
          title="OK"
          onPress={onClose}
          style={mainStyle.btn}
        />
      </View>
    </Overlay>
  );
};

WithdrawMainnet.propTypes = {
  onClose: PropTypes.func.isRequired,
  visible: PropTypes.bool.isRequired,
};

export default React.memo(WithdrawMainnet);
