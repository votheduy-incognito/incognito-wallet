import { createSelector } from 'reselect';

export const devSelector = createSelector(
  (state) => state.dev,
  (dev) => dev?.storage,
);
