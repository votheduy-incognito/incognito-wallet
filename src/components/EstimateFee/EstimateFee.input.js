import React from 'react';
import { View, TouchableWithoutFeedback, Text } from 'react-native';
import { Field, change } from 'redux-form';
import { InputField, createForm, validator } from '@components/core/reduxForm';
import { CONSTANT_COMMONS } from '@src/constants';
import { GENERAL } from '@src/constants/elements';
import { generateTestId } from '@src/utils/misc';
import { useSelector, useDispatch } from 'react-redux';
import format from '@src/utils/format';
import { selectedPrivacySeleclor } from '@src/redux/selectors';
import convert from '@src/utils/convert';
import { styled } from './EstimateFee.styled';
// eslint-disable-next-line import/no-cycle
import withEstimateFee from './EstimateFee.enhance';
// eslint-disable-next-line import/no-cycle
import { estimateFeeSelector, feeDataSelector } from './EstimateFee.selector';
// eslint-disable-next-line import/no-cycle
import { actionChangeFeeType } from './EstimateFee.actions';

const feeValidator = [
  validator.required(),
  validator.number(),
  validator.largerThan(0),
];

export const formName = 'formEstimateFee';

const Form = createForm(formName);

const EstimateFeeInput = props => {
  const { types, isFetching, isFetched } = useSelector(estimateFeeSelector);
  const { fee, feePDecimals, feeUnit, minFee, maxFee } = useSelector(
    feeDataSelector,
  );
  const [state, setState] = React.useState({
    minFeeValidator: null,
    maxFeeValidator: null,
  });
  const { minFeeValidator, maxFeeValidator } = state;
  React.useEffect(() => {
    if (fee) {
      const convertedMinFee = convert.toHumanAmount(minFee, feePDecimals);
      const convertedMinFeeStr = format.toFixed(convertedMinFee, feePDecimals);
      const minFeeValidator = validator.minValue(convertedMinFee, {
        message: `Must be at least ${convertedMinFeeStr} ${feeUnit}`,
      });
      const convertedMaxFee = convert.toHumanAmount(maxFee, feePDecimals);
      const convertedMaxFeeStr = format.toFixed(convertedMaxFee, feePDecimals);
      const maxFeeValidator = validator.maxValue(convertedMaxFee, {
        message: `Must be less than ${convertedMaxFeeStr} ${feeUnit}`,
      });
      setState({ ...state, minFeeValidator, maxFeeValidator });
    }
  }, [fee]);
  return (
    <Form>
      {({ handleSubmit }) => (
        <Field
          component={InputField}
          prependView={<SupportFees types={types} />}
          placeholder={isFetching ? 'Estimating fee...' : '0'}
          name="fee"
          validate={[
            ...feeValidator,
            ...(minFeeValidator ? [minFeeValidator] : []),
            ...(maxFeeValidator ? [maxFeeValidator] : []),
          ]}
          componentProps={{
            keyboardType: 'decimal-pad',
            editable: isFetched,
          }}
          label="Fee"
          {...props}
        />
      )}
    </Form>
  );
};

EstimateFeeInput.propTypes = {};

const SupportFeeItem = props => {
  const {
    tokenId = null,
    symbol = null,
    isActived = false,
    types = false,
    tail = false,
    ...rest
  } = props;
  if (!tokenId) {
    return;
  }
  return (
    <TouchableWithoutFeedback
      {...generateTestId(GENERAL.SELECTED_NETWORK_FEE_UNIT)}
      {...rest}
    >
      <View style={[styled.spFeeItem, tail ? styled.tail : null]}>
        <Text style={[styled.symbol, isActived ? styled.isActived : null]}>
          {symbol}
        </Text>
      </View>
    </TouchableWithoutFeedback>
  );
};

const SupportFees = () => {
  const { actived, types, fee, feePToken } = useSelector(estimateFeeSelector);
  const selectedPrivacy = useSelector(selectedPrivacySeleclor.selectedPrivacy);
  const dispatch = useDispatch();
  if (types.length === 0) {
    return;
  }
  const onChangeTypeFee = async type => {
    const feeCalByPRV = type?.tokenId === CONSTANT_COMMONS.PRV.id;
    const feeChange = feeCalByPRV ? fee : feePToken;
    const pDecimals = feeCalByPRV
      ? CONSTANT_COMMONS.PRV.pDecimals
      : selectedPrivacy?.pDecimals;
    const feeConverted = format.amountFull(feeChange, pDecimals);
    await new Promise.all([
      await dispatch(actionChangeFeeType(type?.tokenId)),
      await dispatch(change(formName, 'fee', feeConverted)),
    ]);
    if (typeof type?.onChangeFee === 'function') {
      type?.onChangeFee(type);
    }
  };
  return (
    <View style={styled.spFeeContainer}>
      {types.map((type, index) => (
        <SupportFeeItem
          key={type?.tokenId}
          {...{
            ...type,
            isActived: actived === type?.tokenId,
            tail: index === types.length - 1,
            onPress: () => onChangeTypeFee({ ...type }),
          }}
        />
      ))}
    </View>
  );
};

export default withEstimateFee(EstimateFeeInput);
