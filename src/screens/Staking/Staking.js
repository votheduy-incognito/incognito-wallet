import React, { Component } from 'react';
import PropTypes from 'prop-types';
import { Text, Container, Form, FormTextField, FormSubmitButton, Toast, ScrollView, PickerField, Picker } from '@src/components/core';
import { CONSTANT_COMMONS } from '@src/constants';
import formatUtil from '@src/utils/format';
import formValidate from './formValidate';
import styleSheet from './style';

const initialValues = {
  stakingType: CONSTANT_COMMONS.STAKING_TYPES.SHARD,
  toAddress: CONSTANT_COMMONS.STAKING_ADDRESS,
  fromAddress: '',
  amount: String(CONSTANT_COMMONS.STAKING_AMOUNT),
  fee: String(CONSTANT_COMMONS.STAKING_MIN_FEE)
};

const validator = formValidate({ minFee: CONSTANT_COMMONS.STAKING_MIN_FEE });

class Staking extends Component {
  constructor() {
    super();

    this.state = {
      initialFormValues: initialValues
    };
    this.form = null;
  }

  componentDidMount() {
    const { fromAddress } = this.props;
    this.updateFormValues('fromAddress', fromAddress);
  }

  updateFormValues = (field, value) => {
    if (this.form) {
      this.form.setFieldValue(field, value, true);
    }
  }

  goBack = () => {
    const { navigation } = this.props;
    navigation.pop();
  }

  handleStaking = (values) => {
    try {
      // TODO
      console.log(values);
      Toast.showInfo('Staking completed!');
      this.goBack();
    } catch (e) {
      Toast.showError(e.message);
    }
  };

  render() {
    const { balance } = this.props;
    const { initialFormValues } = this.state;

    return (
      <ScrollView>
        <Container style={styleSheet.container}>
          <Text style={styleSheet.title}>Staking</Text>
          <Text>
            Balance: { formatUtil.amount(balance) } {CONSTANT_COMMONS.CONST_SYMBOL}
          </Text>
          <Form formRef={form => this.form = form} initialValues={initialFormValues} onSubmit={this.handleStaking} viewProps={{ style: styleSheet.form }} validationSchema={validator}>
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
  }
}

Staking.defaultProps = {
  balance: 0,
  fromAddress: 'default_address'
};

Staking.propTypes = {
  balance: PropTypes.number,
  fromAddress: PropTypes.string,
  navigation: PropTypes.object.isRequired
};

export default Staking;