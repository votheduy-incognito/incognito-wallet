import React from 'react';
import PropTypes from 'prop-types';
import { connect } from 'react-redux';
import { Container, ScrollView, View, Toast, Text, Button } from '@src/components/core';
import { Field, formValueSelector, destroy } from 'redux-form';
import { createForm, InputField, validator } from '@src/components/core/reduxForm';
import WaitingDeposit from './WaitingDeposit';
import style from './style';

const formName = 'deposit';
const selector = formValueSelector(formName);
const Form = createForm(formName, { destroyOnUnmount: false });
const isRequired = validator.required();

class Deposit extends React.Component {
  constructor() {
    super();
  }

  componentWillUnmount() {
    const { destroy } = this.props;
    destroy(formName);
  }

  handleSubmit = () => {
    const { handleGenAddress, amount } = this.props;

    return handleGenAddress(amount)
      .catch(() => {
        Toast.showError('Something went wrong. Please try again.');
      });
  }

  render() {
    const { depositAddress, selectedPrivacy, amount } = this.props;

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
                      <Text style={style.desc}>Please enter the amount you would like to deposit to your wallet.</Text>
                      <Field
                        component={InputField}
                        name='amount'
                        placeholder='0.0'
                        label='Amount'
                        validate={[
                          isRequired,
                          ...validator.combinedAmount
                        ]}
                        componentProps={{
                          keyboardType: 'decimal-pad'
                        }}
                        prependView={
                          <Text>{selectedPrivacy?.externalSymbol}</Text>
                        }
                      />
                      <Button
                        title='Continue'
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
  amount: null,
};

Deposit.propTypes = {
  depositAddress: PropTypes.string,
  selectedPrivacy: PropTypes.object,
  handleGenAddress: PropTypes.func.isRequired,
  destroy: PropTypes.func.isRequired,
  amount: PropTypes.oneOfType([ PropTypes.number, PropTypes.string ]),
};

const mapState = state => ({
  amount: selector(state, 'amount'),
});

const mapDispatch = { destroy };

export default connect(mapState, mapDispatch)(Deposit);
