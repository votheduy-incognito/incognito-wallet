import React, { useRef, useState, useEffect } from 'react';
import PropTypes from 'prop-types';
import { withNavigationFocus, SafeAreaView } from 'react-navigation';
import { Text, Button, View, Image, ScrollView } from '@components/core';
import nodeImg from '@src/assets/images/node_buy.png';
import { selectedPrivacySeleclor } from '@src/redux/selectors';
import theme from '@src/styles/theme';
import RNPickerSelect from 'react-native-picker-select';
import Ionicons from 'react-native-vector-icons/Ionicons';
import { setSelectedPrivacy } from '@src/redux/actions/selectedPrivacy';
import TokenSelect from '@components/TokenSelect';
import { TextField } from 'react-native-material-textfield';
import CurrentBalance from '@components/CurrentBalance';
import { connect, useSelector, useDispatch } from 'react-redux';
import { LineView } from '@src/components/Line';
import { COLORS, FONT } from '@src/styles';
import { useNavigation } from 'react-navigation-hooks';
import { KeyboardAwareScrollView } from 'react-native-keyboard-aware-scroll-view';
import LogManager from '@src/services/LogManager';
import { checkEmailValid, checkFieldEmpty } from '@src/utils/validator';
import styles from './style';

const TOP_MOTTO_HEADER = 'Node is the simplest way to power the Incognito network and earn crypto. Just plug it in to get started.';
const MOTTO_HEADER = 'As a Node owner, you:';
const MOTTO =
  `☞ Protect people from the dangers of surveillance.
☞ Give everyone a way to use crypto privately.
☞ Own a share of the Incognito network.
☞ Earn block rewards in PRV, and transaction fees in BTC, ETH, and more.`;

const EMAIL = 'email';
const FIRSTNAME = 'firstname';
const LASTNAME = 'lastname';
const ADDRESS = 'address';
const CITY = 'city';

