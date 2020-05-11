import { createSelector } from 'reselect';

export const shieldSelector = createSelector(
  state => state.shield,
  shield => shield,
);

export const shieldDataSelector = createSelector(
  shieldSelector,
  shield => shield?.data,
);
