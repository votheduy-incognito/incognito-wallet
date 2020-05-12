import React, { useRef, useState, useEffect } from 'react';
import { Animated, RefreshControl, TouchableOpacity } from 'react-native';
import { Text, Button, View, Image, ScrollView, ActivityIndicator } from '@components/core';
import nodeImg from '@src/assets/images/node_buy.png';
import { selectedPrivacySeleclor, accountSeleclor } from '@src/redux/selectors';
import theme from '@src/styles/theme';
import AntDesign from 'react-native-vector-icons/AntDesign';
import { setSelectedPrivacy } from '@src/redux/actions/selectedPrivacy';
import linkingService from '@services/linking';
import { TextField } from 'react-native-material-textfield';
import CurrentBalance from '@components/CurrentBalance';
import { connect, useSelector, useDispatch } from 'react-redux';
import { LineView } from '@src/components/Line';
import { COLORS, FONT } from '@src/styles';
import { KeyboardAwareScrollView } from 'react-native-keyboard-aware-scroll-view';
import LogManager from '@src/services/LogManager';
import { Icon } from 'react-native-elements';
import { Dropdown } from 'react-native-material-dropdown';
import { checkEmailValid, checkFieldEmpty } from '@src/utils/validator';
import APIService from '@src/services/api/miner/APIService';
import TokenCustomSelect from '@src/components/TokenSelect/TokenCustomSelect';
import NavigationService from '@src/services/NavigationService';
import routeNames from '@src/router/routeNames';
import { actionToggleModal } from '@src/components/Modal';
import AccountModal from '@src/components/Modal/AccountModal/modal.account';
import { CONSTANT_CONFIGS } from '@src/constants';
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
  let emailRef = useRef();
  let firstNameRef = useRef();
  let lastNameRef = useRef();
  let addressRef = useRef();
  let cityRef = useRef();
  let scrollViewRef = useRef();

  const [errTf, setErrTF] = useState({});
  const [loading, setLoading] = useState(false);
  const [regions, setRegions] = useState([]);
  const [shippingFee, setShippingFee] = useState(0);
  const [price, setPrice] = useState(399);
  const [shippingHour, setShippingHour] = useState('');
  const [currentTokenId, setCurrentTokenId] = useState('0000000000000000000000000000000000000000000000000000000000000004');
  const [pTokenSupport, setPTokenSupport] = useState([]);
  const [pTokenSupportsPartner, setPTokenSupportsPartner] = useState([]);

  const [showContactForShipping, setShowContactForShipping] = useState(false);

  const [currentQuantity, setCurrentQuantity] = useState(1);
  const [currentAccount, setCurrentAccount] = useState(useSelector(accountSeleclor.defaultAccount));
  const [contactData, setContactData] = useState({});
  const [scrollY] = useState(new Animated.Value(0));

  const [yTotal, setYTotal] = useState(0);
  const [, setYContact] = useState(0);


  const dispatch = useDispatch();
  const selectedPrivacy = useSelector(selectedPrivacySeleclor.selectedPrivacy);

  const { symbol, tokenId } = selectedPrivacy;
  const account = useSelector(accountSeleclor.defaultAccount);
  const selectedPrivacyWithAccountChange = useSelector(selectedPrivacySeleclor.getPrivacyDataBaseOnAccount)(currentAccount);
  // const wallet = useSelector(wallet);

  useEffect(() => {
    setDefaultTokenId();
    getSystemConfig();

    // Default US
    setContactData({ ...contactData, country: dataCountry[0]?.value, code: dataCountry[0].countryShortCode });
    setRegions(dataCountry[0]?.regions);

  }, [errTf]);

  const setDefaultTokenId = async () => {
    dispatch(setSelectedPrivacy(currentTokenId));
  };

  // Get token system config
  const getSystemConfig = async () => {
    APIService.getSystemConfig()
      .then(data => {
        if (data?.BuyNodePTokensPartner) {
          let resPTokenSupportsPartner = JSON.parse(data?.BuyNodePTokensPartner);
          setPTokenSupportsPartner(resPTokenSupportsPartner);
          getPTokenList(resPTokenSupportsPartner);
        }
        if (data?.MinerShipInfo) {
          let minerShipInfo = data?.MinerShipInfo;
          setShippingHour(minerShipInfo);
        }
      })
      .catch((err) => {
        console.log('Could not get system config for buying device' + err.message);
      });
  };

  // Get all pToken for internal app, only accept with these coins
  const getPTokenList = async (resPTokenSupportsPartner) => {
    APIService.getPTokenSupportForBuyingDevice()
      .then(data => {
        let res = data;
        setPTokenSupport(res);
        // Check current tokenId
        checkSelectedTokenIdAndUpdateDynamicPrice(res, resPTokenSupportsPartner, tokenId);
      })
      .catch(() => {
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
        <Text style={[theme.MARGIN.marginRightDefault, theme.text.boldTextStyle, theme.FLEX.alignViewSelfCenter]}>Select quantity</Text>
        <View style={theme.FLEX.rowSpaceBetween}>
          <TouchableOpacity
            style={theme.MARGIN.marginRightDefault}
            disabled={currentQuantity == 1}
            onPress={() => {
              if (currentQuantity - 1 > 0) {
                setCurrentQuantity(currentQuantity - 1);
              }
            }}
          >
            <AntDesign name="minuscircleo" size={25} color={currentQuantity === 1 ? COLORS.lightGrey10 : COLORS.black} />
          </TouchableOpacity>
          <Text style={[theme.text.boldTextStyleMedium, theme.FLEX.alignViewSelfCenter]}>{`${currentQuantity}`}</Text>
          <TouchableOpacity
            style={theme.MARGIN.marginLeftDefault}
            disabled={currentQuantity == 5}
            onPress={() => {
              if (currentQuantity + 1 <= 5) {
                setCurrentQuantity(currentQuantity + 1);
              }
            }}
          >
            <AntDesign name="pluscircleo" size={25} color={currentQuantity === 5 ? COLORS.lightGrey10 : COLORS.black} />
          </TouchableOpacity>
        </View>
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
    let subTotal = (price + shippingFee) * currentQuantity;
    let countableToken = getCountCoinPayable();
    return (
      <View onLayout={
        event => setYTotal(event?.nativeEvent?.layout?.y || 0)
      }
      >
        <LineView color={COLORS.lightGrey1} />
        {renderTotalItem('Subtotal', `$${subTotal.toFixed(2)}`)}
        {renderTotalItem('Shipping', shippingFee === 0 ? 'FREE' : `$${shippingFee}`)}
        {renderTotalItem(`Ships ${shippingHour}`, '')}
        <LineView color={COLORS.lightGrey1} style={theme.MARGIN.marginBottomDefault} />
        {renderTotalItem('Total', `$${subTotal.toFixed(2)}`, {}, theme.text.defaultTextStyle)}
        {renderTotalItem(`Pay with ${symbol}`, `${countableToken} ${symbol}`, theme.text.boldTextStyle, theme.text.boldTextStyle)}
        <LineView color={COLORS.lightGrey1} />
      </View>
    );
  };

  const handleSelectToken = tokenId => {
    setCurrentTokenId(tokenId);
    dispatch(setSelectedPrivacy(tokenId));

    // Update price dynamically for DAI token
    checkSelectedTokenIdAndUpdateDynamicPrice(pTokenSupport, pTokenSupportsPartner, tokenId);
  };

  const checkSelectedTokenIdAndUpdateDynamicPrice = (pTokenSupport, pTokenSupportsPartner, tokenId) => {
    if (typeof pTokenSupport != 'object' || typeof pTokenSupportsPartner != 'object') {
      console.log('Response value from server not correct');
      return;
    }
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
        <View style={[theme.FLEX.rowSpaceBetween]}>
          <View style={{ justifyContent: 'center', alignContent: 'center', }}>
            <Text style={[theme.text.defaultTextStyle, { marginTop: 5 }]}>Payment</Text>
            <View style={[theme.FLEX.rowSpaceBetween]}>
              <Button
                style={{ backgroundColor: 'white', marginLeft: -10 }}
                title="(Or pay with fiat)"
                titleStyle={[theme.text.defaultTextStyle, { color: COLORS.primary }]}
                onPress={() => {
                  linkingService.openUrl(`${CONSTANT_CONFIGS.NODE_URL}`);
                }}
              />

            </View>
          </View>
          <View>
            <View>
              <TouchableOpacity
                style={styles.wallet}
                onPress={() => {
                  dispatch(
                    actionToggleModal({
                      data: <AccountModal onSelectAccount={(account) => {
                        setCurrentAccount(account);
                      }}
                      />,
                      visible: true,
                    }),
                  );
                }}
              >
                <Text style={[theme.text.mediumTextStyle]}>{currentAccount !== '' ? `${currentAccount?.name}` : 'Choose another wallet'}</Text>
                <View>
                  <Icon name="chevron-down" size={30} type="material-community" color={COLORS.primary} />
                </View>
              </TouchableOpacity>
            </View>
            <CurrentBalance
              balanceStyle={{ fontSize: 16, fontFamily: FONT.NAME.regular, marginTop: 3 }}
              tokenStyle={{ fontSize: FONT.SIZE.regular }}
              isNestedCurrentBalance
              containerStyle={{
                marginHorizontal: 0,
                paddingHorizontal: 0,
                justifyContent: 'flex-end',
                alignItems: 'flex-end',
              }}
              hideBalanceTitle
              select={
                (
                  <TokenCustomSelect iconStyle={{ width: 100, paddingLeft: 50, }} customListPToken={pTokenSupport} onSelect={handleSelectToken} />
                )
              }
            />
          </View>
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
          checkSelectedTokenIdAndUpdateDynamicPrice(pTokenSupport, pTokenSupportsPartner, tokenId);
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
          ref={emailRef}
          onSubmitEditing={() => { firstNameRef && firstNameRef?.current?.focus(); }}
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
          ref={firstNameRef}
          onSubmitEditing={() => { lastNameRef && lastNameRef?.current?.focus(); }}
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
          ref={lastNameRef}
          onSubmitEditing={() => { addressRef && addressRef?.current?.focus(); }}
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
          ref={addressRef}
          onSubmitEditing={() => { cityRef && cityRef?.current?.focus(); }}
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
          ref={cityRef}
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
          onChangeText={async (value) => {
            await setContactData({ ...contactData, country: value, region: '' });
            await setRegions([]);
            await changeRegionsDataAndSetCountryCode(value);
            getShippingFee();
          }}
        />
        <Dropdown
          label='State'
          data={regions}
          onChangeText={async (value) => {
            await setContactData({ ...contactData, region: value });
            await getShippingFee();
          }}
        />
        <TextField
          keyboardType='default'
          autoCapitalize='none'
          autoCorrect={false}
          enablesReturnKeyAutomatically
          onFocus={() => onFocusField()}
          onChangeText={async (text) => {
            await setContactData({ ...contactData, postalCode: text });
            await checkErrEmpty('postalCode', checkFieldEmpty(text));
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
    emailRef && emailRef?.current?.focus();
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
        title={showContactForShipping ? 'Complete your order' : 'Continue to payment'}
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
        style={theme.MARGIN.marginTopDefault}
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
    let subTotal = (price + shippingFee) * currentQuantity;
    let result = 0;
    for (let i = 0; i < pTokenSupport.length; i++) {
      if (currentTokenId === pTokenSupport[i]?.TokenID) {
        let priceUSD = pTokenSupport[i]?.PriceUsd;
        result = (subTotal / priceUSD).toFixed(4);
        break;
      }
    }
    return parseFloat(result);
  };

  const renderFloatingPriceView = () => {
    let subTotal = (price + shippingFee) * currentQuantity;
    let countableToken = getCountCoinPayable();
    return (
      <Animated.View style={[styles.header, theme.SHADOW.normal, { height: showContactForShipping ? headerHeight : 0 }]}>
        {showContactForShipping ? (
          <View style={styles.bar}>
            {renderTotalItem('Shipping', shippingFee === 0 ? 'FREE' : `$${shippingFee}`)}
            {renderTotalItem('Total', `$${subTotal.toFixed(2)}`, {}, theme.text.boldTextStyle)}
            {renderTotalItem(`Pay with ${symbol}`, `${countableToken} ${symbol}`, theme.text.boldTextStyle, theme.text.boldTextStyle)}
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
        <KeyboardAwareScrollView showsVerticalScrollIndicator={false} enableOnAndroid extraScrollHeight={50}>
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


const mapState = (state) => ({
  wallet: state.wallet,
  account: accountSeleclor.defaultAccount(state),
});

const mapDispatch = {
  setSelectedPrivacy,
};

export default connect(mapState, mapDispatch)(BuyNodeScreen);
