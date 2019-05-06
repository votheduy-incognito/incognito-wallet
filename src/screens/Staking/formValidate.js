import { object, string } from 'yup';

export default object().shape({
  stakingType: string()
    .required('Required!'),
  fromAddress: string()
    .required('Required!'),
  toAddress: string()
    .required('Required!'),
  amount: string()
    .required('Required!'),
  fee: string()
    .required('Required!')
});