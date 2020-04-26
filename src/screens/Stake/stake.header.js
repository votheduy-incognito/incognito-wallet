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
    position: 'absolute',
    zIndex: 1,
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    top: 0,
    left: 20,
    right: 20,
    paddingTop: 20,
  },
  ios: {
    paddingTop: 30,
  },
  hasNotch: {
    paddingTop: 40,
  },
  title: {
    fontFamily: FONT.NAME.medium,
    fontSize: FONT.SIZE.medium,
    lineHeight: FONT.SIZE.medium + 6,
    color: COLORS.black,
    paddingTop: 2,
  },
  left: {},
});

const StakeHeader = () => {
  const navigation = useNavigation();
  const hasNotch = isIOS() && DeviceInfo.hasNotch();
  const ios = isIOS();
  return (
    <View
      style={[
        styled.container,
        ios && styled.ios,
        hasNotch && styled.hasNotch,
      ]}
    >
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
