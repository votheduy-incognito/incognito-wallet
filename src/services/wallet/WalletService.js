import { Wallet, RpcClient } from 'constant-chain-web-js/build/wallet';
import storage from '@src/services/storage';
import { getPassphrase } from './passwordService';
import Server from './Server';
import { getMaxShardNumber } from './RpcClientService';

const numOfAccount = 1;
const walletName = 'wallet1';

export async function loadWallet() {
  const server = Server.getDefault();
  console.log('[loadWallet] with server ', server);
  Wallet.RpcClient = new RpcClient(
    server.address,
    server.username,
    server.password
  );

  try {
    Wallet.ShardNumber = await getMaxShardNumber();
    console.log('Wallet.ShardNumber: ', Wallet.ShardNumber);
  } catch (e) {
    console.log(e);
  }

  console.log('Wallet when load wallet:', Wallet);
  const passphrase = await getPassphrase();
  const wallet = new Wallet();
  wallet.Storage = storage;

  await wallet.loadWallet(passphrase);
  console.log('Wallet after loading', wallet);

  // update status history
  updateStatusHistory(wallet);

  if (wallet.Name) {
    return wallet;
  }
  return false;
}

export async function initWallet() {
  try {
    console.log('storage', storage);
    const passphrase = await getPassphrase();
    const wallet = new Wallet();
    wallet.Storage = storage;
    wallet.init(
      passphrase,
      numOfAccount,
      walletName,
      storage,
      '1'
    );

    await wallet.save(passphrase);
    console.log('Wallet after initing kraken: ', wallet);
    return wallet;
  } catch (e) {
    throw e;
  }
}

export async function saveWallet(wallet) {
  wallet.save(await getPassphrase());
}

export async function updateStatusHistory(wallet) {
  console.log('UPDATING HISTORY STATUS....');
  await wallet.updateStatusHistory();
  await saveWallet(wallet);
  // wallet.save(await getPassphrase());
}

export function clearCache(wallet) {
  wallet.clearCached();
}
