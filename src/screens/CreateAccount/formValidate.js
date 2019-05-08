import { object, string } from 'yup';

export default object().shape({
  accountName: string()
    .required('Required!')
});