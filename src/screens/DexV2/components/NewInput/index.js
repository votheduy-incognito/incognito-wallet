import React from 'react';
import PropTypes from 'prop-types';
import { View, Text, TouchableOpacity } from '@src/components/core';
import { useNavigation } from 'react-navigation-hooks';
import ROUTE_NAMES from '@routers/routeNames';
import { Icon } from 'react-native-elements';
import { COLORS } from '@src/styles';
import Input from './Input';
import stylesheet from './style';

const RightIcon = () => <Icon name="chevron-right" color={COLORS.lightGrey1} size={36} />;

const InputContainer = (props) => {
  const navigation = useNavigation();

  const { token, onSelectToken, onChange, value, tokens, disabled } = props;
  const showSelectTokenScreen = () => {
    navigation.navigate(ROUTE_NAMES.TokenSelectScreen, {
      onSelectToken,
      tokens,
      placeholder: onChange ? 'Select token to sell' : 'Select token to buy',
    });
  };

  return (
    <View style={stylesheet.wrapper}>
      <View style={[stylesheet.row, stylesheet.justifyBetween]}>
        {onChange ? <Input
          onChange={onChange}
          value={value}
          disabled={disabled}
        /> : (
          <Text numberOfLines={1} style={[stylesheet.bigText, stylesheet.inputContainer]}>
            {value}
          </Text>
        )}
        <TouchableOpacity onPress={showSelectTokenScreen} style={stylesheet.centerJustify}>
          {token ? (
            <View style={stylesheet.token}>
              <Text style={stylesheet.bigText} isVerified={token.isVerified}>
                {token.symbol}
              </Text>
              <RightIcon />
            </View>
          ) : <RightIcon />}
        </TouchableOpacity>
      </View>
    </View>
  );
};


InputContainer.defaultProps = {
  token: null,
  value: undefined,
  onChange: undefined,
  disabled: false,
};

InputContainer.propTypes = {
  token: PropTypes.object,
  value: PropTypes.oneOfType([PropTypes.number, PropTypes.string]),
  tokens: PropTypes.array.isRequired,
  onSelectToken: PropTypes.func.isRequired,
  onChange: PropTypes.func,
  disabled: PropTypes.bool,
};

export default InputContainer;
