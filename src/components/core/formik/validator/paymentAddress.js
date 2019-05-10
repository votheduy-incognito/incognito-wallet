import { string } from 'yup';
import accountService from '@src/services/wallet/accountService';

export default ({ errorMsg } = {}) => string()
  .required('Required!')
  .test('validPaymentAddress', errorMsg ?? 'Invalid address', (value) => accountService.checkPaymentAddress(value));