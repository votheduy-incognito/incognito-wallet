/* eslint-disable import/no-cycle */
import React from 'react';
import { View, StyleSheet } from 'react-native';
import PropTypes from 'prop-types';
import Header from '@src/components/Header';
import { Field } from 'redux-form';
import {
  InputField,
  validator,
  createForm,
} from '@src/components/core/reduxForm';
import { ButtonBasic } from '@src/components/Button';
import Icons from 'react-native-vector-icons/Fontisto';
import { TouchableOpacity } from '@src/components/core';
import { useNavigation } from 'react-navigation-hooks';
import routeNames from '@src/router/routeNames';
import { CONSTANT_COMMONS } from '@src/constants';
import { useSelector } from 'react-redux';
import { selectedReceiverSelector } from '@src/redux/selectors/receivers';
import withForm from './FrequentReceivers.withForm';

const styled = StyleSheet.create({
  container: {
    flex: 1,
  },
  form: {
    flex: 1,
    marginTop: 15,
  },
  submitBtn: {
    marginTop: 50,
  },
  btnAngleRight: {
    justifyContent: 'center',
  },
});

export const formName = 'formFrequentReceivers';

const isRequired = validator.required();

const FormDt = createForm(formName);

const Hook = () => {
  const { rootNetworkName } = useSelector(selectedReceiverSelector);
  const isETHNetwork =
    rootNetworkName === CONSTANT_COMMONS.NETWORK_NAME.ETHEREUM ||
    rootNetworkName === CONSTANT_COMMONS.NETWORK_NAME.TOMO;
  const navigation = useNavigation();
  const handleChooseTypeNetwork = () =>
    navigation.navigate(routeNames.SelectNetworkName);
  if (!isETHNetwork) {
    return null;
  }
  return (
    <TouchableOpacity
      onPress={handleChooseTypeNetwork}
      style={styled.btnAngleRight}
    >
      <Icons name="angle-right" style={styled.angleRight} size={16} />
    </TouchableOpacity>
  );
};

const Form = (props) => {
  const {
    headerTitle,
    titleBtnSubmit,
    onSaveReceiver,
    disabledBtn,
    shouldShowNetwork,
  } = props;
  return (
    <View style={styled.container}>
      <Header title={headerTitle} />
      <FormDt style={styled.form}>
        {({ handleSubmit }) => (
          <View>
            <Field
              componentProps={{
                style: {
                  marginTop: 0,
                },
              }}
              component={InputField}
              placeholder="Name"
              name="name"
              label="Name"
              validate={isRequired}
              maxLength={50}
            />
            <Field
              component={InputField}
              label="Address"
              name="address"
              placeholder="Address"
              validate={isRequired}
              componentProps={{
                canEditable: false,
              }}
            />
            {shouldShowNetwork && (
              <Field
                component={InputField}
                label="Network"
                name="networkName"
                componentProps={{
                  canEditable: false,
                }}
                prependView={<Hook />}
              />
            )}
            <ButtonBasic
              title={titleBtnSubmit}
              btnStyle={styled.submitBtn}
              onPress={handleSubmit(onSaveReceiver)}
              disabled={disabledBtn}
            />
          </View>
        )}
      </FormDt>
    </View>
  );
};

Form.propTypes = {
  headerTitle: PropTypes.string.isRequired,
  onSaveReceiver: PropTypes.func.isRequired,
  disabledBtn: PropTypes.bool.isRequired,
  titleBtnSubmit: PropTypes.string.isRequired,
  shouldShowNetwork: PropTypes.bool.isRequired,
};

export default withForm(Form);
