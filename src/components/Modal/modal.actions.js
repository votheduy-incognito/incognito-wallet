import {ACTION_TOGGLE_MODAL} from './modal.constant';

export const actionToggleModal = (
  payload = {data: null, visible: false, shouldCloseModalWhenTapOverlay: false},
) => ({
  type: ACTION_TOGGLE_MODAL,
  payload,
});
