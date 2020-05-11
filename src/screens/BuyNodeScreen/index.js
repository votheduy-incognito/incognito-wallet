import React, { useRef, useState, useEffect } from 'react';
import { Animated, RefreshControl, InteractionManager } from 'react-native';
import { Text, Button, View, Image, ScrollView, ActivityIndicator } from '@components/core';
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
import { Dropdown } from 'react-native-material-dropdown';
import { checkEmailValid, checkFieldEmpty } from '@src/utils/validator';
import APIService from '@src/services/api/miner/APIService';
import Exception from '@src/services/exception/ex';
import TokenCustomSelect from '@src/components/TokenSelect/TokenCustomSelect';
import NavigationService from '@src/services/NavigationService';
import routeNames from '@src/router/routeNames';
import { ScreenHeight } from '@src/utils/devices';
import styles from './style';

const dataCountry = require('../../assets/rawdata/country.json');

const TOP_MOTTO_HEADER = 'Node is the simplest way to power the Incognito network and earn crypto. Just plug it in to get started.';
const MOTTO_HEADER = 'As a Node owner, you:';
const MOTTO =
  `☞ Protect people from the dangers of surveillance.
☞ Give everyone a way to use crypto privately.
☞ Own a share of the Incognito network.
☞ Earn block rewards in PRV, and transaction fees in BTC, ETH, and more.`;

const EMAIL = 'email';
// For animated total view
const HEADER_MAX_HEIGHT = 120;
const HEADER_MIN_HEIGHT = 0;

