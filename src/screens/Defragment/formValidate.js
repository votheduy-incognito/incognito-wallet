import { object, string, number } from 'yup';

export default ({ minFee = 0 }) => object().shape({
  fromAddress: string()
    .required('Required!'),
  amount: number()
    .integer()
    .required('Required!'),
  fee: number()
    .min(minFee)
    .required('Required!')
});