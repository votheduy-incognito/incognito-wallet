import { createSelector } from 'reselect';

export const followed = state => state?.token?.followed;

export default {
  followed
};