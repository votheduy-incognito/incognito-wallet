import { object, string } from 'yup';
import { amountConstant } from '@src/components/core/formik/validator';

export default object().shape({
  symbol: string(),
  name: string(),
  amount: amountConstant(),
  fee: amountConstant()
});