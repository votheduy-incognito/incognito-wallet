import { object } from 'yup';
import { string } from '@src/components/core/formik/validator';

export default object().shape({
  accountName: string(),
});