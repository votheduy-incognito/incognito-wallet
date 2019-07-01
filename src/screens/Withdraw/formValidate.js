import { object } from 'yup';
import { amountConstant } from '@src/components/core/formik/validator';

export default object().shape({
  amount: amountConstant(),
});