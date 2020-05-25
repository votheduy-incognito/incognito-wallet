import React, { useState } from 'react';
import { getTokenList } from '@services/api/token';
import tokenService from '@services/wallet/tokenService';
import { getPDEState } from '@services/api/device';
import _ from 'lodash';
import { CustomError, ErrorCode, ExHandler } from '@services/exception';
import convertUtil from '@utils/convert';
import { PRIORITY_LIST } from '@screens/Dex/constants';
import { MESSAGES } from '@src/constants';

const withPairs = WrappedComp => (props) => {
  const [loading, setLoading] = useState(false);
  const [pairs, setPairs] = useState([]);
  const [tokens, setTokens] = useState([]);
  const [pairTokens, setPairTokens] = useState([]);
  const [shares, setShares] = useState([]);

  const loadPairs = async () => {
    try {
      setLoading(true);
      const pTokens = await getTokenList();
      const chainTokens = await tokenService.getPrivacyTokens();
      const chainPairs = await getPDEState();
      const tokens = tokenService.mergeTokens(chainTokens, pTokens);

      if (!_.has(chainPairs, 'PDEPoolPairs')) {
        throw new CustomError(ErrorCode.FULLNODE_DOWN);
      }

      const pairs = _(chainPairs.PDEPoolPairs)
        .map(pair => ({
          [pair.Token1IDStr]: pair.Token1PoolValue,
          [pair.Token2IDStr]: pair.Token2PoolValue,
          total: convertUtil.toRealTokenValue(tokens, pair.Token1IDStr, pair.Token1PoolValue) + convertUtil.toRealTokenValue(tokens, pair.Token2IDStr, pair.Token2PoolValue),
          keys: [pair.Token1IDStr, pair.Token2IDStr],
        }))
        .filter(pair => pair.total)
        .orderBy('total', 'desc')
        .value();
      const shares = chainPairs.PDEShares;

      Object.keys(shares).forEach(key => {
        if (shares[key] === 0) {
          delete shares[key];
        }
      });

      const pairTokens = _(tokens)
        .filter(token => pairs.find(pair => pair.keys.includes(token.id)))
        .orderBy([
          item => PRIORITY_LIST.indexOf(item?.id) > -1 ? PRIORITY_LIST.indexOf(item?.id) : 100,
          'hasIcon',
          token => _.maxBy(pairs, pair => pair.keys.includes(token.id) ? pair.total : 0).total],
        ['asc', 'desc', 'desc']
        )
        .value();
      setPairs(pairs);
      setPairTokens(pairTokens);
      setTokens(tokens);
      setShares(shares);
    } catch (error) {
      new ExHandler(error, MESSAGES.CAN_NOT_GET_PDEX_DATA).showErrorToast();
    } finally {
      setLoading(false);
    }
  };

  React.useEffect(() => {
    loadPairs();
  }, []);

  return (
    <WrappedComp
      {...{
        ...props,
        pairs,
        tokens,
        pairTokens,
        shares,
        loading,
      }}
    />
  );
};

export default withPairs;
