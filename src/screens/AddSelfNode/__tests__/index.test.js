import 'react-native';
import React from 'react';
import renderer from 'react-test-renderer';

import AddSelfNodeComponent from '../index';

jest.mock('@react-native-community/async-storage', () => ({
  getItem: (key) => {
    const { KEY_SAVE } = require('@src/utils/LocalDatabase');
    if (key === KEY_SAVE.USER) {
      return JSON.stringify({
        'email': '76a6f0e12f64f7f4@minerX.com',
        'fullname': '',
        'id': 2202,
        'token': 'eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJlbWFpbCI6Ijc2YTZmMGUxMmY2NGY3ZjRAbWluZXJYLmNvbSIsImV4cCI6MTU3MTU0NTYyNiwiaWQiOjE1NDExN30.1deLvmSNaO4R3nU0qMtaSLD_HxNxYYYkeyYC-WEjeBs',
        'refresh_token': 'eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJlbWFpbCI6Ijc2YTZmMGUxMmY2NGY3ZjRAbWluZXJYLmNvbSIsImV4cCI6MTg4NDMxMzYyNiwiaWQiOjE1NDExNywic2FsdCI6Ijc0YzNkNmEzLTAzNTUtNDZjZi1iODZiLTAwZTg2YjdlZmQ2MCJ9.KbWrsrv4LOlmB_KVfO1HIhrPLJgUBN-aWWqnwNQatZE',
        'user_hash': 'at9XafdcJ7TVHzGa',
        'last_update_task': 'Fri, 20 Sep 2019 04:27:06 GMT',
        'birth': '',
        'city': '',
        'code': 'bcb3fa',
        'country': '',
        'created_at': 'Fri, 20 Sep 2019 04:27:06 GMT',
        'credit': 0,
        'gender': '',
        'phone': ''
      });
    }
    if (key === KEY_SAVE.LIST_DEVICE) {
      return '[{"minerInfo":{"account":{},"ipAddress":"172.105.200.109","port":"9334"},"product_name":"172.105.200.109","created_from":"android","address":"NewYork","address_long":0,"address_lat":0,"platform":"MINER","product_type":"VIRTUAL","timezone":"Asia/Jakarta","user_id":2202,"email":"76a6f0e12f64f7f4@minerX.com","id":2202,"product_id":"VIRTUAL-1570520815279","created_at":"Fri, 20 Sep 2019 04:27:06 GMT","deleted":false,"is_checkin":1}]';
    }
  },
  setItem: () => 'setItem',
}));

test('Add node success', async () => {
  const component = renderer.create(<AddSelfNodeComponent />);
  const instance = component.getInstance();

  instance.setState({ loading: false });
  instance.inputHost = '172.105.200.109';
  const result = await instance.handleSetUpPress();
  expect(result).toBeTruthy();
});

test('Add node failed', async () => {
  const component = renderer.create(<AddSelfNodeComponent />);
  const instance = component.getInstance();

  instance.setState({ loading: false });
  instance.inputHost = '';
  const result = await instance.handleSetUpPress();
  expect(result).toBe(undefined);
});