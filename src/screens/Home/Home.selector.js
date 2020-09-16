import { createSelector } from 'reselect';

export const homeSelector = createSelector(
  state => state.home,
  home => ({
    ...home,
    categories: home?.configs?.categories,
    headerTitle: home?.configs?.headerTitle,
  }),
);
