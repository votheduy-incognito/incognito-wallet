import storage from '@src/services/storage';
import _ from 'lodash';

export const MAINNET_FULLNODE = 'https://lb-fullnode.incognito.org/fullnode';
export const TESTNET_FULLNODE = 'https://testnet.incognito.org/fullnode';
export const DEV_TESTNET_FULLNODE = 'https://dev-test-node.incognito.org/fullnode';

const isMainnet = global.isMainnet??true;
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
    default:!isMainnet,
    address: TESTNET_FULLNODE,
    username: '',
    password: '',
    name: 'Testnet'
  },
  {
    id: 'devtestnet',
    default:!isMainnet,
    address: DEV_TESTNET_FULLNODE,
    username: '',
    password: '',
    name: 'Dev Testnet'
  },{
    id: 'mainnet',
    default: isMainnet,
    address: MAINNET_FULLNODE,
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
        cachedList = JSON.parse(strData) || [];
        if (cachedList.length === 4) {
          cachedList.push( {
            id: 'testnet2',
            default: false,
            address: 'http://51.161.119.66:9334',
            username: '',
            password: '',
            name: 'Testnet 2'
          });
        }

        storage.setItem(KEY.SERVER, JSON.stringify(cachedList));
        return cachedList;
      });
  }

  static getDefault() {
    return Server.get()
      .then(result => {
        if (result && result.length) {
          for (const s of result) {
            if (s.default) {
              return {
                ...s,
                address: s.address === TESTNET_FULLNODE ? 'http://51.83.36.184:20001' : s.address,
              };
            }
          }
        }
      });
  }

  static async getDefaultIfNullGettingDefaulList() {
    const list = await Server.get().catch(console.log) || KEY.DEFAULT_LIST_SERVER;
    return list?.find(_ => _.default);
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
    return  _.isEqual(network?.id, 'mainnet');
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
