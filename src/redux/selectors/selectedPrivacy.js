import { createSelector } from 'reselect';
import selectedPrivacyModel from '@src/models/selectedPrivacy';
import { defaultAccount } from './account';
import { followed } from './token';

export const selectedPrivacySymbol = state => state?.selectedPrivacy?.symbol;

export const selectedPrivacy = createSelector(
  selectedPrivacySymbol,
  defaultAccount,
  followed,
  (selectedSymbol, account, tokens) => {
    const token = tokens.find(t => t?.symbol === selectedSymbol);
    return selectedPrivacyModel.parse(account, token);
  }
);

export default {
  selectedPrivacySymbol,
  selectedPrivacy
};