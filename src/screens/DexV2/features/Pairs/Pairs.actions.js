import { getTokenList } from '@src/services/api/token';
import tokenService from '@services/wallet/tokenService';
import { getPDEState } from '@src/services/api/device';
import { getAllTradingTokens } from '@src/services/trading';
import { CustomError, ErrorCode, ExHandler } from '@services/exception';
import convertUtil from '@utils/convert';
import { PRIORITY_LIST } from '@screens/Dex/constants';
import { COINS, MESSAGES } from '@src/constants';
import _ from 'lodash';
import {
  ACTION_FETCHING_PAIRS,
  ACTION_FETCHED_PAIRS,
  ACTION_FETCH_FAIL_PAIRS,
} from './Pairs.constant';
import { pairsSelector } from './Pairs.selector';

export const actionFetchingPairs = () => ({
  type: ACTION_FETCHING_PAIRS,
});

export const actionFetchedPairs = (payload) => ({
  type: ACTION_FETCHED_PAIRS,
  payload,
});

export const actionFetchFailPairs = () => ({
  type: ACTION_FETCH_FAIL_PAIRS,
});

export const actionFetchPairs = () => async (dispatch, getState) => {
  const state = getState();
  const { isFetching } = pairsSelector(state);
  if (isFetching) {
    return;
  }
  try {
    dispatch(actionFetchingPairs());
    const [
      pTokens,
      chainTokens,
      chainPairs,
      erc20Tokens,
    ] = await new Promise.all([
      getTokenList(),
      tokenService.getPrivacyTokens(),
      getPDEState(),
      getAllTradingTokens(),
    ]);

    if (!_.has(chainPairs, 'PDEPoolPairs')) {
      return new ExHandler(
        new CustomError(ErrorCode.FULLNODE_DOWN),
        MESSAGES.CAN_NOT_GET_PDEX_DATA,
      ).showErrorToast();
    }

    let tokens = tokenService.mergeTokens(chainTokens, pTokens);

    //token pool value => total token in pool (pool / pDecimal chinh no)
    const pairs = _(chainPairs.PDEPoolPairs)
      .map((pair) => ({
        [pair.Token1IDStr]: pair.Token1PoolValue,
        [pair.Token2IDStr]: pair.Token2PoolValue,
        total:
          convertUtil.toRealTokenValue(
            tokens,
            pair.Token1IDStr,
            pair.Token1PoolValue,
          ) +
          convertUtil.toRealTokenValue(
            tokens,
            pair.Token2IDStr,
            pair.Token2PoolValue,
          ),
        keys: [pair.Token1IDStr, pair.Token2IDStr],
      }))
      .filter((pair) => pair.keys.includes(COINS.PRV_ID))
      .filter((pair) => pair.total)
      .orderBy('total', 'desc')
      .value();

    const shares = chainPairs.PDEShares;//dung co liquidity
    Object.keys(shares).forEach((key) => {
      if (shares[key] === 0) {
        delete shares[key];
      }
    });

    let pairTokens = tokens.filter(
      (token) => token && pairs.find((pair) => pair.keys.includes(token.id)),
    );//remove token k co pair trong pool

    pairTokens = pairTokens.concat(
      erc20Tokens.filter(
        (token) => !pairTokens.find((item) => item.id === token.id),
      ),
    ); //add erc20 tokens

    pairTokens = _(pairTokens)
      .map((token) => {
        const erc20Token = erc20Tokens.find((item) => item.id === token.id);
        let priority = PRIORITY_LIST.indexOf(token?.id);
        priority =
          priority > -1
            ? priority
            : erc20Token
              ? PRIORITY_LIST.length
              : PRIORITY_LIST.length + 1;

        return {
          ...token,
          address: erc20Token?.address,
          priority,
          verified: token.verified,
        };
      })
      .orderBy(['priority', 'hasIcon', 'verified'], ['asc', 'desc', 'desc'])
      .value();//sort
    const payload = {
      pairs,
      tokens,
      pairTokens,
      shares,
      erc20Tokens,
    };
    dispatch(actionFetchedPairs(payload));
  } catch (error) {
    new ExHandler(error, MESSAGES.CAN_NOT_GET_PDEX_DATA).showErrorToast();
    dispatch(actionFetchFailPairs());
  }
};
