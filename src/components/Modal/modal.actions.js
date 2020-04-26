import {
  ACTION_TOGGLE_MODAL,
  ACTION_TOGGLE_LOADING_MODAL,
} from './modal.constant';

export const actionToggleModal = (
  payload = {
    data: null,
    visible: false,
    shouldCloseModalWhenTapOverlay: false,
  },
) => ({
  type: ACTION_TOGGLE_MODAL,
  payload,
});

export const actionToggleLoadingModal = (
  payload = {
    toggle: false,
    title: '',
    desc: '',
  },
) => ({
  type: ACTION_TOGGLE_LOADING_MODAL,
  payload,
});
