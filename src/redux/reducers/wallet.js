import type from '@src/redux/types/wallet';

const initialState = null;

const reducer = (state = initialState, action) => {
  switch (action.type) {
  case type.SET:
    return action.data;
  case type.REMOVE:
    return initialState;
  default:
    return state;
  }
};

export default reducer;
