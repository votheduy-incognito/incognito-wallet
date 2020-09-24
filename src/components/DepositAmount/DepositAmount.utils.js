import convert from '@utils/convert';
import isGreaterThan from 'lodash/gt';
import isLessThan from 'lodash/lt';

export const validateForm = ({amount, min, max}) => {
  const result = convert.toNumber(amount);
  if (!result) {
    return {
      error: true,
      message: 'Must be a valid number',
    };
  }
  if (min) {
    if (isLessThan(result, min)) {
      return {
        error: true,
        message: `Amount must be greater than ${convert.toNumber(min)}`,
      };
    }
  }
  if (max) {
    if (isGreaterThan(result, max)) {
      return {
        error: true,
        message: `Amount must be less than ${convert.toNumber(max)}`,
      };
    }
  }
  return {error: false, message: ''};
};
