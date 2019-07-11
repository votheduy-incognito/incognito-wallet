import { TabView } from '@src/components/core';
import AccountDetail from '@src/screens/AccountDetail';
import History from '@src/screens/History';
import Token from '@src/screens/Token';
import React from 'react';

const tabData = [
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

const HomeTabs = () => <TabView defaultIndex={1} data={tabData} />;

HomeTabs.propTypes = {};

export default HomeTabs;
