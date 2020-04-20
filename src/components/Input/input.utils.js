import _ from 'lodash';

export const noError = {
  error: false,
  message: '',
};

export const empty = (value, message = 'Required!') =>
  _.isEmpty(value)
    ? {
      error: true,
      message,
    }
    : noError;

export const maxValue = (
  value,
  max,
  message = 'This amount is greater than your balance.',
) => {
  if (value > max) {
    return {
      error: true,
      message,
    };
  }
  return noError;
};

export const minValue = (value, min, message = '') => {
  if (value < min) {
    return {
      error: true,
      message,
    };
  }
  return noError;
};
