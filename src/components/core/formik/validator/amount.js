import { number } from 'yup';

export default ({ max } = {}) => {
  const validate = number()
    .required('Required!')
    .moreThan(0);

  if (max){
    validate.lessThan(max);
  }

  return validate;
};