const BuyNodeScreen = () => {
  const selectedPrivacy = useSelector(selectedPrivacySeleclor.selectedPrivacy);
  const [errTf, setErrTF] = useState({});
  let emailRef = useRef(null);
  let scrollViewRef = useRef();
  const [showContactForShipping, setShowContactForShipping] = useState(false);
  const [formIsValid, setFormValid] = useState(true);
  const dispatch = useDispatch();
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
  }, [errTf]);

  // Get all pToken for internal app, only accept with these coins
  const getPTokenList = () => {

  };

  const renderNodeImgAndPrice = () => {
    return (
      <View style={[styles.containerHeader, theme.MARGIN.marginTopDefault]}>
        <View style={{ flexDirection: 'row', alignContent: 'center', alignItems: 'center' }}>
          <Image style={[theme.IMAGES.avatar, theme.SHADOW.imageAvatar]} resizeMode="contain" source={nodeImg} />
          <Text style={[theme.text.boldTextStyle, theme.MARGIN.marginLeftDefault]}> Node </Text>
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
      <View>
        <LineView color={COLORS.lightGrey1} />
        {renderTotalItem('Subtotal', '798$')}
        {renderTotalItem('Shipping', 'FREE')}
        {renderTotalItem('Ships within 24 hours', '')}
        <LineView color={COLORS.lightGrey1} style={theme.MARGIN.marginBottomDefault} />
        {renderTotalItem('Total', '798$', {}, theme.text.boldTextStyleLarge)}
        {renderTotalItem('Pay with Bitcoin', '0.086114 BTC', theme.text.boldTextStyleMedium, theme.text.boldTextStyleLarge)}
        <LineView color={COLORS.lightGrey1} />
      </View>
    );
  };

  const handleSelectToken = tokenId => {
    dispatch(setSelectedPrivacy(tokenId));
  };

  const renderPayment = () => {
    return (
      <View>
        <LineView color={COLORS.lightGrey1} style={theme.MARGIN.marginTopDefault} />
        <View style={[theme.FLEX.rowSpaceBetween, { flex: 1 }]}>
          <Text style={[theme.text.defaultTextStyle, theme.FLEX.alignViewSelfCenter]}>Payment</Text>
          <CurrentBalance
            select={
              (
                <TokenSelect onSelect={handleSelectToken} />
              )
            }
          />
        </View>
      </View>
    );
  };

  const onFocusField = () => {
    let { errors = {} } = errTf;

    for (let name in errors) {
      let ref = name?.current;

      if (ref && ref.isFocused()) {
        delete errors[name];
      }
    }

    setErrTF(errors);
  };

  const checkErrEmail = (valid) => {
    let error = errTf;
    error[EMAIL] = !valid ? 'Email is invalid' : '';

    // We have to do this for asynchornous updatable
    setErrTF(prevError => ({ ...prevError, ...error }));
  };
  const checkErrEmpty = (field, valid) => {
    let error = errTf;
    error[`${field}`] = !valid ? 'Field required' : '';

    // We have to do this for asynchornous updatable
    setErrTF(prevError => ({ ...prevError, ...error }));
  };

  const renderContactInformation = () => {
    return (
      <View style={theme.MARGIN.marginTopDefault}>
        <Text style={[theme.text.defaultTextStyle, { fontSize: FONT.SIZE.medium }]}>Contact information</Text>
        <TextField
          ref={ref => emailRef = ref}
          keyboardType='email-address'
          autoCapitalize='none'
          autoCorrect={false}
          enablesReturnKeyAutomatically
          onFocus={() => onFocusField()}
          onChangeText={(text) => checkErrEmail(checkEmailValid(text).valid)}
          returnKeyType='next'
          label='Email'
          error={errTf?.email}
        />
        <Text style={[theme.text.defaultTextStyle, { fontSize: FONT.SIZE.medium }, theme.MARGIN.marginTopDefault]}>Shipping address</Text>
        <TextField
          keyboardType='default'
          autoCapitalize='none'
          autoCorrect={false}
          enablesReturnKeyAutomatically
          onFocus={() => onFocusField()}
          onChangeText={(text) => checkErrEmpty('firstName', checkFieldEmpty(text))}
          returnKeyType='next'
          label='First name'
          error={errTf?.firstName}
        />
        <TextField
          keyboardType='email-address'
          autoCapitalize='none'
          autoCorrect={false}
          enablesReturnKeyAutomatically
          onFocus={() => onFocusField()}
          onChangeText={(text) => checkErrEmpty('lastName', checkFieldEmpty(text))}
          returnKeyType='next'
          label='Last name'
          error={errTf?.lastName}
        />
        <TextField
          keyboardType='email-address'
          autoCapitalize='none'
          autoCorrect={false}
          enablesReturnKeyAutomatically
          onFocus={() => onFocusField()}
          onChangeText={(text) => checkErrEmpty('address', checkFieldEmpty(text))}
          returnKeyType='next'
          label='Address'
          error={errTf?.address}
        />
        <TextField
          keyboardType='email-address'
          autoCapitalize='none'
          autoCorrect={false}
          enablesReturnKeyAutomatically
          onFocus={() => onFocusField()}
          onChangeText={(text) => checkErrEmpty('city', checkFieldEmpty(text))}
          returnKeyType='done'
          label='City'
          error={errTf?.city}
        />
      </View>
    );
  };

  // Show contact section for user typing
  const onShowContactForShipping = () => {
    setShowContactForShipping(true);
    setFormValid(false);
  };

  // Process payment flow
  const onPaymentProcess = () => {

  };

  // Disable button process for better behavior
  const shouldDisableButtonProcess = () => {
    return !formIsValid;
  };

  const renderButtonProcess = () => {
    return (
      <Button
        title="Pay Now"
        onPress={async () => {
          if (!showContactForShipping) {
            // Show contact section
            await onShowContactForShipping();
          } else {
            // Payment for device
            onPaymentProcess();
          }
        }}
        disabled={shouldDisableButtonProcess()}
      />
    );
  };

  return (
    <View style={styles.container}>
      <ScrollView 
        ref={scrollViewRef} 
        containerContentStyle={styles.container}
        // I want to scroll into current focusing container for better UX
        onContentSizeChange={(contentWidth, contentHeight)=> {showContactForShipping && scrollViewRef?.current?.scrollToEnd({animated: true});}}
      >
        <KeyboardAwareScrollView>
          {renderNodeImgAndPrice()}
          {renderMotto()}
          {renderActionSheet()}
          {renderPayment()}
          {renderTotal()}
          {showContactForShipping && renderContactInformation()}
          {renderButtonProcess()}
        </KeyboardAwareScrollView>
      </ScrollView>
    </View>
  );
};

BuyNodeScreen.propTypes = {
};


const mapState = state => ({
});

const mapDispatch = {
  setSelectedPrivacy,
};

export default connect(mapState, mapDispatch)(BuyNodeScreen);
