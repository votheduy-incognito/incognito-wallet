import React from 'react';
import {View, StyleSheet, Text} from 'react-native';
import {reduxForm, Field} from 'redux-form';
import {
  InputMaxValueField,
  validator,
  //   validator,
} from '@src/components/core/reduxForm';
import {useSelector} from 'react-redux';
import formatUtil from '@utils/format';
import {BtnDefault} from '@src/components/Button';
import convert from '@utils/convert';
import {stakeDataSelector} from './stake.selector';

const styled = StyleSheet.create({
  container: {},
});

const formName = 'formStake';

const validMinValue = min => value =>
  convert.toNumber(value) < min
    ? `Amount must be larger than ${formatUtil.number(min)}`
    : null;

const validMaxValue = max => value =>
  convert.toNumber(value) > max
    ? `Max amount you can send is ${formatUtil.number(max)}`
    : null;

const Form = props => {
  const {handleSubmit} = props;
  const {minToStake, maxToStake, pDecimals} = useSelector(stakeDataSelector);
  const [state, setState] = React.useState({
    amount: {
      value: 0,
    },
  });
  const handleSubmitForm = values => {
    console.log('values', values);
  };
  const onChangeInput = name => value => {
    setState({
      ...state,
      [name]: {
        ...state[name],
        value,
      },
    });
  };
  console.log('state', state);
  return (
    <View style={styled.container}>
      <Text>How many PRV do you want to stake?</Text>
      <Field
        value={state.amount.value}
        onChange={onChangeInput('amount')}
        component={InputMaxValueField}
        name="amount"
        placeholder="0.0"
        label="Amount"
        style={styled.input}
        maxValue={maxToStake}
        componentProps={{
          keyboardType: 'decimal-pad',
        }}
        // validate={[validMinValue(minToStake), validMaxValue(maxToStake)]}
      />
      <BtnDefault title="Stake" onPress={handleSubmit(handleSubmitForm)} />
    </View>
  );
};

Form.propTypes = {};

const StakeForm = reduxForm({
  form: formName,
})(Form);

export default StakeForm;
