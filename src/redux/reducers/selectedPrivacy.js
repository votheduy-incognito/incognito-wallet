import type from '@src/redux/types/selectedPrivacy';

const initialState = { tokenID: null };

const reducer = (state = initialState, action) => {
  switch (action.type) {
  case type.SET:
    return {
      ...state,
      tokenID: action.data
    };
  case type.CLEAR:
    return {
      ...state,
      tokenID: null,
    };

  default:
    return state;
  }
};

export default reducer;