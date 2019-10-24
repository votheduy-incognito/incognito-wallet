import {
  API_BASE_URL,
  PASSWORD_SECRET_KEY,
  SHARD_ID,
  EXPLORER_CONSTANT_CHAIN_URL,
  PASSPHRASE_WALLET_DEFAULT,
  TESTNET_SERVER_ADDRESS,
  TEST_URL,
  CRYPTO_ICON_URL,
  BEP2_URL,
} from 'react-native-dotenv';

const DEFAULT_LIST_SERVER = [{
  id: 'local',
  default: false,
  address: 'http://localhost:9334',
  username: '',
  password: '',
  name: 'Local'
},
{
  id: 'testnet',
  default: true,
  address: TESTNET_SERVER_ADDRESS,
  username: '',
  password: '',
  name: 'Testnet'
}];

export default {
  CRYPTO_ICON_URL,
  API_BASE_URL,
  PASSWORD_SECRET_KEY,
  SHARD_ID: SHARD_ID || -1,
  EXPLORER_CONSTANT_CHAIN_URL,
  DEFAULT_LIST_SERVER,
  PASSPHRASE_WALLET_DEFAULT,
  TEST_URL,
  TESTNET_SERVER_ADDRESS,
  BEP2_URL,
};
