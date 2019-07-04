import { object } from 'yup';
import { paymentAddress, amount } from '@src/components/core/formik/validator';

export default object().shape({
  toAddress: paymentAddress(),
  amount: amount(),
});