import React, { Component } from 'react';
import PropTypes from 'prop-types';
import { Field } from 'redux-form';
import { createForm, InputField, InputQRField, SelectField, validator } from '@src/components/core/reduxForm';
import { Button, View } from '@src/components/core';
import { Picker } from 'react-native';
import styles from './style';


const formName = 'addErc20Token';
const initialFormValues = {
  symbol: '',
  name: '',
  address: '',
  decimals: '0',
  'bep2-name': '1',
};
const Form = createForm(formName, {
  enableReinitialize: true,
  keepDirtyOnReinitialize: true,
});
const isRequired = validator.required();
const isNumber = validator.number({ message: 'Decimals must be a number' });


class AddERC20Token extends Component {
  constructor(props) {
    super(props);
    this.state = {
      data: initialFormValues,
    };
  }

  static getDerivedStateFromProps(nextProps, prevState) {
    if (nextProps?.data !== prevState.data) {
      return {
        data: nextProps?.data ? {
          ...nextProps?.data,
          decimals: nextProps?.data?.decimals ? String(nextProps?.data?.decimals) : '0'
        } : null
      };
    }
    return null;
  }

  handleFormChange = (values, dispatch, props, previousValues) => {
    const { type, onSearch } = this.props;
    if (type === 'erc20') {
      const { address } = values;
      const { address: oldAddress } = previousValues;
      if (address !== oldAddress) {
        onSearch(values);
      }
    } else {
      const { bep2symbol } = values;
      const { bep2symbol: oldBep2Symbol } = previousValues;
      if (bep2symbol !== oldBep2Symbol) {
        onSearch(values);
      }
    }
  };

  renderBEP2Fields() {
    const { data }  = this.state;
    return (
      <>
        <Field
          component={InputField}
          name='bep2symbol'
          label='Symbol'
          placeholder='Search by BEP2 symbol'
          style={styles.input}
          validate={isRequired}
        />
        { data?.name ? (
          <Field
            component={InputField}
            name='name'
            label='Name'
            style={styles.input}
            componentProps={{
              editable: false
            }}
            validate={isRequired}
          />
        ) : null}
        { data?.originalSymbol ? (
          <Field
            component={InputField}
            name='originalSymbol'
            label='Original symbol'
            style={styles.input}
            validate={isRequired}
            componentProps={{
              editable: false
            }}
          />
        ) : null}
      </>
    );
  }

  renderERC20Fields() {
    const { data }  = this.state;
    return (
      <>
        <Field
          component={InputQRField}
          name='address'
          label='Address'
          placeholder='Search by ERC20 Address'
          style={styles.input}
          validate={isRequired}
        />
        { data?.symbol ? (
          <Field
            component={InputField}
            name='symbol'
            label='Symbol'
            style={styles.input}
            validate={isRequired}
            componentProps={{
              editable: false
            }}
          />
        ) : null}
        { data?.decimals ? (
          <Field
            component={InputField}
            name='decimals'
            label='Decimals'
            style={styles.input}
            componentProps={{
              editable: false
            }}
            validate={[isRequired, isNumber]}
          />
        ) : null}
      </>
    );
  }


  render() {
    const { data } = this.state;
    const { isSearching, onChangeType, onAdd, type } = this.props;

    return (
      <Form initialValues={data} onChange={this.handleFormChange} style={styles.container}>
        {({ handleSubmit, submitting }) => (
          <>
            <View style={styles.fields}>
              <Field
                component={SelectField}
                name='type'
                label='Select a network'
                style={styles.input}
                onValueChange={onChangeType}
                selectedValue={type}
                placeholder={{}}
                value={type}
                items={[
                  { label: 'ERC20', value: 'erc20' },
                  { label: 'BEP2', value: 'bep2' },
                ]}
              >
                <Picker.Item label="ERC20" value="erc20" />
                <Picker.Item label="BEP2" value="bep2" />
              </Field>
              { type === 'erc20' ? this.renderERC20Fields() : this.renderBEP2Fields() }
            </View>
            <Button
              title='Add manually'
              style={styles.submitBtn}
              onPress={handleSubmit(onAdd)}
              isAsync
              disabled={!data || isSearching || submitting}
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
  onAdd: PropTypes.func.isRequired,
  onSearch: PropTypes.func.isRequired,
  onChangeType: PropTypes.func.isRequired,
  type: PropTypes.string.isRequired,
  isSearching: PropTypes.bool,
};


export default AddERC20Token;
