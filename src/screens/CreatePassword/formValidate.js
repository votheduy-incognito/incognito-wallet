import { object, string } from 'yup';

export default object().shape({
  password: string()
    .required('Required!')
});