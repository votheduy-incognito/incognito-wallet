import React from 'react';
import {View, StyleSheet, Text} from 'react-native';
import {
  InputQRField,
  validator,
  createForm,
} from '@src/components/core/reduxForm';
import {Field} from 'redux-form';
import {Button} from '@src/components/core';
import PropTypes from 'prop-types';
import {FONT, COLORS} from '@src/styles';
import withRecoverAccount from './withRecoverAccount';

const styled = StyleSheet.create({
  container: {
    flex: 1,
    padding: 20,
  },
  desc: {
    marginVertical: 40,
    fontFamily: FONT.NAME.regular,
    fontSize: FONT.SIZE.regular,
    lineHeight: FONT.SIZE.regular + 6,
    textAlign: 'center',
    color: COLORS.black,
  },
});

const formName = 'importAccountPStake';
const Form = createForm(formName);
const isRequired = validator.required();

const RecoverAccount = props => {
  const {handleImportAccount} = props;
  return (
    <View style={styled.container}>
      <Form>
        {({handleSubmit, submitting}) => (
          <View style={styled.form}>
            <Field
              component={InputQRField}
              name="privateKey"
              placeholder="Enter Private Key"
              label="Private Key"
              validate={[isRequired]}
              autoFocus
            />
            <Text style={styled.desc}>
              Your current pStake account will be replaced after you
              successfully recover your old pStake account.
            </Text>
            <Button
              title="Recover"
              style={styled.submitBtn}
              onPress={handleSubmit(handleImportAccount)}
              isAsync
              isLoading={submitting}
            />
          </View>
        )}
      </Form>
    </View>
  );
};

RecoverAccount.propTypes = {
  handleImportAccount: PropTypes.func.isRequired,
};

export default withRecoverAccount(RecoverAccount);
