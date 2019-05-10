import { number } from 'yup';

export default ({ max } = {}) => {
  const validate = number()
    .required('Required!');

  if (max){
    validate.lessThan(max);
  }

  return validate;
};