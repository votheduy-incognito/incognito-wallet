import { number } from 'yup';
import constant from '@src/constants/common';

export default ({ max } = {}) => {
  const validate = number()
    .required('Required!')
    .min(constant.AMOUNT_CONSTANT_MIN);

  if (max){
    validate.lessThan(max);
  }

  return validate;
};