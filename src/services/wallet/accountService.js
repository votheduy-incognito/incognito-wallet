import { KeyWallet, Wallet } from 'constant-chain-web-js/build/wallet';
import { getPassphrase } from './passwordService';
import { getActiveShard } from './RpcClientService';
import { CONSTANT_CONFIGS } from '@src/constants';

export default class Account {
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

  static async sendConstant(param, fee, isPrivacy, account, wallet) {
    // param: payment address string, amount in Number (miliconstant)
    await Wallet.resetProgressTx();
    const indexAccount = wallet.getAccountIndexByName(account.name);
    // create and send constant
    let result;
    try {
      result = await wallet.MasterAccount.child[
        indexAccount
      ].createAndSendConstant(param, fee, isPrivacy);

      console.log(
        'Spendingcoin after sendConstant: ',
        wallet.MasterAccount.child[indexAccount].spendingCoins
      );

      // save wallet
      wallet.save(getPassphrase());
    } catch (e) {
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
      wallet.save(getPassphrase());
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
      wallet.save(getPassphrase());
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
}
