import React from 'react';
import { TabView } from '@src/components/core';
import Token from '@src/screens/Token';
import History from '@src/screens/History';
import AccountDetail from '@src/screens/AccountDetail';

this.tabData = [
  {
    key: 'tokens',
    title: 'TOKENS',
    screen: Token
  },
  {
    key: 'history',
    title: 'HISTORY',
    screen: History
  },
  {
    key: 'accountDetail',
    title: 'ACCOUNT DETAIL',
    screen: AccountDetail
  }
];

const HomeTabs = () => (
  <TabView
    defaultIndex={1}
    data={this.tabData}
  />
);

HomeTabs.propTypes = {};


export default HomeTabs;