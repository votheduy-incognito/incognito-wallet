import React, { Component } from 'react';
import PropTypes from 'prop-types';
import { Text, Container, Form, FormTextField, FormSubmitButton, Toast, ScrollView, CheckBoxField } from '@src/components/core';
import { CONSTANT_COMMONS } from '@src/constants';
import formatUtil from '@src/utils/format';
import formValidate from './formValidate';
import styleSheet from './style';

const initialValues = {
  fromAddress: '',
  isPrivacy: CONSTANT_COMMONS.DEFRAGMENT_SET_DEFAULT_PRIVACY,
  amount: String(CONSTANT_COMMONS.DEFRAGMENT_DEFAULT_AMOUNT),
  fee: String(CONSTANT_COMMONS.DEFRAGMENT_MIN_FEE)
};

const validator = formValidate({ minFee: CONSTANT_COMMONS.DEFRAGMENT_MIN_FEE });

class Defragment extends Component {
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

  handleDefragment = (values) => {
    try {

      // Account.defragment()
      // TODO
      console.log(values);
      Toast.showInfo('Defragment completed!');
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
          <Text style={styleSheet.title}>Defragment</Text>
          <Text>
            Balance: { formatUtil.amountConstant(balance) } {CONSTANT_COMMONS.CONST_SYMBOL}
          </Text>
          <Form formRef={form => this.form = form} initialValues={initialFormValues} onSubmit={this.handleDefragment} viewProps={{ style: styleSheet.form }} validationSchema={validator}>
            <FormTextField name='fromAddress' placeholder='From Address' editable={false} />
            <CheckBoxField name='isPrivacy' label='Is Privacy' />
            <FormTextField name='amount' placeholder='Amount' />
            <FormTextField name='fee' placeholder='Min Fee' />
            <FormSubmitButton title='DEFRAGMENT' style={styleSheet.submitBtn} />
          </Form>
          <Text style={styleSheet.noteText}>* Only send CONSTANT to a CONSTANT address.</Text>
        </Container>
      </ScrollView>
    );
  }
}

Defragment.defaultProps = {
  balance: 0,
  fromAddress: 'default_address'
};

Defragment.propTypes = {
  balance: PropTypes.number,
  fromAddress: PropTypes.string,
  navigation: PropTypes.object.isRequired
};

export default Defragment;