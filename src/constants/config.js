import {
  API_BASE_URL as TEMPLATE_API_BASE_URL,
  PASSWORD_SECRET_KEY,
  SHARD_ID,
  EXPLORER_CONSTANT_CHAIN_URL as TEMPLATE_EXPLORER_CONSTANT_CHAIN_URL,
  PASSPHRASE_WALLET_DEFAULT,
  TESTNET_SERVER_ADDRESS,
  MAINNET_SERVER_ADDRESS,
  TEST_URL,
  CRYPTO_ICON_URL,
  INCOGNITO_TOKEN_ICON_URL,
  BEP2_URL,
  DEX_BINANCE_TOKEN_URL,

} from 'react-native-dotenv';
import serverService from '@src/services/wallet/Server';
import _ from 'lodash';

const findDefaultNetwork = async () => {
  const networks = await serverService.get();
  const found = networks?.find(_ => _.default);
  return found;
};
const BUILD_VERSION = '3.2.3';
const isMainnet = true;
//findDefaultNetwork()?.id === 'mainnet';
// console.log('CONFIG begin = ',TEMPLATE_API_BASE_URL);
// const isMainnet = true;
const regex = /<%=.*%>/;
const prefix_network = isMainnet ?'mainnet':'testnet';
const prefix_Api = isMainnet?'':'test-';

const API_BASE_URL =  String(TEMPLATE_API_BASE_URL).replace(regex,prefix_Api);

// const EXPLORER_CONSTANT_CHAIN_URL = _.template(TEMPLATE_EXPLORER_CONSTANT_CHAIN_URL)({ 'network': prefix_network });
const EXPLORER_CONSTANT_CHAIN_URL = String(TEMPLATE_EXPLORER_CONSTANT_CHAIN_URL).replace(regex,prefix_network);
const MASTER_NODE_ADDRESS=isMainnet?MAINNET_SERVER_ADDRESS:TESTNET_SERVER_ADDRESS;
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
  default:!isMainnet,
  address: TESTNET_SERVER_ADDRESS,
  username: '',
  password: '',
  name: 'Testnet'
},{
  id: 'mainnet',
  default: isMainnet,
  address: MAINNET_SERVER_ADDRESS,
  username: '',
  password: '',
  name: 'Mainnet'
}];

export default {
  CRYPTO_ICON_URL,
  INCOGNITO_TOKEN_ICON_URL,
  API_BASE_URL,
  PASSWORD_SECRET_KEY,
  SHARD_ID: SHARD_ID || -1,
  EXPLORER_CONSTANT_CHAIN_URL,
  DEFAULT_LIST_SERVER,
  PASSPHRASE_WALLET_DEFAULT,
  TEST_URL,
  TEMPLATE_API_BASE_URL,
  MASTER_NODE_ADDRESS,
  BEP2_URL,
  DEX_BINANCE_TOKEN_URL,
  BUILD_VERSION
};
