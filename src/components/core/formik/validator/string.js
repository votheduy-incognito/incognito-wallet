import { string } from 'yup';

export default ({ errorMsg } = {}) => string()
  .required(errorMsg ?? 'Required!');