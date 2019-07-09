import { number } from 'yup';

export default ({ max } = {}) => {
  let validate = number()
    .required('Required!')
    .moreThan(0);

  if (max){
    validate = validate.max(max);
  }

  return validate;
};