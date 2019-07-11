import { object } from 'yup';
import { paymentAddress, amount } from '@src/components/core/formik/validator';

export default ({ amountValidation } = {}) => {
  return object().shape({
    toAddress: paymentAddress(),
    amount: amountValidation || amount(),
  });
};
