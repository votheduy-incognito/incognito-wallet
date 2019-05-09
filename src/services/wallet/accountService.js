import { KeyWallet, Wallet } from 'constant-chain-web-js/build/wallet';
import storage from '@src/services/storage';
import { getActiveShard, getRpcClient } from './RpcClientService';
import { CONSTANT_CONFIGS, CONSTANT_KEYS, CONSTANT_COMMONS } from '@src/constants';
import { saveWallet } from './WalletService';

export default class Account {
  static async getDefaultAccountIndex() {
    let index = 0;
    try {
      index =  await storage.getItem(CONSTANT_KEYS.DEFAULT_ACCOUNT_INDEX);
    } catch (e) {
      console.error('Error while getting default account index, fallback index to 0');
    }
    return index;
  }

  static async importAccount(privakeyStr, accountName, passPhrase, wallet) {
    // console.log("Wallet when import account: ", wallet);
    const account = wallet.importAccount(privakeyStr, accountName, passPhrase);

    if (account.isImport === false) {
      console.log('Account is not imported');
      return false;
    }

    console.log('Account is imported');
    return true;
  }

  static async removeAccount(privateKeyStr, accountName, passPhrase, wallet) {
    try {
      const result = wallet.removeAccount(privateKeyStr, accountName, passPhrase);
      return result;
    } catch (e) {
      return e;
    }
  }

  // paymentInfos = [{ paymentAddressStr: toAddress, amount: amount}];
  static async sendConstant(paymentInfos, fee, isPrivacy, account, wallet) {
    console.log('Wallet.ProgressTx: ', Wallet.ProgressTx);
    // paymentInfos: payment address string, amount in Number (miliconstant)
    // await Wallet.resetProgressTx();
    // console.log('Wallet.ProgressTx: ', Wallet.ProgressTx);
    const indexAccount = wallet.getAccountIndexByName(account.name);

    console.log('getRpcClient: ', getRpcClient());
    // create and send constant
    let result;
    try {
      result = await wallet.MasterAccount.child[
        indexAccount
      ].createAndSendConstant(paymentInfos, fee, isPrivacy);

      console.log(
        'Spendingcoin after sendConstant: ',
        wallet.MasterAccount.child[indexAccount].spendingCoins
      );

      // save wallet
      await saveWallet(wallet);
      // wallet.save(await getPassphrase());
    } catch (e) {
      console.log('Error when sendConstant', e);
      throw e;
    }
    await Wallet.resetProgressTx();
    return result;
  }

  static async staking(param, fee, account, wallet) {
    // param: payment address string, amount in Number (miliconstant)
    await Wallet.resetProgressTx();
    const indexAccount = wallet.getAccountIndexByName(account.name);
    // create and send constant
    let result;
    try {
      result = await wallet.MasterAccount.child[
        indexAccount
      ].createAndSendStakingTx(param, fee);

      // save wallet
      await saveWallet(wallet);
    } catch (e) {
      throw e;
    }
    await Wallet.resetProgressTx();
    return result;
  }

  static async defragment(amount, fee, isPrivacy, account, wallet) {
    // param: payment address string, amount in Number (miliconstant)
    await Wallet.resetProgressTx();
    const indexAccount = wallet.getAccountIndexByName(account.name);
    // create and send constant
    let result;
    try {
      result = await wallet.MasterAccount.child[indexAccount].defragment(
        amount,
        fee,
        isPrivacy
      );

      // save wallet
      await saveWallet(wallet);
    } catch (e) {
      await Wallet.resetProgressTx();
      throw e;
    }
    await Wallet.resetProgressTx();
    return result;
  }

  // create new account
  static async createAccount(accountName, wallet) {
    const activeShardNumber = await getActiveShard();
    let shardID = CONSTANT_CONFIGS.SHARD_ID;
    if (shardID) {
      shardID = Math.floor(Math.random() * (activeShardNumber - 1));
    }

    return wallet.createNewAccount(accountName, shardID);
  }

  // get progress tx
  static getProgressTx() {
    console.log('Wallet.progressTx: ', Wallet.ProgressTx);
    return Wallet.ProgressTx;
  }

  static checkPaymentAddress(paymentAddrStr) {
    let key;
    try {
      key = KeyWallet.base58CheckDeserialize(paymentAddrStr);
    } catch (e) {
      return false;
    }

    if (key.KeySet.PaymentAddress === null) {
      return false;
    }

    return true;
  }

  static async getBalance(account, wallet){
    const indexAccount = wallet.getAccountIndexByName(account.name);
    return await wallet.MasterAccount.child[
      indexAccount
    ].getBalance().then(balance => Number(balance / CONSTANT_COMMONS.MILICONSTANT_UNIT) || 0);
  }
}
