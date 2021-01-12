import React, { memo } from 'react';
import { View } from 'react-native';
import PropTypes from 'prop-types';
import { ArrowRightGreyIcon } from '@components/Icons';
import stylesheet from '@screens/DexV2/components/NewInput/style';
import ROUTE_NAMES from '@routers/routeNames';
import { useNavigation } from 'react-navigation-hooks';
import Input from '@screens/DexV2/components/NewInput/Input';
import { ActivityIndicator, Text, TouchableOpacity } from '@components/core';
import { BtnInfinite } from '@components/Button';
import convertUtil from '@utils/convert';

const RightIcon = () => <ArrowRightGreyIcon style={stylesheet.icon} />;

const TradeInputAmountEditor = ({
  token,
  onSelectToken,
  onChange,
  value,
  tokens,
  disabled,
  loading,
  placeholder,
  maxValue,
  disableChooseToken,
}) => {

  const navigation = useNavigation();

  const renderTextInput = () => (
    <Input
      style={{ flex: 1, alignItems: 'stretch', paddingRight: 10 }}
      onChange={onChange}
      value={value}
      disabled={disabled}
      placeholder={placeholder}
    />
  );

  const showSelectTokenScreen = () => {
    if (disableChooseToken) return;
    navigation.navigate(ROUTE_NAMES.TokenSelectScreen, {
      onSelectToken,
      tokens,
      placeholder: 'Search coins',
    });
  };

  const renderButtonInfinite = () => {
    if (!!loading || !maxValue) return null;
    return (
      <View style={{ justifyContent: 'center', alignItems: 'center' }}>
        <BtnInfinite onPress={() => onChange(convertUtil.toInput(maxValue))} />
      </View>
    );
  };

  const renderLoading = () => {
    if (!loading) return null;
    return (<ActivityIndicator />);
  };

  const renderToken = () => (
    <TouchableOpacity
      onPress={showSelectTokenScreen}
      style={stylesheet.centerJustify}
    >
      {token ? (
        <View style={stylesheet.token}>
          <Text style={stylesheet.bigText} isVerified={token.isVerified}>
            {token.symbol}
          </Text>
          <RightIcon />
        </View>
      ) : <RightIcon />}
    </TouchableOpacity>
  );

  return (
    <View style={[stylesheet.wrapper, stylesheet.row, stylesheet.justifyBetween]}>
      {renderTextInput()}
      <View style={{ marginRight: 15, alignSelf: 'center' }}>
        {renderLoading()}
        {renderButtonInfinite()}
      </View>
      {renderToken()}
    </View>
  );
};

TradeInputAmountEditor.defaultProps = {
  token: null,
  value: undefined,
  onChange: undefined,
  disabled: false,
  loading: false,
  maxValue: undefined,
  placeholder: '',
};

TradeInputAmountEditor.propTypes = {
  token: PropTypes.object,
  value: PropTypes.oneOfType([PropTypes.number, PropTypes.string]),
  tokens: PropTypes.array.isRequired,
  onSelectToken: PropTypes.func.isRequired,
  onChange: PropTypes.func,
  disabled: PropTypes.bool,
  loading: PropTypes.bool,
  maxValue: PropTypes.string,
  placeholder: PropTypes.string,
  disableChooseToken: PropTypes.bool.isRequired

};

export default memo(TradeInputAmountEditor);