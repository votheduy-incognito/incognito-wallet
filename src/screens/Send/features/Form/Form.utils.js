import { trim } from 'lodash';

export const standardizedAddress = (address) => {
  if (!address) {
    return '';
  }
  let indexParams = address?.indexOf('?');
  let newAddress = address;
  if (indexParams !== -1) {
    newAddress = address.substring(0, indexParams);
  }
  return trim(newAddress || '');
};
