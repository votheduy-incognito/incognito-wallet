import { API_BASE_URL, PASSWORD_SECRET_KEY, SHARD_ID, EXPLORER_CONSTANT_CHAIN_URL, PASSPHRASE_WALLET_DEFAULT, TESTNET_SERVER_ADDRESS } from 'react-native-dotenv';

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
  API_BASE_URL,
  PASSWORD_SECRET_KEY,
  SHARD_ID,
  EXPLORER_CONSTANT_CHAIN_URL,
  DEFAULT_LIST_SERVER,
  PASSPHRASE_WALLET_DEFAULT
};