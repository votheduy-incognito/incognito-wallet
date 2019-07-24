/* eslint-disable import/no-cycle */
import storage from '@src/services/storage';
import {
  ConfirmedTx as ConfirmedTxWallet,
  genImageFromStr as genImageFromStrWallet,
  RpcClient,
  SuccessTx as SuccessTxWallet,
  Wallet
} from 'incognito-chain-web-js/build/wallet';
import { randomBytes } from 'react-native-randombytes';
import { getPassphrase } from './passwordService';
import { getMaxShardNumber } from './RpcClientService';
import Server from './Server';

const numOfAccount = 1;
const walletName = 'wallet1';

export const genImageFromStr = genImageFromStrWallet;
export const ConfirmedTx = ConfirmedTxWallet;
export const SuccessTx = SuccessTxWallet;

export async function loadListAccount(wallet) {
  try {
    const listAccountRaw = (await wallet.listAccount()) || [];
    const listAccount =
      listAccountRaw.map(account => ({
        name: account.AccountName,
        value: null,
        PaymentAddress: account.PaymentAddress,
        ReadonlyKey: account.ReadonlyKey,
        PrivateKey: account.PrivateKey,
        PublicKey: account.PublicKey,
        PublicKeyCheckEncode: account.PublicKeyCheckEncode,
        PublicKeyBytes: account.PublicKeyBytes
      })) || [];

    return listAccount;
  } catch (e) {
    throw e;
  }
}

export async function loadWallet(passphrase) {
  const server = await Server.getDefault();
  console.log('[loadWallet] with server ', server);
  Wallet.RandomBytesFunc = randomBytes;
  Wallet.setPrivacyUtilRandomBytesFunc(randomBytes);
  console.log('set randombyte done');
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
  const wallet = new Wallet();
  wallet.Storage = storage;

  await wallet.loadWallet(passphrase);
  console.log('Wallet after loading', wallet);

  if (wallet.Name) {
    // update status history
    updateStatusHistory(wallet);
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

    console.log('wallet.Storage: ', wallet.Storage);

    console.log('wallet.Storage.setItem: ', typeof wallet.Storage.setItem);

    wallet.init(passphrase, numOfAccount, walletName, storage, '1');

    await wallet.save(passphrase);
    console.log('Wallet after initing kraken: ', wallet);
    return wallet;
  } catch (e) {
    throw e;
  }
}

export async function saveWallet(wallet) {
  wallet.Storage = storage;
  wallet.save(await getPassphrase());
}

export function deleteWallet(wallet) {
  wallet.Storage = storage;
  return wallet.deleteWallet();
}

export async function loadHistoryByAccount(wallet, accountName) {
  wallet.Storage = storage;
  return (await wallet.getHistoryByAccount(accountName)) || [];
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
