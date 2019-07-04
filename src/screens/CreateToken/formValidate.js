import { object } from 'yup';
import { amount, string } from '@src/components/core/formik/validator';

export default object().shape({
  symbol: string(),
  name: string(),
  amount: amount(),
  fee: amount()
});