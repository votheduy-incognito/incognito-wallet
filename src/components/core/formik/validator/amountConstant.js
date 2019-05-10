import { string } from 'yup';

export default ({ errorMsg } = {}) => string()
  .required('Required!')
  .test('number', errorMsg ?? 'Must a number', value => !Number.isNaN(Number(value)));