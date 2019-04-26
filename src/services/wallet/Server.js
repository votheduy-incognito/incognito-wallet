import storage from '@src/services/storage';
import CONSTANT_KEYS from '@src/constants/keys';

export default class Server {
  static get() {
    return storage.getItem(CONSTANT_KEYS.SERVERS);
  }

  static getDefault() {
    return storage.getItem(CONSTANT_KEYS.SERVERS)
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

  static setDefault() {
    storage.setItem(CONSTANT_KEYS.SERVERS, [
      {
        default: false,
        address: 'http://localhost:9334',
        username: '',
        password: '',
        name: 'Local'
      },
      {
        default: true,
        address: 'https://test-node-constant-chain.constant.money',
        username: '',
        password: '',
        name: 'Testnet'
      }
    ]);
  }

  static set(data) {
    storage.setItem(CONSTANT_KEYS.SERVERS, data);
  }
}
