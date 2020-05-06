import React, { useRef, useState, useEffect } from 'react';
import PropTypes from 'prop-types';
import { withNavigationFocus, SafeAreaView } from 'react-navigation';
import { Text, View, Image } from '@components/core';
import nodeImg from '@src/assets/images/node_buy.png';
import theme from '@src/styles/theme';
import { ActionSheetCustom as ActionSheet } from 'react-native-actionsheet';
import styles from './style';

const TOP_MOTTO_HEADER = 'Node is the simplest way to power the Incognito network and earn crypto. Just plug it in to get started.';
const MOTTO_HEADER = 'As a Node owner, you:';
const MOTTO =
  `☞ Protect people from the dangers of surveillance.
☞ Give everyone a way to use crypto privately.
☞ Own a share of the Incognito network.
☞ Earn block rewards in PRV, and transaction fees in BTC, ETH, and more.`;

const BuyNodeScreen = () => {
  let actionSheetRef = useRef(null);
  const options = [
    'Cancel',
    '2',
    '3',
    '4',
    '5'
  ];

  useEffect(() => {
    // actionSheetRef && actionSheetRef.show();
  }, []);

  const renderNodeImgAndPrice = () => {
    return (
      <View style={styles.containerHeader}>
        <View style={{ flexDirection: 'row', alignContent: 'center', alignItems: 'center' }}>
          <Image style={[theme.IMAGES.avatar, theme.SHADOW.imageAvatar]} resizeMode="contain" source={nodeImg} />
          <Text style={[theme.text.defaultTextStyle, theme.MARGIN.marginLeftDefault]}> Node </Text>
        </View>
        <View>
          <Text style={theme.text.headerTextStyle}> 399$ </Text>
        </View>
      </View>
    );
  };
  const renderMotto = () => {
    return (
      <View style={theme.MARGIN.marginTopDefault}>
        <Text style={theme.MARGIN.marginBottomDefault}>{TOP_MOTTO_HEADER}</Text>
        <Text style={[theme.MARGIN.marginBottomDefault, theme.text.boldTextStyle]}>{MOTTO_HEADER}</Text>
        <Text>{MOTTO}</Text>
      </View>
    );
  };

  const renderActionSheet = () => {
    return (
      <ActionSheet
        ref={o => actionSheetRef = o}
        title={<Text style={{ color: '#000', fontSize: 18 }}>Which one do you like?</Text>}
        options={options}
        cancelButtonIndex={0}
        destructiveButtonIndex={4}
        onPress={(index) => { /* do something */ }}
      />
    );
  };

  return (
    <View style={styles.container}>
      {renderNodeImgAndPrice()}
      {renderMotto()}
      {renderActionSheet()}
    </View>
  );
};

BuyNodeScreen.propTypes = {
};

export default withNavigationFocus(BuyNodeScreen);
