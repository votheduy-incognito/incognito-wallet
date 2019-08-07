import { createSelector } from 'reselect';
import SelectedPrivacy from '@src/models/selectedPrivacy';
import { defaultAccount } from './account';
import { followed, pTokens } from './token';

export const selectedPrivacySymbol = state => state?.selectedPrivacy?.symbol;

export const selectedPrivacy = createSelector(
  selectedPrivacySymbol,
  defaultAccount,
  followed,
  pTokens,
  (selectedSymbol, account, followed) => {
    const token = followed.find(t => t?.symbol === selectedSymbol);
    return new SelectedPrivacy(account, token);
  }
);

export default {
  selectedPrivacySymbol,
  selectedPrivacy
};