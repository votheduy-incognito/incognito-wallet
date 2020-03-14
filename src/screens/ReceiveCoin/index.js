import React from 'react';
import PropTypes from 'prop-types';
import { TouchableOpacity, View, Text, ScrollView } from '@src/components/core';
import {useSelector} from 'react-redux';
import {selectedPrivacySeleclor} from '@src/redux/selectors';
import ReceiveOut from '@src/components/Deposit';
import DepositAmount from '@components/DepositAmount';
import {useNavigationParam} from 'react-navigation-hooks';
import ROUTES_NAME from '@routers/routeNames';
import ReceiveIn from './ReceiveIn';

import styles from './style';

const modes = [
  {
    text: 'In Network',
    component: ReceiveIn,
  },
  {
    text: 'Out Network',
    component: ReceiveOut,
  }
];

const ReceiveCoin = ({ navigation }) => {
  const [mode, setMode] = React.useState(modes[0]);
  const [amount, setAmount] = React.useState(null);
  const selectedPrivacy = useSelector(selectedPrivacySeleclor.selectedPrivacy);
  const origin = useNavigationParam('origin');
  const selectable = origin !== ROUTES_NAME.WalletDetail;
  const switchable = selectable || (!selectable && selectedPrivacy.isPToken);

  const switchMode = (item) => {
    setMode(item);
  };

  const handleShield = (value) => {
    setAmount(value);
  };

  let Component = mode.component;

  if (mode === modes[1] && amount !== 0) {
    Component = DepositAmount;
  }

  return (
    <View style={styles.container}>
      <View style={styles.content}>
        <View style={styles.modes}>
          {modes.slice(0, switchable ? 2 : 0).map(item => (
            <TouchableOpacity
              key={item.text}
              onPress={() => switchMode(item)}
              style={[styles.mode, item.text !== mode.text && styles.deactiveMode]}
            >
              <Text style={[styles.modeText, item.text !== mode.text && styles.deactiveModeText]}>{item.text}</Text>
            </TouchableOpacity>
          ))}
        </View>
        <ScrollView style={styles.content}>
          <Component
            navigation={navigation}
            amount={amount}
            onComplete={handleShield}
          />
        </ScrollView>
      </View>
    </View>
  );
};

ReceiveCoin.propTypes = {
  navigation: PropTypes.object.isRequired,
};

export default ReceiveCoin;
