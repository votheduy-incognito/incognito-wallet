import React from 'react';
import {View, Text, Keyboard} from 'react-native';
import {BtnDefault} from '@src/components/Button';
import {TextInput} from '@src/components/Input';
import PropTypes from 'prop-types';
import Hook from '@screens/Stake/features/Hook';
import {styled} from './TypeAmount.styled';
import withTypeAmount from './TypeAmount.enhance';

const TypeAmount = props => {
  const {
    hookFactories,
    handleOnChangeAmount,
    amount,
    btnSubmitAmount,
    onSubmitAmount,
    shouldDisabled,
    feeData,
    loading,
    error,
    handleShowMax,
  } = props;
  return (
    <View style={styled.container}>
      {hookFactories.map(item => (
        <Hook key={item.id} data={item} />
      ))}
      <TextInput
        errorStyle={styled.errorInput}
        placeholder="0.0"
        style={styled.input}
        keyboardType="decimal-pad"
        value={amount.value}
        validated={amount.validated}
        maxLength={50}
        onChangeText={handleOnChangeAmount}
        autoFocus
        inputMax={{
          visible: true,
          handleShowMax,
        }}
        containerInputStyle={styled.containerInput}
      />
      <Hook data={feeData} />
      {error ? 
        <Text style={styled.error}>{error}</Text> : (
          <Text style={[styled.error, {color: 'grey', marginTop: 10, textAlign: 'left'}]}>
          Due to concurrent high volume of withdrawals, wait times are much longer than usual. 
          Please wait 1 - 3 days for your withdrawal to be processed. We apologize for the inconvenience.
          </Text>
        )}
      <BtnDefault
        btnStyle={styled.btnSubmit}
        title={btnSubmitAmount}
        onPress={() => {
          Keyboard.dismiss();
          onSubmitAmount();
        }}
        disabled={shouldDisabled}
        loading={loading}
      />
    </View>
  );
};

TypeAmount.propTypes = {
  hookFactories: PropTypes.array.isRequired,
  handleOnChangeAmount: PropTypes.func.isRequired,
  amount: PropTypes.shape({
    value: PropTypes.oneOfType([PropTypes.number, PropTypes.string]).isRequired,
    validated: PropTypes.shape({
      error: PropTypes.bool.isRequired,
      message: PropTypes.string.isRequired,
    }).isRequired,
  }).isRequired,
  btnSubmitAmount: PropTypes.string.isRequired,
  onSubmitAmount: PropTypes.func.isRequired,
  shouldDisabled: PropTypes.bool.isRequired,
  fee: PropTypes.shape({
    isFetching: PropTypes.bool.isRequired,
    isFetched: PropTypes.bool.isRequired,
    value: PropTypes.number.isRequired,
  }).isRequired,
  feeData: PropTypes.any.isRequired,
  loading: PropTypes.bool.isRequired,
  error: PropTypes.string.isRequired,
  handleShowMax: PropTypes.func.isRequired,
};

export default withTypeAmount(TypeAmount);
