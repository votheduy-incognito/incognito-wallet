import React from 'react';
import PropTypes from 'prop-types';
import { Text, Container, Form, FormTextField, FormSubmitButton, Toast, ScrollView, PickerField, Picker } from '@src/components/core';
import { CONSTANT_COMMONS } from '@src/constants';
import formatUtil from '@src/utils/format';
import formValidate from './formValidate';
import styleSheet from './style';

const initialFormValues = {
  stakingType: CONSTANT_COMMONS.STAKING_TYPES.SHARD,
  toAddress: CONSTANT_COMMONS.STAKING_ADDRESS,
  amount: String(CONSTANT_COMMONS.STAKING_AMOUNT),
  fee: String(0.2)
};

const Staking = ({ balance }) => {
  const handleStaking = (values) => {
    try {
      // TODO
      console.log(values);
    } catch (e) {
      Toast.showError(e.message);
    }
  };

  return (
    <ScrollView>
      <Container style={styleSheet.container}>
        <Text style={styleSheet.title}>Staking</Text>
        <Text>
          Balance: { formatUtil.amount(balance) } {CONSTANT_COMMONS.CONST_SYMBOL}
        </Text>
        <Form initialValues={initialFormValues} onSubmit={handleStaking} viewProps={{ style: styleSheet.form }} validationSchema={formValidate}>
          <FormTextField name='fromAddress' placeholder='From Address' editable={false} />
          <PickerField name='stakingType'>
            <Picker.Item label="Shard Type" value={CONSTANT_COMMONS.STAKING_TYPES.SHARD} />
            <Picker.Item label="Beacon Type" value={CONSTANT_COMMONS.STAKING_TYPES.BEACON} />
          </PickerField>
          <FormTextField name='toAddress' placeholder='To Address' editable={false} />
          <FormTextField name='amount' placeholder='Amount' editable={false} />
          <FormTextField name='fee' placeholder='Min Fee' />
          <FormSubmitButton title='STAKING' style={styleSheet.submitBtn} />
        </Form>
        <Text style={styleSheet.noteText}>* Only send CONSTANT to a CONSTANT address.</Text>
      </Container>
    </ScrollView>
  );
};

Staking.defaultProps = {
  balance: 0
};

Staking.propTypes = {
  balance: PropTypes.number
};

export default Staking;