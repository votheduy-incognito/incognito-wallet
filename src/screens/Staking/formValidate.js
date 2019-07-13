// import { paymentAddress, amountConstant } from '@src/components/core/formik/validator';
import { paymentAddress } from '@src/components/core/formik/validator';
import { object } from 'yup';

export default object().shape({
  fromAddress: paymentAddress(),
  toAddress: paymentAddress(),
  amount: 0,
  fee: 0
});
