import type from '@src/redux/types/app';
import { CONSTANT_APP } from '@src/constants';

const initialState = {
  status: CONSTANT_APP.STATUS.INIT,
  isReady: false,
};

const reducer = (state = initialState, action) => {
  switch (action.type) {
  case type.SET_STATUS:
    return {
      ...state,
      status: action?.data,
      isReady: action?.data === CONSTANT_APP.STATUS.READY
    };
  default:
    return state;
  }
};

export default reducer;