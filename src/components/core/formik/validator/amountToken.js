import { string } from 'yup';

export default ({ errorMsg } = {}) => string()
  .required('Required!')
  .test('decimalNumber', errorMsg ?? 'Must a decimal number', value => !Number.isInteger(Number(value)));