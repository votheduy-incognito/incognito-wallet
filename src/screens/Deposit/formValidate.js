import { object } from 'yup';
import { amount } from '@src/components/core/formik/validator';

export default object().shape({
  amount: amount(),
});