import React from 'react';
import { TabView } from '@src/components/core';
import History from '@src/screens/History';
import AccountDetail from '@src/screens/AccountDetail';
import Token from '@src/screens/Token';

this.tabData = [
  {
    key: 'token',
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