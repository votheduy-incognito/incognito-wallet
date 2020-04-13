import React from 'react';
import {View, StyleSheet, Text} from 'react-native';
import {BtnBack} from '@src/components/Button';
import PropTypes from 'prop-types';
import {FONT, COLORS} from '@src/styles';
import RightMenu from '@src/screens/Stake/features/RightMenu';
import {useNavigation} from 'react-navigation-hooks';
import {isIOS} from '@src/utils/platform';
import DeviceInfo from 'react-native-device-info';

const styled = StyleSheet.create({
  container: {
    position: 'relative',
    zIndex: 1,
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    padding: 20,
    paddingTop: 40,
  },
  hasNotch: {
  },
  title: {
    fontFamily: FONT.NAME.medium,
    fontSize: FONT.SIZE.medium,
    lineHeight: FONT.SIZE.medium + 6,
    color: COLORS.black,
    paddingTop: 2,
  },
  right: {
    padding: 5,
  },
});

const StakeHeader = props => {
  const navigation = useNavigation();
  const hasNotch = isIOS() && DeviceInfo.hasNotch();
  return (
    <View style={[styled.container, hasNotch ? styled.hasNotch : null]}>
      <View style={styled.left}>
        <BtnBack onPress={() => navigation.pop()} />
      </View>
      <View style={styled.center}>
        <Text style={styled.title}>Stake PRV</Text>
      </View>
      <View style={styled.right}>
        <RightMenu />
      </View>
    </View>
  );
};

StakeHeader.defaultProps = {
  //   right: () => null,
  //   center: () => null,
};

StakeHeader.propTypes = {
  //   right: PropTypes.element,
  //   center: PropTypes.element,
};

export default StakeHeader;
