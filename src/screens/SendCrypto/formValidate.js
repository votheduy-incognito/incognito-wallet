import { object } from 'yup';
import { paymentAddress, amountConstant } from '@src/components/core/formik/validator';

export default object().shape({
  toAddress: paymentAddress(),
  amount: amountConstant(),
});