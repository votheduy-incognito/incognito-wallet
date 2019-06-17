import { object, string } from 'yup';

export default object().shape({
  email: string()
    .required('Required!')
});