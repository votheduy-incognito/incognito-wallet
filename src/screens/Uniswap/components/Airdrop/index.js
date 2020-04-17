import React from 'react';
import PropTypes from 'prop-types';
import {
  Button,
  Text,
  View,
} from '@components/core/index';
import {Overlay} from 'react-native-elements';
import {useNavigation} from 'react-navigation-hooks';
import routeNames from '@routers/routeNames';
import mainStyle from './style';

const Airdrop = ({onClose, visible}) => {
  const navigation = useNavigation();

  const readFAQs = () => {
    onClose();
    navigation.navigate(routeNames.UniswapHelp);
  };

  return (
    <Overlay isVisible={visible} overlayStyle={mainStyle.dialog}>
      <View style={[mainStyle.dialogContent]}>
        <View style={mainStyle.textContent}>
          <Text style={mainStyle.title}>
            Testnet tokens will reach you soon
          </Text>
          <Text style={mainStyle.desc}>
            No deposit required – test coins are on the way to you now.
          </Text>
          <Text style={mainStyle.desc}>
            This process may take a couple of minutes. Read the FAQs in the meantime?
          </Text>
        </View>
        <View style={[mainStyle.actions]}>
          <Button
            title="Close"
            style={mainStyle.closeBtn}
            titleStyle={mainStyle.closeText}
            onPress={onClose}
          />
          <Button
            title="Read FAQs"
            style={mainStyle.okBtn}
            onPress={readFAQs}
          />
        </View>
      </View>
    </Overlay>
  );
};

Airdrop.propTypes = {
  onClose: PropTypes.func.isRequired,
  visible: PropTypes.bool.isRequired,
};

export default React.memo(Airdrop);
