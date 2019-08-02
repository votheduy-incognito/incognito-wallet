import React, { Component } from 'react';
import PropTypes from 'prop-types';
import { Field } from 'redux-form';
import { createForm, InputField, InputQRField, validator } from '@src/components/core/reduxForm';
import { View, Button, ScrollView } from '@src/components/core';
import styles from './style';


const formName = 'addErc20Token';
const initialFormValues = {
  symbol: '',
  name: '',
  address: '',
  decimals: '0'
};
const Form = createForm(formName, {
  enableReinitialize: true,
  keepDirtyOnReinitialize: true,
});

class AddERC20Token extends Component {
  constructor(props) {
    super(props);
    this.state = {
      erc20Data: initialFormValues,
    };
  }

  static getDerivedStateFromProps(nextProps, prevState) {
    if (nextProps?.erc20Data !== prevState.erc20Data) {
      return {
        erc20Data: nextProps?.erc20Data ? {
          ...nextProps?.erc20Data,
          decimals: nextProps?.erc20Data?.decimals ? String(nextProps?.erc20Data?.decimals) : '0'
        } : null
      };
    }
    return null;
  }

  handleFormChange = (values, dispatch, props, previousValues) => {
    const { address } = values;
    const { address: oldAddress } = previousValues;

    if (address !== oldAddress) {
      this.handleSearchByAddress(address);
    }
  }

  handleSearchByAddress = address => {
    const { onSearch } = this.props;
    onSearch({ address });
  }

  handleAdd = values => {
    if (!values) return;

    const { name, symbol, address, decimals } = values;
    const { onAddErc20Token } = this.props;
    return onAddErc20Token({
      name,
      symbol,
      contractId: address,
      decimals
    });
  }

  render() {
    const { erc20Data } = this.state;
    const { isSearching } = this.props;

    return (
      <Form initialValues={erc20Data} onChange={this.handleFormChange} style={styles.container}>
        {({ handleSubmit, submitting }) => (
          <>
            <ScrollView style={styles.fields}>
              <Field
                component={InputQRField}
                name='address'
                label='Address'
                placeholder='Search by ERC20 Address'
                style={styles.input}
                validate={validator.required}
              />
              <Field
                component={InputField}
                name='symbol'
                label='Symbol'
                placeholder='Search by Symbol'
                style={styles.input}
                validate={validator.required}
              />
              <Field
                component={InputField}
                name='name'
                label='Name'
                placeholder='Name'
                style={styles.input}
                validate={validator.required}
                componentProps={{
                  editable: false
                }}
              />
              <Field
                component={InputField}
                name='decimals'
                label='Decimals'
                placeholder='Decimals'
                style={styles.input}
                componentProps={{
                  editable: false
                }}
                validate={[validator.required, validator.number]}
              />
            </ScrollView>
            <Button
              title='Add'
              style={styles.submitBtn}
              onPress={handleSubmit(this.handleAdd)}
              isAsync
              isLoading={isSearching || submitting}
            />
          </>
        )}
      </Form>
    );
  }
}

AddERC20Token.defaultProps = {
  isSearching: false
};

AddERC20Token.propTypes = {
  onAddErc20Token: PropTypes.func.isRequired,
  onSearch: PropTypes.func.isRequired,
  isSearching: PropTypes.bool,
};


export default AddERC20Token;