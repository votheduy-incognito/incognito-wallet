import { createSelector } from 'reselect';

export const historiesSelector = createSelector(
  (state) => state.dexV2,
  (dexV2) => dexV2?.histories,
);
