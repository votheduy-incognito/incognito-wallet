import React from 'react';
import {View, Text} from 'react-native';
import {TextInput} from '@src/shared/components/input';
import {Button} from '@src/components/core';
import PropTypes from 'prop-types';
import {COLORS} from '@src/styles';
import {styled} from './FrequentReceivers.styled';
import withForm from './FrequentReceivers.withForm';

const Form = props => {
  const {
    onSaveReceiver,
    inputName,
    toAddress,
    onChangeText,
    inputAddr,
    action,
  } = props;
  const isUpdate = action === 'update';
  return (
    <View style={styled.container}>
      <TextInput
        labelStyle={styled.label}
        containerStyled={styled.input}
        label="Name"
        autoFocus
        placeholder={'Type receiver\'s name'}
        value={inputName.value}
        validated={inputName.validated}
        onChangeText={onChangeText}
        maxLength={50}
      />
      <TextInput
        labelStyle={styled.label}
        containerStyled={styled.input}
        label="Address"
        value={toAddress}
        editable={false}
        validated={inputAddr.validated}
        style={{
          color: COLORS.lightGrey1,
        }}
      />
      <Button
        title={isUpdate ? 'Save changes' : 'Save to address book'}
        onPress={onSaveReceiver}
        style={{
          marginTop: 50,
        }}
      />
    </View>
  );
};

Form.propTypes = {
  onSaveReceiver: PropTypes.func.isRequired,
  inputName: PropTypes.shape({
    value: PropTypes.string.isRequired,
    validated: PropTypes.shape({
      error: PropTypes.bool.isRequired,
      message: PropTypes.string.isRequired,
    }),
  }).isRequired,
  inputAddr: PropTypes.shape({
    value: PropTypes.string.isRequired,
    validated: PropTypes.shape({
      error: PropTypes.bool.isRequired,
      message: PropTypes.string.isRequired,
    }),
  }).isRequired,
  saved: PropTypes.bool.isRequired,
  toAddress: PropTypes.string.isRequired,
  onChangeText: PropTypes.func.isRequired,
  action: PropTypes.string.isRequired,
};

export default withForm(Form);
