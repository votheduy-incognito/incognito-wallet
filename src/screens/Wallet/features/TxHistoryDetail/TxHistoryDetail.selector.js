import { createSelector } from 'reselect';

export const txHistoryDetailSelector = createSelector(
  (state) => state.txHistoryDetail,
  (txHistoryDetail) => ({
    ...txHistoryDetail,
  }),
);

export const txHistoryDetailRefreshSelector = createSelector(
  txHistoryDetailSelector,
  txHistoryDetail => txHistoryDetail?.isRefreshing,
);

export const txHistoryDetailViewerSelector = createSelector(
  txHistoryDetailSelector,
  txHistoryDetail => txHistoryDetail?.historyDetail,
);
