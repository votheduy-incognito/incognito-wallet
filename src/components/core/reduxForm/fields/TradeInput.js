import React from 'react';
import { TextInput, View, StyleSheet, Text } from 'react-native';
import PropTypes from 'prop-types';
import { COLORS, FONT } from '@src/styles';
import { ArrowRightGreyIcon } from '@src/components/Icons';
import { BtnInfinite } from '@src/components/Button';
import { useNavigation } from 'react-navigation-hooks';
import routeNames from '@src/router/routeNames';
import createField from './createField';
import TouchableOpacity from '../../TouchableOpacity';
import ActivityIndicator from '../../ActivityIndicator';

const styled = StyleSheet.create({
  container: {
    flexDirection: 'row',
    marginVertical: 15,
    justifyContent: 'space-between',
  },
  text: {
    fontFamily: FONT.NAME.bold,
    fontSize: 25,
    lineHeight: 30,
    color: COLORS.black,
  },
  icon: {
    width: 12,
    height: 16,
    marginLeft: 10,
  },
  right: {
    alignItems: 'center',
    flexDirection: 'row',
  },
  btnSelectToken: {
    flexDirection: 'row',
    alignItems: 'center',
  },
  left: {
    maxWidth: '60%',
    flex: 1,
  },
  btnMax: {
    marginHorizontal: 15,
  },
  inpuText: {
    flex: 1,
  },
});

const renderCustomField = (props) => {
  const navigation = useNavigation();
  const {
    input,
    maxValue,
    token,
    hanldePressMax,
    onSelectToken,
    tokens,
    loading,
    ...rest
  } = props;
  const { onChange, onBlur, onFocus, value } = input;
  const showSelectTokenScreen = () => {
    navigation.navigate(routeNames.TokenSelectScreen, {
      onSelectToken,
      tokens,
      placeholder: 'Search coins',
    });
  };
  return (
    <View style={[styled.container]}>
      <View style={styled.left}>
        <TextInput
          onChangeText={(t) => onChange(t)}
          onBlur={onBlur}
          onFocus={onFocus}
          defaultValue={value}
          style={[styled.text, styled.inpuText]}
          placeholderTextColor={COLORS.colorGreyBold}
          {...rest}
        />
      </View>
      <View style={styled.right}>
        {!!loading && <ActivityIndicator style={styled.btnMax} />}
        {!loading && !!maxValue && (
          <BtnInfinite
            style={styled.btnMax}
            onPress={typeof hanldePressMax === 'function' && hanldePressMax}
          />
        )}
        <TouchableOpacity
          style={styled.btnSelectToken}
          onPress={showSelectTokenScreen}
        >
          <Text style={styled.text}>{token?.symbol || ''}</Text>
          <ArrowRightGreyIcon style={styled.icon} />
        </TouchableOpacity>
      </View>
    </View>
  );
};

const TradeInputField = createField({
  fieldName: 'TradeInputField',
  render: renderCustomField,
});

renderCustomField.defaultProps = {
  hanldePressMax: null,
  onSelectToken: null,
  loading: false,
};

renderCustomField.propTypes = {
  input: PropTypes.any.isRequired,
  maxValue: PropTypes.string.isRequired,
  token: PropTypes.object.isRequired,
  hanldePressMax: PropTypes.func,
  onSelectToken: PropTypes.func,
  tokens: PropTypes.array.isRequired,
  loading: PropTypes.bool,
};

export default TradeInputField;
