import { Toast } from '@src/components/core';
import LoadingContainer from '@src/components/LoadingContainer';
import { setWallet } from '@src/redux/actions/wallet';
import accountService from '@src/services/wallet/accountService';
import tokenService from '@src/services/wallet/tokenService';
import tokenModel from '@src/models/token';
import _ from 'lodash';
import PropTypes from 'prop-types';
import React, { useEffect, useState } from 'react';
import { connect } from 'react-redux';
import { accountSeleclor } from '@src/redux/selectors';
import FollowToken from './FollowToken';

const FollowTokenContainer = ({
  isPrivacy,
  account,
  wallet,
  setWallet,
  navigation,
  ...props
}) => {
  const [tokens, setTokens] = useState();
  const [isLoading, setLoading] = useState(false);
  const _isPrivacy = isPrivacy ?? navigation.getParam('isPrivacy');

  const getTokenList = async () => {
    try {
      setLoading(true);

      let tokens = [];
      if (_isPrivacy) {
        tokens = await tokenService.getPrivacyTokens();
      } else {
        tokens = await tokenService.getNormalTokens();
      }

      const followedTokens = await accountService.getFollowingTokens(
        account,
        wallet
      );

      return _.differenceBy(tokens, followedTokens, 'id');
    } catch {
      Toast.showError('Can not get list of tokens, please try later');
    } finally {
      setLoading(false);
    }
  };

  const handleAddFollowToken = async tokens => {
    try {
      const tokenPayload = tokens && tokens.map(tokenModel.toJson) || [];
      await accountService.addFollowingTokens(tokenPayload, account, wallet);

      Toast.showInfo('Added successfully');

      // update new wallet to store
      setWallet(wallet);

      getTokenList().then(setTokens);
    } catch {
      Toast.showError(
        'Can not add these tokens to your account right now, please try later'
      );
    }
  };

  useEffect(() => {
    getTokenList().then(setTokens);
  }, [account?.name]);

  if (isLoading) {
    return <LoadingContainer />;
  }

  return (
    <FollowToken
      {...props}
      navigation={navigation}
      tokenList={tokens}
      handleAddFollowToken={handleAddFollowToken}
    />
  );
};

const mapState = state => ({
  account: accountSeleclor.defaultAccount(state),
  wallet: state.wallet
});

const mapDispatch = { setWallet };

FollowTokenContainer.defaultProps = {
  isPrivacy: true,
};

FollowTokenContainer.propTypes = {
  isPrivacy: PropTypes.bool,
  account: PropTypes.object.isRequired,
  wallet: PropTypes.object.isRequired,
  setWallet: PropTypes.func.isRequired,
  navigation: PropTypes.object.isRequired,
};

export default connect(
  mapState,
  mapDispatch
)(FollowTokenContainer);
