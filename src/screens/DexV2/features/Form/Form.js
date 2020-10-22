/* eslint-disable import/no-cycle */
import {
  Divider,
  RoundCornerButton,
  TouchableOpacity,
  Text,
} from '@src/components/core';
// import { createForm, TradeInputField } from '@src/components/core/reduxForm';
import createForm from '@components/core/reduxForm/createForm';
import TradeInputField from '@components/core/reduxForm/fields/TradeInput';
import React from 'react';
import { View, Image } from 'react-native';
import { useDispatch, useSelector } from 'react-redux';
import { Field } from 'redux-form';
import downArrow from '@assets/images/icons/circle_arrow_down.png';
import PropTypes from 'prop-types';
import { useNavigation } from 'react-navigation-hooks';
import { pairsSelector } from '@screens/DexV2/features/Pairs';
import {
  tradeSelector,
  actionSetInputToken,
  actionSetOutputToken,
} from '@screens/DexV2/features/Trade';
import routeNames from '@src/router/routeNames';
import convertUtil from '@utils/convert';
import { styled } from './Form.styled';
import withFormTrade from './Form.enhance';

export const formName = 'formTrade';

const initialFormValues = {
  input: '',
  output: '',
};

const Form = createForm(formName, {
  initialValues: initialFormValues,
  destroyOnUnmount: true,
  enableReinitialize: true,
});

const Hook = React.memo((props) => {
  const { onSwapTokens } = props;
  return (
    <View style={styled.arrowWrapper}>
      <Divider style={styled.divider} />
      <TouchableOpacity onPress={onSwapTokens}>
        <Image source={downArrow} style={styled.arrow} />
      </TouchableOpacity>
      <Divider style={styled.divider} />
    </View>
  );
});

const FormTrade = (props) => {
  const { onChangeField, onSwapTokens, onChangeInputText } = props;
  const trade = useSelector(tradeSelector);
  const pairs = useSelector(pairsSelector)?.data;
  const { pairTokens } = pairs;
  const dispatch = useDispatch();
  const {
    inputToken,
    outputToken,
    inputBalanceText,
    outputList,
    error,
    disabledForm,
    disabledInput,
    disabledOutput,
    loadingInput,
    loadingOutput,
  } = trade;
  const navigation = useNavigation();
  const onChangeInputToken = (token) => dispatch(actionSetInputToken(token));
  const onChangeOutputToken = (token) => dispatch(actionSetOutputToken(token));
  const onNavTradeConfirm = () =>
    navigation.navigate(routeNames.TradeConfirm, {
      ...trade,
    });
  return (
    <Form>
      {({ handleSubmit }) => (
        <>
          <Field
            onChange={onChangeInputText}
            component={TradeInputField}
            name="input"
            componentProps={{
              keyboardType: 'decimal-pad',
              hanldePressMax: () =>
                onChangeField(convertUtil.toInput(inputBalanceText), 'input'),
              placeholder: '0',
              token: inputToken,
              maxValue: inputBalanceText,
              tokens: pairTokens,
              onSelectToken: onChangeInputToken,
              loading: loadingInput,
              disabled: disabledInput,
            }}
          />
          <Text style={styled.error}>{error}</Text>
          <Hook onSwapTokens={onSwapTokens} />
          <Field
            component={TradeInputField}
            name="output"
            componentProps={{
              editable: false,
              placeholder: '0',
              token: outputToken,
              tokens: outputList,
              onSelectToken: onChangeOutputToken,
              disabled: disabledOutput,
              loading: loadingOutput,
            }}
          />
          <RoundCornerButton
            style={styled.btnPreview}
            title="Preview your order"
            onPress={onNavTradeConfirm}
            disabled={disabledForm}
          />
        </>
      )}
    </Form>
  );
};

FormTrade.propTypes = {
  onSwapTokens: PropTypes.func.isRequired,
  onChangeField: PropTypes.func.isRequired,
  onChangeInputText: PropTypes.func.isRequired,
};

Hook.propTypes = {
  onSwapTokens: PropTypes.func.isRequired,
};

export default withFormTrade(FormTrade);
