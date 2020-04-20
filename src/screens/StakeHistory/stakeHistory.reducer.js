import {
  ACTION_FETCHING,
  ACTION_FETCHED,
  ACTION_FETCH_FAIL,
  ACTION_CHANGE_PAGE,
} from './stakeHistory.constant';

const initialState = {
  isFetching: false,
  isFetched: false,
  data: {
    limit: 20,
    page: 1,
    items: [],
    over: false,
  },
};

export default (state = initialState, action) => {
  switch (action.type) {
  case ACTION_FETCHING: {
    return {
      ...state,
      isFetching: true,
    };
  }
  case ACTION_FETCHED: {
    return {
      ...state,
      isFetching: false,
      isFetched: true,
      data: {...state.data, ...action.payload},
    };
  }
  case ACTION_FETCH_FAIL: {
    return {
      ...state,
      isFetched: false,
      isFetching: false,
    };
  }
  case ACTION_CHANGE_PAGE: {
    const page = action.payload;
    return {
      ...state,
      data: {
        ...state.data,
        page,
      },
    };
  }
  default:
    return state;
  }
};
