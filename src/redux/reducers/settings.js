import type from '@src/redux/types/settings';

const initialState = {
  data: [],
  error: null
};

const reducer = (state = initialState, action) => {
  if (action.type === type.SET_SETTINGS) {
    return {
      ...state,
      data: action.payload
    };
  } else {
    return state;
  }
};

export default reducer;
