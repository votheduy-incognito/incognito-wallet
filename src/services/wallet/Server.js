import storage from '@src/services/storage';
import { CONSTANT_KEYS, CONSTANT_CONFIGS } from '@src/constants';

let cachedList = null;

export default class Server {
  static get() {
    if (cachedList) {
      return Promise.resolve(cachedList);
    }
    return storage.getItem(CONSTANT_KEYS.SERVERS)
      .then(strData => {
        cachedList = JSON.parse(strData);
        return cachedList;
      });
  }

  static getDefault() {
    return Server.get()
      .then(result => {
        if (result && result.length) {
          for (const s of result) {
            if (s.default) {
              return s;
            }
          }
        }
      });
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

  static setDefaultList() {
    try {
      cachedList = CONSTANT_CONFIGS.DEFAULT_LIST_SERVER;
      const strData = JSON.stringify(cachedList);
      return storage.setItem(CONSTANT_KEYS.SERVERS, strData);
    } catch (e) {
      throw e;
    }
  }

  static set(servers) {
    cachedList = servers;
    const strData = JSON.stringify(cachedList);
    return storage.setItem(CONSTANT_KEYS.SERVERS, strData);
  }
}
