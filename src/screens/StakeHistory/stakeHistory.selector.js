import {createSelector} from 'reselect';

export const stakeHistorySelector = createSelector(
  state => state.stakeHistory,
  stakeHistory => stakeHistory,
);

export const dataStakeHistorySelector = createSelector(
  stakeHistorySelector,
  stakeHistory => stakeHistory.data,
);
