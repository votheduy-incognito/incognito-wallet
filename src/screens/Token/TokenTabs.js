import { TabView } from '@src/components/core';
import PropTypes from 'prop-types';
import React from 'react';
import TokenList from './TokenList';

const TokenTabs = ({
  listNormalTokens,
  listPrivacyTokens,
  tabRef,
  navigation,
  accountWallet,
  ...otherProps
}) => {
  const props = {
    navigation,
    accountWallet,
    ...otherProps
  };
  const ListPrivacyToken = () => (
    <TokenList tokens={listPrivacyTokens} {...props} />
  );
  const ListNormalToken = () => (
    <TokenList tokens={listNormalTokens} {...props} />
  );

  const tabData = [
    {
      key: 'privacy',
      title: 'PRIVACY',
      screen: ListPrivacyToken
    },
    {
      key: 'normal',
      title: 'NORMAL',
      screen: ListNormalToken
    }
  ];

  return <TabView tabRef={tabRef} defaultIndex={0} data={tabData} />;
};

TokenTabs.defaultProps = {
  accountWallet: undefined,
  listNormalTokens: undefined,
  listPrivacyTokens: undefined,
  navigation: undefined,
  tabRef: undefined
};

TokenTabs.propTypes = {
  tabRef: PropTypes.func,
  listNormalTokens: PropTypes.objectOf(PropTypes.array),
  listPrivacyTokens: PropTypes.objectOf(PropTypes.array),
  navigation: PropTypes.objectOf(PropTypes.object),
  accountWallet: PropTypes.objectOf(PropTypes.object)
};

export default TokenTabs;
