const errorCode = {
  '-1000': 'Your email is invalid',
  '-1005': 'This email was existed, please try another'
};

export const getErrorMessage = err => errorCode[err.Code];