import React, { useEffect, useState } from 'react';
import { View, Text, BaseTextInput, TouchableOpacity, RoundCornerButton } from '@src/components/core';
import Header from '@src/components/Header';
import theme from '@src/styles/theme';
import { checkEmailValid, checkFieldEmpty } from '@src/utils/validator';
import { KeyboardAwareScrollView } from 'react-native-keyboard-aware-scroll-view';
import { useNavigationParam } from 'react-navigation-hooks';
import { COLORS } from '@src/styles';
import { Row, Select } from '@src/components';
import NavigationService from '@services/NavigationService';
import routeNames from '@routers/routeNames';
import AntDesign from 'react-native-vector-icons/AntDesign';
import styles from './style';

const EMAIL = 'email';
const dataCountry = require('../../assets/rawdata/country.json');

const DestinationBuyNode = () => {
  const data = useNavigationParam('data');

  const [countryList, setcountryList] = useState([]);
  const [regions, setRegions] = useState([]);
  const [contactData, setContactData] = useState(data || {});

  const [errTf, setErrTF] = useState({});
  const updateAddressF = useNavigationParam('updateAddressF');

  useEffect(() => {
    const list = [];
    dataCountry?.forEach(county => list.push(county.value));
    setcountryList(list);
  }, []);

  const updateRegionByCountryName = (countryValue) => {
    for (let i = 0; i < dataCountry.length; i++) {
      if (dataCountry[i].value === countryValue) {
        const region = dataCountry[i].regions;
        setRegions(region.map(item => item.value));
        setContactData({ ...contactData, country: countryValue, countryCode: dataCountry[i].countryShortCode, region: region[0].value });
      }
    }
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

  const handleChangeEmail = (newEmail) => {
    setContactData({ ...contactData, email: newEmail });
    checkErrEmail(checkEmailValid(newEmail).valid);
  };

  const handleChangeText = (newText, label) => {
    setContactData({ ...contactData, [label]: newText });
    checkErrEmpty(label, checkFieldEmpty(newText));
  };

  const handleChangeCountry = (newCountry) => {
    setContactData({ ...contactData, country: newCountry, region: '' });
    updateRegionByCountryName(newCountry);
  };

  const handleChangeState = (state) => {
    setContactData({ ...contactData, region: state });
  };

  const renderFieldAndError = (label, placeholder, onChange, keyboardType = 'default', autoCapitalize = 'words') => {
    return (
      <View style={styles.field}>
        <BaseTextInput
          keyboardType={keyboardType}
          placeholder={placeholder}
          onChangeText={(text) => onChange(text, label)}
          value={contactData[label]}
          style={[styles.input, !contactData[label] && styles.placeholder]}
          placeholderTextColor={COLORS.newGrey}
          autoCapitalize={autoCapitalize}
        />
        {!!errTf[label] && <Text style={styles.error}>{errTf[label]}</Text>}
      </View>
    );
  };

  const renderContactInformation = () => {
    return (
      <View
        style={styles.content}
      >
        <View style={[styles.field, { marginBottom: 40 }]}>
          <Select
            items={countryList}
            onSelect={handleChangeCountry}
            item={contactData?.country}
            placeholder="Search country"
            textPlaceholder="Country"
          />
          {!!errTf.country && <Text style={styles.error}>{errTf.country}</Text>}
        </View>
        <View style={[styles.field, { marginBottom: 35 }]}>
          <Select
            items={regions}
            onSelect={handleChangeState}
            item={contactData?.region}
            placeholder="Search state"
            textPlaceholder="State"
          />
          {errTf.region && <Text style={styles.error}>{errTf.region}</Text>}
        </View>
        {renderFieldAndError('city', 'City', handleChangeText)}
        {renderFieldAndError('address', 'Address', handleChangeText)}
        {renderFieldAndError('postalCode', 'Postcode', handleChangeText, 'numeric')}
        {renderFieldAndError('firstName', 'First name', handleChangeText)}
        {renderFieldAndError('lastName', 'Last name', handleChangeText)}
        {renderFieldAndError('email', 'Email address', handleChangeEmail, 'default', 'none')}
        {contactData.countryCode !== 'US' && renderFieldAndError('phone', 'Phone', handleChangeText, 'numeric')}
      </View>
    );
  };

  // Disable button process for better behavior
  const shouldDisableButtonProcess = () => {
    return (!contactData.email ||
      !contactData.firstName ||
      !contactData.address ||
      !contactData.lastName ||
      !contactData.address ||
      !contactData.country ||
      !contactData.postalCode ||
      (contactData.countryCode !== 'US' && !contactData.phone));
  };

  return (
    <View style={styles.container}>
      <Header title="Destination" />
      <KeyboardAwareScrollView extraScrollHeight={100} extraHeight={50} keyboardShouldPersistTaps="handled" showsVerticalScrollIndicator={false} contentContainerStyle={{paddingBottom: 50}}>
        {renderContactInformation()}
        <RoundCornerButton
          title="Add destination"
          onPress={() => updateAddressF(contactData)}
          style={[theme.MARGIN.marginTopDefault, theme.BUTTON.BLACK_TYPE, { marginTop: 30 }]}
          disabled={shouldDisableButtonProcess()}
        />
        <TouchableOpacity onPress={() => NavigationService.navigate(routeNames.NodeReturnPolicy)}>
          <Row spaceBetween center style={{ marginTop: 30 }}>
            <Text style={theme.text.greyTextBoldMediumSize}>Returns & warranty policy</Text>
            <AntDesign name="right" size={18} color={COLORS.newGrey} />
          </Row>
        </TouchableOpacity>
      </KeyboardAwareScrollView>
    </View>
  );
};

export default DestinationBuyNode;
