import { object } from 'yup';
import { amount, string } from '@src/components/core/formik/validator';

export default ({ amountValidation } = {}) => {
  return object().shape({
    toAddress: string(),
    amount: amountValidation || amount(),
  });
};
