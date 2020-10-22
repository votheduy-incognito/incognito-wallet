import { createSelector } from 'reselect';

export const dexV2Selector = createSelector(
  (state) => state.dexV2,
  (dexV2) => dexV2 || {},
);

export const pairsSelector = createSelector(
  dexV2Selector,
  (dexV2) => dexV2?.pairs || {},
);

export const pairsDataSelectors = createSelector(
  pairsSelector,
  (pairs) => pairs?.data,
);
