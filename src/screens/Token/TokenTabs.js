import React from 'react';
import { TabView } from '@src/components/core';
import TokenList from './TokenList';
import PropTypes from 'prop-types';

const TokenTabs = ({listNormalTokens, listPrivacyTokens, tabRef, navigation, accountWallet }) => {

  const ListPrivacyToken = () => (<TokenList tokens={listPrivacyTokens} navigation={navigation} accountWallet={accountWallet} />);
  const ListNormalToken = () => (<TokenList tokens={listNormalTokens} navigation={navigation} accountWallet={accountWallet}/>);

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

  return (
    <TabView
      tabRef={tabRef}
      defaultIndex={0}
      data={tabData}
    />
  );
};

TokenTabs.propTypes = {
  tabRef: PropTypes.func,
  listNormalTokens : PropTypes.array,
  listPrivacyTokens : PropTypes.array,
  navigation: PropTypes.object,
  accountWallet: PropTypes.object
};

export default TokenTabs;