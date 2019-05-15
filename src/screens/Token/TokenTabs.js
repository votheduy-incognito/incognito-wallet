import React from 'react';
import { TabView } from '@src/components/core';

this.tabData = [
  {
    key: 'privacy',
    title: 'PRIVACY'
  },
  {
    key: 'normal',
    title: 'NORMAL'
  }
];

const TokenTabs = () => (
  <TabView
    defaultIndex={1}
    data={this.tabData}
  />
);

TokenTabs.propTypes = {};

export default TokenTabs;