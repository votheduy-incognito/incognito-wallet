import type from '@src/redux/types/app';
import { CONSTANT_APP } from '@src/constants';

export const setAppStatus = status => {
  if (Object.values(CONSTANT_APP.STATUS).includes(status)) {
    return ({
      type: type.SET_STATUS,
      data: status
    });
  }
};