const BuyNodeScreen = () => {
  let scrollViewRef = useRef();

  const [errTf, setErrTF] = useState({});
  const [loading, setLoading] = useState(false);
  const [regions, setRegions] = useState([]);
  const [shippingFee, setShippingFee] = useState(0);
  const [price, setPrice] = useState(399);
  const [currentTokenId, setCurrentTokenId] = useState('0000000000000000000000000000000000000000000000000000000000000004');
  const [pTokenSupport, setPTokenSupport] = useState([]);
  const [pTokenSupportsPartner, setPTokenSupportsPartner] = useState([]);

  const [showContactForShipping, setShowContactForShipping] = useState(false);

  const [currentQuantity, setCurrentQuantity] = useState(1);
  const [contactData, setContactData] = useState({});
  const [scrollY, setScrollY] = useState(new Animated.Value(0));

  const [yTotal, setYTotal] = useState(0);
  const [yContact, setYContact] = useState(0);

  const quantityItems = [
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

  const dispatch = useDispatch();
  const selectedPrivacy = useSelector(selectedPrivacySeleclor.selectedPrivacy);
  const { symbol, tokenId, isVerified } = selectedPrivacy;

  useEffect(() => {
    setDefaultTokenId();
    getPTokenList();
    getSystemConfig();
  }, [errTf]);

  const setDefaultTokenId = () => {
    dispatch(setSelectedPrivacy(currentTokenId));
  };

  // Get token system config
  const getSystemConfig = async () => {
    APIService.getSystemConfig()
      .then(data => {
        if (data?.BuyNodePTokensPartner) {
          let res = JSON.parse(data?.BuyNodePTokensPartner);
          setPTokenSupportsPartner(res);
        }
      })
      .catch(err => {
        console.log('Could not get system config for buying device');
      });
  };

  // Get all pToken for internal app, only accept with these coins
  const getPTokenList = async() => {
    APIService.getPTokenSupportForBuyingDevice()
      .then(data => {
        let res = data;
        setPTokenSupport(res);
      })
      .catch(err => {
        console.log('Could not get support token for buying device');
      });
  };

  const renderNodeImgAndPrice = () => {
    return (
      <View style={[styles.containerHeader, theme.MARGIN.marginTopDefault]}>
        <View style={{ flexDirection: 'row', alignContent: 'center', alignItems: 'center' }}>
          <Image style={[theme.IMAGES.avatar, theme.SHADOW.imageAvatar]} resizeMode="contain" source={nodeImg} />
          <Text style={[theme.text.boldTextStyle, theme.MARGIN.marginLeftDefault]}> Node </Text>
        </View>
        <View>
          <Text style={theme.text.headerTextStyle}>{`$${price}`}</Text>
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
          items={quantityItems}
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
      <View style={[theme.FLEX.fullWidth, theme.FLEX.rowSpaceBetween, theme.MARGIN.marginBottomSmall]}>
        <Text style={[theme.text.defaultTextStyle, theme.FLEX.alignViewSelfCenter, styleText]}>{`${text}`}</Text>
        <Text style={[theme.text.defaultTextStyle, theme.FLEX.alignViewSelfCenter, styleValue]}>{`${value}`}</Text>
      </View>
    );
  };

  const renderTotal = () => {
    let subTotal = price * currentQuantity;
    let total = subTotal + shippingFee;
    let countableToken = getCountCoinPayable();
    return (
      <View onLayout={
        event => setYTotal(event?.nativeEvent?.layout?.y || 0)
      }
      >
        <LineView color={COLORS.lightGrey1} />
        {renderTotalItem('Subtotal', `$${subTotal}`)}
        {renderTotalItem('Shipping', shippingFee === 0 ? 'FREE' : `$${shippingFee}`)}
        {renderTotalItem('Ships within 24 hours', '')}
        <LineView color={COLORS.lightGrey1} style={theme.MARGIN.marginBottomDefault} />
        {renderTotalItem('Total', `$${total}`, {}, theme.text.boldTextStyleLarge)}
        {renderTotalItem(`Pay with ${symbol}`, `${countableToken} ${symbol}`, theme.text.boldTextStyleMedium, theme.text.boldTextStyleLarge)}
        <LineView color={COLORS.lightGrey1} />
      </View>
    );
  };

  const handleSelectToken = tokenId => {
    setCurrentTokenId(tokenId);
    dispatch(setSelectedPrivacy(tokenId));

    // Update price dynamically for DAI token
    checkSelectedTokenIdAndUpdateDynamicPrice(tokenId);
  };

  const checkSelectedTokenIdAndUpdateDynamicPrice = tokenId => {
    // Update price dynamically for DAI token
    let IDTokenDAI = '';
    for (let i = 0; i < pTokenSupport.length; i++) {
      if (pTokenSupport[i]?.TokenID === tokenId) {
        IDTokenDAI = pTokenSupport[i]?.ID;
        break;
      }
    }
    // Foreach in pTokenPartnerSupport, update price
    for (let j = 0; j < pTokenSupportsPartner.length; j++) {
      if (pTokenSupportsPartner[j]?.ID === IDTokenDAI) {
        IDTokenDAI = pTokenSupportsPartner[j]?.ID;
        // Set price
        setPrice(Number(pTokenSupportsPartner[j]?.Price || 0));
        break;
      } else {
        // Set price default
        setPrice(399);
      }
    }
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
                <TokenCustomSelect customListPToken={pTokenSupport} onSelect={handleSelectToken} />
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
  const getShippingFee = async () => {
    await APIService.getShippingFee(contactData.city, contactData.code, contactData.postalCode, contactData.region, contactData.address)
      .then(val => {
        if (val && val?.Result) {
          setShippingFee(val?.Result?.ShippingFee || 0);
          setPrice(val?.Result?.Price || 0);

          // Update price specified
          checkSelectedTokenIdAndUpdateDynamicPrice(tokenId);
        }
      });
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

  // Update regions by country changes
  const changeRegionsDataAndSetCountryCode = (countryValue) => {
    for (let i = 0; i < dataCountry.length; i++) {
      if (dataCountry[i].value === countryValue) {
        setContactData({ ...contactData, code: dataCountry[i].countryShortCode, country: dataCountry[i].value });
        setRegions(dataCountry[i].regions);
      }
    }
  };

  const renderContactInformation = () => {
    return (
      <View
        style={theme.MARGIN.marginTopDefault}
        onLayout={
          event => setYContact(event?.nativeEvent?.layout?.y || 0)
        }
      >
        <Text style={[theme.text.defaultTextStyle, { fontSize: FONT.SIZE.medium }]}>Contact information</Text>
        <TextField
          keyboardType='email-address'
          autoCapitalize='none'
          autoCorrect={false}
          enablesReturnKeyAutomatically
          onFocus={() => onFocusField()}
          onChangeText={async (text) => {
            await setContactData({ ...contactData, email: text });
            await checkErrEmail(checkEmailValid(text).valid);
          }}
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
          onChangeText={async (text) => {
            await setContactData({ ...contactData, firstName: text });
            await checkErrEmpty('firstName', checkFieldEmpty(text));
          }}
          returnKeyType='next'
          label='First name'
          error={errTf?.firstName}
        />
        <TextField
          keyboardType='default'
          autoCapitalize='none'
          autoCorrect={false}
          enablesReturnKeyAutomatically
          onFocus={() => onFocusField()}
          onChangeText={async (text) => {
            await setContactData({ ...contactData, lastName: text });
            await checkErrEmpty('lastName', checkFieldEmpty(text));
          }}
          returnKeyType='next'
          label='Last name'
          error={errTf?.lastName}
        />
        <TextField
          keyboardType='default'
          autoCapitalize='none'
          autoCorrect={false}
          enablesReturnKeyAutomatically
          onFocus={() => onFocusField()}
          onChangeText={async (text) => {
            await setContactData({ ...contactData, address: text });
            await checkErrEmpty('address', checkFieldEmpty(text));
            getShippingFee();
          }}
          returnKeyType='next'
          label='Address'
          error={errTf?.address}
        />
        <TextField
          keyboardType='default'
          autoCapitalize='none'
          autoCorrect={false}
          enablesReturnKeyAutomatically
          onFocus={() => onFocusField()}
          onChangeText={async (text) => {
            await setContactData({ ...contactData, city: text });
            await checkErrEmpty('city', checkFieldEmpty(text));
            getShippingFee();
          }}
          returnKeyType='next'
          label='City'
          error={errTf?.city}
        />
        <Dropdown
          label='Country/Region'
          data={dataCountry}
          value={contactData?.country || ''}
          onChangeText={async (value, index, data) => {
            await setContactData({ ...contactData, country: value, region: '' });
            await setRegions([]);
            await changeRegionsDataAndSetCountryCode(value);
            getShippingFee();
          }}
        />
        <Dropdown
          label='State'
          data={regions}
          onChangeText={async (value, index, data) => {
            await setContactData({ ...contactData, region: value });
            await getShippingFee();
          }}
        />
        <TextField
          keyboardType='email-address'
          autoCapitalize='none'
          autoCorrect={false}
          enablesReturnKeyAutomatically
          onFocus={() => onFocusField()}
          onChangeText={async (text) => {
            await checkErrEmpty('postalCode', checkFieldEmpty(text));
            await setContactData({ ...contactData, postalCode: text });
            getShippingFee();
          }}
          returnKeyType='next'
          label='Postal code'
          error={errTf?.postalCode}
        />
        <TextField
          keyboardType='numeric'
          autoCapitalize='none'
          autoCorrect={false}
          enablesReturnKeyAutomatically
          onFocus={() => onFocusField()}
          onChangeText={async (text) => {
            await setContactData({ ...contactData, phone: text });
            getShippingFee();
          }}
          returnKeyType='done'
          label='Phone (optional)'
        />
      </View>
    );
  };

  // Show contact section for user typing
  const onShowContactForShipping = () => {
    setShowContactForShipping(true);
  };

  // Process payment flow
  const onPaymentProcess = async () => {
    setLoading(true);
    APIService.checkOutOrder(
      contactData.email,
      contactData.code,
      contactData.address,
      contactData.city,
      contactData.region,
      contactData.postalCode,
      contactData.phoneNumber,
      currentTokenId,
      Number(currentQuantity),
      contactData.firstName,
      contactData.lastName)
      .then(data => {
        setLoading(false);
        NavigationService.navigate(routeNames.PaymentBuyNodeScreen, {
          'paymentDevice': {
            'Address': data?.Address,
            'TotalAmount': data?.TotalAmount,
            'TotalPrice': data?.TotalPrice,
            'OrderID': data?.OrderID
          }
        });
      })
      .catch(error => {
        setLoading(false);
        throw new Error('Can not checkout your order ' + error.message);
      });
  };

  // Disable button process for better behavior
  const shouldDisableButtonProcess = () => {
    return showContactForShipping && !(contactData.email &&
      contactData.firstName &&
      contactData.lastName &&
      contactData.address &&
      contactData.country &&
      contactData.region &&
      contactData.postalCode);
  };

  const renderButtonProcess = () => {
    return (
      <Button
        title="Pay Now"
        onPress={async () => {
          if (!showContactForShipping) {
            // Show contact section
            await onShowContactForShipping();
            scrollViewRef?.current?.scrollToEnd({ animated: true });
          } else {
            // Payment for device
            onPaymentProcess();
          }
        }}
        disabled={shouldDisableButtonProcess()}
      />
    );
  };

  const headerHeight = scrollY.interpolate({
    inputRange: [yTotal, yTotal + 100],
    outputRange: [HEADER_MIN_HEIGHT, HEADER_MAX_HEIGHT],
    extrapolate: 'clamp',
  });

  // Get count of token payable
  const getCountCoinPayable = () => {
    let subTotal = price * currentQuantity;
    let total = subTotal + shippingFee;
    let result = 0;
    for (let i = 0; i < pTokenSupport.length; i++) {
      if (currentTokenId === pTokenSupport[i]?.TokenID) {
        let priceUSD = pTokenSupport[i]?.PriceUsd;
        result = (total / priceUSD).toFixed(4);
        break;
      }
    }
    return result;
  };

  const renderFloatingPriceView = () => {
    let subTotal = price * currentQuantity;
    let total = subTotal + shippingFee;
    let countableToken = getCountCoinPayable();
    return (
      <Animated.View style={[styles.header, theme.SHADOW.normal, { height: showContactForShipping ? headerHeight : 0 }]}>
        {showContactForShipping ? (
          <View style={styles.bar}>
            {renderTotalItem('Shipping', shippingFee === 0 ? 'FREE' : `$${shippingFee}`)}
            {renderTotalItem('Total', `$${total}`, {}, theme.text.boldTextStyleLarge)}
            {renderTotalItem(`Pay with ${symbol}`, `${countableToken} ${symbol}`, theme.text.boldTextStyleMedium, theme.text.boldTextStyleLarge)}
          </View>
        ) : null}
      </Animated.View>
    );
  };

  return (
    <View style={styles.container}>
      <ScrollView
        refreshControl={(
          <RefreshControl
            refreshing={false}
            onRefresh={() => {
              getPTokenList();
            }}
          />
        )}
        scrollEventThrottle={16}
        onScroll={Animated.event(
          [{ nativeEvent: { contentOffset: { y: scrollY } } }]
        )}
        showsVerticalScrollIndicator={false}
        ref={scrollViewRef}
        containerContentStyle={styles.container}
      // I want to scroll into current focusing container for better UX
      // onContentSizeChange={(contentWidth, contentHeight) => { showContactForShipping && scrollViewRef?.current?.scrollToEnd({ animated: true }); }}
      >
        <KeyboardAwareScrollView showsVerticalScrollIndicator={false} enableOnAndroid enableAutomaticScroll>
          {renderNodeImgAndPrice()}
          {renderMotto()}
          {renderActionSheet()}
          {renderPayment()}
          {renderTotal()}
          {showContactForShipping && renderContactInformation()}
          {renderButtonProcess()}
          {loading && <ActivityIndicator style={theme.FLEX.absoluteIndicator} />}
        </KeyboardAwareScrollView>

      </ScrollView>
      {renderFloatingPriceView()}

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
