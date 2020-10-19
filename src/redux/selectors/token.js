import { createSelector } from 'reselect';

export const followed = (state) => state?.token?.followed || [];
export const isGettingBalance = (state) => state?.token?.isGettingBalance || [];
export const pTokens = (state) => state?.token?.pTokens || [];
export const internalTokens = (state) => state?.token?.internalTokens || [];
export const tokensFollowedSelector = createSelector(
  followed,
  (tokens) => tokens,
);
export const pTokensSelector = createSelector(
  (state) => state?.token?.pTokens,
  (pTokens) => pTokens || [],
);

export const internalTokensSelector = createSelector(
  (state) => state?.token?.internalTokens,
  (internalTokens) => internalTokens || [],
);

export const historyTokenSelector = createSelector(
  (state) => state?.token?.history,
  (history) => history,
);

export const followingTokenSelector = createSelector(
  (state) => state?.token?.following,
  (following) => (tokenId) => following.includes(tokenId),
);

export const isTokenFollowedSelector = createSelector(
  tokensFollowedSelector,
  (tokens) => (tokenId) => tokens.find((token) => token?.id === tokenId),
);

export const toggleUnVerifiedTokensSelector = createSelector(
  (state) => state?.token?.toggleUnVerified,
  (toggleUnVerified) => toggleUnVerified,
);

export const receiveHistorySelector = createSelector(
  (state) => state?.token?.receiveHistory,
  historyTokenSelector,
  (receiveHistory, history) => {
    const {
      oversize,
      refreshing: refreshingReceiveHistory,
      isFetched: isFetchedReceiveHistory,
      isFetching: isFetchingReceiveHistory,
    } = receiveHistory;
    const {
      histories,
      isFetched,
      isFetching,
      refreshing: refreshingHistory,
    } = history;
    const refreshing = refreshingHistory || refreshingReceiveHistory;
    const notEnoughData =
      histories?.length < 10 &&
      !isFetchingReceiveHistory &&
      isFetchedReceiveHistory &&
      !oversize;
    const showEmpty =
      histories?.length === 0 &&
      isFetched &&
      !isFetching &&
      !notEnoughData &&
      !oversize;
    const isLoadmore =
      !notEnoughData &&
      !!receiveHistory?.isFetching &&
      !receiveHistory?.refreshing &&
      !oversize;
    return {
      ...receiveHistory,
      isLoadmore,
      refreshing,
      notEnoughData,
      showEmpty,
    };
  },
);

export default {
  followed,
  isGettingBalance,
  pTokens,
  internalTokens,
  tokensFollowedSelector,
  pTokensSelector,
  internalTokensSelector,
  historyTokenSelector,
  followingTokenSelector,
  isTokenFollowedSelector,
  toggleUnVerifiedTokensSelector,
  receiveHistorySelector,
};
