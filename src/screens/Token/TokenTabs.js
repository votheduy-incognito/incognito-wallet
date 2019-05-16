import React from 'react';
import { TabView } from '@src/components/core';
import TokenList from './TokenList';
import PropTypes from 'prop-types';

const TokenTabs = ({listNormalTokens, listPrivacyTokens, tabRef }) => {

  const ListPrivacyToken = () => (<TokenList tokens={listPrivacyTokens} />);
  const ListNormalToken = () => (<TokenList tokens={listNormalTokens} />);

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
};

export default TokenTabs;