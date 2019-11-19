import storage from '@src/services/storage';
import {
  TESTNET_SERVER_ADDRESS,
  MAINNET_SERVER_ADDRESS,
} from 'react-native-dotenv';
import _ from 'lodash';

let cachedList = null;
export const KEY = {
  SERVER: '$servers',
  DEFAULT_LIST_SERVER:[{
    id: 'local',
    default: false,
    address: 'http://localhost:9334',
    username: '',
    password: '',
    name: 'Local'
  },
  {
    id: 'testnet',
    default:false,
    address: TESTNET_SERVER_ADDRESS,
    username: '',
    password: '',
    name: 'Testnet'
  },{
    id: 'mainnet',
    default: true,
    address: MAINNET_SERVER_ADDRESS,
    username: '',
    password: '',
    name: 'Mainnet'
  }]
};
export default class Server {
  static get() {
    if (cachedList) {
      return Promise.resolve(cachedList);
    }
    return storage.getItem(KEY.SERVER)
      .then(strData => {
        cachedList = JSON.parse(strData)||[];
        return cachedList;
      });
  }

  static getDefault() {
    return Server.get()
      .then(result => {
        if (result && result.length) {
          for (const s of result) {
            // console.log('getDefault s = ',s);
            if (s.default) {
              return s;
            }
          }
        }
      });
  }

  static async getDefaultIfNullGettingDefaulList() {
    const list = await Server.get().catch(console.log) || KEY.DEFAULT_LIST_SERVER;
    const found = list?.find(_ => _.default);
    // console.log('getDefaultIfNullGettingDefaulList found = ',found);
    return found;
  }

  static async setDefault(defaultServer) {
    try {
      const servers = await Server.get();
      const newServers = servers.map(server => {
        if (defaultServer.id === server.id) {
          return {
            ...defaultServer,
            default: true
          };
        }
        return { ...server, default: false };
      });
      Server.set(newServers);

      return newServers;
    } catch (e) {
      throw e;
    }
  }

  static isMainnet(network):Boolean{
    return  _.isEqual(network?.id,'mainnet');
  }

  static setDefaultList() {
    try {
      cachedList = KEY.DEFAULT_LIST_SERVER;
      const strData = JSON.stringify(cachedList);
      return storage.setItem(KEY.SERVER, strData);
    } catch (e) {
      throw e;
    }
  }

  static set(servers) {
    cachedList = servers;
    const strData = JSON.stringify(cachedList);
    return storage.setItem(KEY.SERVER, strData);
  }
}
