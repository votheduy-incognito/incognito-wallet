import { object, string, number } from 'yup';

export default ({ minFee = 0 }) => object().shape({
  stakingType: string()
    .required('Required!'),
  fromAddress: string()
    .required('Required!'),
  toAddress: string()
    .required('Required!'),
  amount: number()
    .integer()
    .required('Required!'),
  fee: number()
    .min(minFee)
    .required('Required!')
});