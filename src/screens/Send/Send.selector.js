import {createSelector} from 'reselect';

export const sendSelector = createSelector(
  state => state.send,
  send => send,
);
