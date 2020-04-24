import {
  ACTION_TOGGLE_MODAL,
  ACTION_TOGGLE_LOADING_MODAL,
} from './modal.constant';

const initialState = {
  visible: false,
  data: null,
  shouldCloseModalWhenTapOverlay: false,
  loading: {
    toggle: false,
    title: '',
  },
};

export default (state = initialState, action) => {
  switch (action.type) {
  case ACTION_TOGGLE_MODAL: {
    return {
      ...state,
      ...action.payload,
    };
  }
  case ACTION_TOGGLE_LOADING_MODAL: {
    return {
      ...state,
      loading: {
        ...state.loading,
        ...action.payload,
      },
    };
  }
  default:
    return state;
  }
};
