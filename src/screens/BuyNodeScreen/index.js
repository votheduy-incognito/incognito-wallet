import React, { useRef, useState, useEffect } from 'react';
import PropTypes from 'prop-types';
import { withNavigationFocus, SafeAreaView } from 'react-navigation';
import { Text, View, Image } from '@components/core';
import nodeImg from '@src/assets/images/node_buy.png';
import theme from '@src/styles/theme';
import RNPickerSelect from 'react-native-picker-select';
import Ionicons from 'react-native-vector-icons/Ionicons';
import { ActionSheetCustom as ActionSheet } from 'react-native-actionsheet';
import { LineView } from '@src/components/Line';
import { COLORS } from '@src/styles';
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
  const [currentQuantity, setCurrentQuantity] = useState('');
  const quantity = [
    {
      label: '1',
      value: '1',
    },
    {
      label: '2',
      value: '2',
    },
    {
      label: '3',
      value: '3',
    },
    {
      label: '4',
      value: '4',
    },
    {
      label: '5',
      value: '5',
    },
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
      <View style={[theme.FLEX.rowSpaceBetween, theme.FLEX.fullWidth, theme.MARGIN.marginTopDefault]}>
        <Text style={[theme.MARGIN.marginRightDefault, theme.text.boldTextStyleMedium, theme.FLEX.alignViewSelfCenter]}>Select quantity</Text>
        <RNPickerSelect
          placeholder={{}} // Set placeholder to empyy object
          items={quantity}
          onValueChange={value => {
            setCurrentQuantity(value);
          }}
          style={theme.INPUT.picker}
          InputAccessoryView={() => null}
          value={currentQuantity}
          useNativeAndroidPickerStyle={false}
          textInputProps={[theme.RECT.picker]}
          Icon={() => {
            return (
              <View style={styles.iconDropDown}>
                <Ionicons size={20} name="ios-arrow-down" color="black" />
              </View>
            );
          }}
        />
      </View>
    );
  };

  const renderTotalItem = (text, value, styleText, styleValue) => {
    return (
      <View style={[theme.FLEX.rowSpaceBetween, theme.MARGIN.marginBottomSmall]}>
        <Text style={[theme.text.defaultTextStyle, theme.FLEX.alignViewSelfCenter, styleText]}>{`${text}`}</Text>
        <Text style={[theme.text.defaultTextStyle, theme.FLEX.alignViewSelfCenter, styleValue]}>{`${value}`}</Text>
      </View>
    );
  };

  const renderTotal = () => {
    return (
      <View style={theme.MARGIN.marginTopDefault}>
        <LineView color={COLORS.lightGrey1} style={theme.MARGIN.marginBottomDefault} />
        {renderTotalItem('Subtotal', '798$')}
        {renderTotalItem('Shipping', 'FREE')}
        {renderTotalItem('Ships within 24 hours', '')}
        <LineView color={COLORS.lightGrey1} />
        {renderTotalItem('Total', '798$', {}, theme.text.boldTextStyleLarge)}
        {renderTotalItem('Pay with Bitcoin', '0.086114 BTC', theme.text.boldTextStyleMedium, theme.text.boldTextStyleLarge)}
      </View>
    );
  };

  const renderPayment = () => {
    return (
      <View />
    );
  };

  return (
    <View style={styles.container}>
      {renderNodeImgAndPrice()}
      {renderMotto()}
      {renderActionSheet()}
      {renderTotal()}
      {renderPayment()}
    </View>
  );
};

BuyNodeScreen.propTypes = {
};

export default withNavigationFocus(BuyNodeScreen);
