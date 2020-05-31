import { createSelector } from 'reselect';
import { CONSTANT_COMMONS } from '@src/constants';
import { fromPairs } from 'lodash';
import {
  pTokensSelector,
  internalTokensSelector,
  tokensFollowedSelector,
  isGettingBalance as isGettingBalanceToken,
} from '@src/redux/selectors/token';
import { selectedPrivacySeleclor } from '@src/redux/selectors';
import uniqBy from 'lodash/uniqBy';
import isNaN from 'lodash/isNaN';
import convert from '@src/utils/convert';
import {
  isGettingBalance as isGettingBalanceAccount,
  defaultAccountName,
  defaultAccountBalanceSelector,
} from './account';

export const isGettingBalance = createSelector(
  isGettingBalanceToken,
  isGettingBalanceAccount,
  defaultAccountName,
  (tokens, accounts, defaultAccountName) => {
    return [
      ...(accounts?.includes(defaultAccountName)
        ? [CONSTANT_COMMONS.PRV_TOKEN_ID]
        : []),
      ...tokens,
    ];
  },
);

export const availableTokensSelector = createSelector(
  pTokensSelector,
  internalTokensSelector,
  tokensFollowedSelector,
  selectedPrivacySeleclor.getPrivacyDataByTokenID,
  (pTokens, internalTokens, followedTokens, getPrivacyDataByTokenID) => {
    const followedTokenIds = followedTokens.map(t => t?.id) || [];
    const allTokenIds = Object.keys(
      fromPairs([
        ...internalTokens?.map(t => [t?.id]),
        ...pTokens?.map(t => [t?.tokenId]),
      ]),
    );
    const tokens = [];
    allTokenIds?.forEach(tokenId => {
      const token = getPrivacyDataByTokenID(tokenId);
      if (token?.name && token?.symbol && token.tokenId) {
        let _token = { ...token };
        if (followedTokenIds.includes(token.tokenId)) {
          _token.isFollowed = true;
        }
        tokens.push(_token);
      }
    });
    const excludeRPV = token => token?.tokenId !== CONSTANT_COMMONS.PRV.id;
    return uniqBy(tokens.filter(excludeRPV), 'tokenId') || [];
  },
);

export const totalShieldedTokensSelector = createSelector(
  availableTokensSelector,
  selectedPrivacySeleclor.getPrivacyDataByTokenID,
  defaultAccountBalanceSelector,
  tokensFollowedSelector,
  (availableTokens, getPrivacyDataByTokenID, accountBalance, followed) => {
    const tokens = followed.map(token =>
      availableTokens.find(
        t => t?.tokenId === token?.id || t?.tokenId === token?.tokenId,
      ),
    );
    const prv = {
      ...getPrivacyDataByTokenID(CONSTANT_COMMONS.PRV.id),
      amount: accountBalance,
    };
    const totalShieldedTokens = [...tokens, prv].reduce(
      (prevValue, currentValue) => {
        let _currentValue =
          currentValue?.pricePrv *
          convert.toNumber(
            convert.toHumanAmount(
              currentValue?.amount,
              currentValue?.pDecimals,
            ),
          );
        if (isNaN(_currentValue)) {
          _currentValue = 0;
        }
        return prevValue + _currentValue;
      },
      0,
    );
    return totalShieldedTokens;
  },
);

export const unFollowTokensSelector = createSelector(
  availableTokensSelector,
  tokens => tokens.filter(token => !(token?.isFollowed === true)),
);

export default {
  isGettingBalance,
};
