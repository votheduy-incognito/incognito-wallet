import {createSelector} from 'reselect';

export const modalSelector = createSelector(
  state => state.modal,
  modal => modal,
);

export const modalLoadingSelector = createSelector(
  modalSelector,
  modal => modal.loading,
);
