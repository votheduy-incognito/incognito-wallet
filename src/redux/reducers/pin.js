import type from '@src/redux/types/pin';

const reducer = (state = 0, action) => {
  switch (action.type) {
  case type.UPDATE:
    return {
      pin: action.payload,
    };
  case type.DELETE:
    return {
      pin: ''
    };
  default:
    return state;
  }
};

export default reducer;
