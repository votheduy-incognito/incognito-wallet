import type from '@src/redux/types/selectedPrivacy';

const initialState = { symbol: null };

const reducer = (state = initialState, action) => {
  switch (action.type) {
  case type.SET:
    return {
      ...state,
      symbol: action.data
    };
  case type.CLEAR:
    return {
      ...state,
      symbol: null,
    };

  default:
    return state;
  }
};

export default reducer;