import { string } from 'yup';

export default () => string()
  .required('Required!');