import React from 'react';
import PropTypes from 'prop-types';
import { Container, ScrollView, Form, FormSubmitButton, FormTextField, TouchableOpacity, ActivityIndicator, Text } from '@src/components/core';
import MaterialCommunityIcons from 'react-native-vector-icons/MaterialCommunityIcons';
import { openQrScanner } from '@src/components/QrCodeScanner';
import { homeStyle } from './style';
import formValidate from './formValidate';

const initialFormValues = {
  amount: '1',
  fee: '0.5',
  toAdress: ''
};

class SendCrypto extends React.Component {
  constructor() {
    super();
    this.state = {
    };
    this.form = null;
  }

  handleQrScanAddress = () => {
    openQrScanner(data => {
      this.updateFormValues('toAddress', data);
    });
  }

  updateFormValues = (field, value) => {
    if (this.form) {
      this.form.setFieldValue(field, value, true);
    }
  }

  handleShouldGetFee = async () => {
    const { errors, values } = this.form;

    if (errors?.amount || errors?.toAddress){
      return;
    }

    const { amount, toAddress } = values;

    if (amount && toAddress){
      const { handleEstimateFee } = this.props;
      handleEstimateFee(values);
    }
  }

  render() {
    const { handleSend, isGettingFee, minFee } = this.props;

    return (
      <ScrollView style={homeStyle.container}>
        <Container style={homeStyle.mainContainer}>
          <Form
            formRef={form => this.form = form}
            initialValues={initialFormValues}
            onSubmit={handleSend}
            viewProps={{ style: homeStyle.form }}
            validationSchema={formValidate}
            validate={this.onFormValidate}
          >
            <FormTextField
              name='toAddress'
              placeholder='To Address'
              onFieldChange={this.handleShouldGetFee}
              prependView={(
                <TouchableOpacity onPress={this.handleQrScanAddress}>
                  <MaterialCommunityIcons name='qrcode-scan' size={20} />
                </TouchableOpacity>
              )}
            />
            <FormTextField name='amount' placeholder='Amount' onFieldChange={this.handleShouldGetFee} />
            <FormSubmitButton title='SEND' style={homeStyle.submitBtn} />
          </Form>
          {isGettingFee && <ActivityIndicator />}
          {minFee > 0 && <Text>Min fee: {minFee}</Text>}
        </Container>
      </ScrollView>
    );
  }
}

SendCrypto.propTypes = {
  selectedPrivacy: PropTypes.object.isRequired
};

export default SendCrypto;
