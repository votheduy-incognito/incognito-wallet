import {createSelector} from 'reselect';

export const stakeHistorySelector = createSelector(
  state => state.stakeHistory,
  stakeHistory => stakeHistory,
);

export const dataStakeHistorySelector = createSelector(
  stakeHistorySelector,
  stakeHistory => {
    const {items} = stakeHistory.data;
    const {history} = stakeHistory.storage;
    console.log('history', history.map(item => item.createdAt));
    return {
      ...stakeHistory.data,
      items:
        history.length > 0
          ? [
            ...history.sort(
              (a, b) =>
                new Date(b.createdAt).getTime() -
                  new Date(a.createdAt).getTime(),
            ),
            ...items,
          ]
          : [...items],
    };
  },
);
