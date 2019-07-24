import React from 'react';
import PropTypes from 'prop-types';
import { Container, ScrollView, View, Toast, Button } from '@src/components/core';
import { Field } from 'redux-form';
import { createForm, InputField, validator } from '@src/components/core/reduxForm';
import { getErrorMessage } from '@src/services/errorHandler';
import WaitingDeposit from './WaitingDeposit';
import style from './style';

const formName = 'deposit';
const Form = createForm(formName);

class Deposit extends React.Component {
  constructor() {
    super();

    this.form = { values: {} };
  }
  handleSubmit = values => {
    const { handleGenAddress } = this.props;
    const { amount } = values;

    return handleGenAddress(amount)
      .catch(e => {
        Toast.showError(getErrorMessage(e));
      });
  }

  render() {
    const { depositAddress, selectedPrivacy } = this.props;
    const { values: { amount } } = this.form;

    return (
      <ScrollView style={style.container}>
        <Container style={style.mainContainer}>
          {
            depositAddress
              ? <WaitingDeposit selectedPrivacy={selectedPrivacy} depositAddress={depositAddress} amount={amount} />
              : (
                <Form>
                  {({ handleSubmit, submitting }) => (
                    <View style={style.form}>
                      <Field
                        component={InputField}
                        name='amount'
                        placeholder='Amount'
                        label='Amount'
                        validate={[validator.required, ...validator.combinedAmount]}
                      />
                      <Button
                        title='CONTINUE'
                        style={style.submitBtn}
                        onPress={handleSubmit(this.handleSubmit)}
                        isAsync
                        isLoading={submitting}
                      />
                    </View>
                  )}
                </Form>
              )
          }
        </Container>
      </ScrollView>
    );
  }
}

Deposit.defaultProps = {
  depositAddress: null,
  selectedPrivacy: null,
};

Deposit.propTypes = {
  depositAddress: PropTypes.string,
  selectedPrivacy: PropTypes.object,
  handleGenAddress: PropTypes.func.isRequired,
};

export default Deposit;
