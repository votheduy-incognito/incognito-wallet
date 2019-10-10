/* eslint-disable import/no-cycle */
import { CONSTANT_CONFIGS, CONSTANT_KEYS } from '@src/constants';
import CONFIG from '@src/constants/config';
import tokenModel from '@src/models/token';
import storage from '@src/services/storage';
import gameAPI from '@src/services/api/game';
import axios from 'axios';
import { KeyWallet, Wallet } from 'incognito-chain-web-js/build/wallet';
import _ from 'lodash';
import { getActiveShard } from './RpcClientService';
import { loadListAccountWithBLSPubKey, saveWallet } from './WalletService';

const TAG = 'Account';
export default class Account {
  static async getDefaultAccountName() {
    try {
      return await storage.getItem(CONSTANT_KEYS.DEFAULT_ACCOUNT_NAME);
    } catch (e) {
      console.error(
        'Error while getting default account index, fallback index to 0'
      );
    }
    return null;
  }

  static saveDefaultAccountToStorage(accountName) {
    return storage.setItem(CONSTANT_KEYS.DEFAULT_ACCOUNT_NAME, accountName);
  }

  static async importAccount(privakeyStr, accountName, passPhrase, wallet) {
    // console.log("Wallet when import account: ", wallet);
    let account;
    try {
      account = wallet.importAccount(privakeyStr, accountName, passPhrase);
    } catch (e) {
      console.log(`Error when importing account:  ${e}`);
      throw e;
      // return false;
    }

    if (account.isImport === false) {
      console.log('Account is not imported');
      return false;
    }
    console.log('Account is imported');
    return true;
  }

  static async removeAccount(privateKeyStr, passPhrase, wallet) {
    try {
      const result = wallet.removeAccount(privateKeyStr, passPhrase);
      return result;
    } catch (e) {
      return e;
    }
  }

  // paymentInfos = [{ paymentAddressStr: toAddress, amount: amount}];
  static async sendConstant(paymentInfos, fee, isPrivacy, account, wallet, info) {
    console.log('Wallet.ProgressTx: ', Wallet.ProgressTx);
    // paymentInfos: payment address string, amount in Number (miliconstant)
    // await Wallet.resetProgressTx();
    // console.log('Wallet.ProgressTx: ', Wallet.ProgressTx);
    const indexAccount = wallet.getAccountIndexByName(account.name);

    console.log('Account', account);

    // create and send constant
    let result;
    try {
      result = await wallet.MasterAccount.child[
        indexAccount
      ].createAndSendConstant(paymentInfos, fee, isPrivacy, info);

      console.log(
        'Spendingcoin after sendConstant: ',
        wallet.MasterAccount.child[indexAccount].spendingCoins
      );

      // save wallet
      await saveWallet(wallet);
    } catch (e) {
      throw e;
    }
    await Wallet.resetProgressTx();
    return result;
  }

  static async sendGameConstant(paymentInfos, fee, isPrivacy, account, wallet, info) {
    let result;
    try {
      const url = CONFIG.TESTNET_SERVER_ADDRESS;
      const paymentAddress = {
        [paymentInfos[0].paymentAddressStr]: paymentInfos[0].amount
      };
      const data = {
        'jsonrpc':'1.0',
        'id': '1',
        'method':'createandsendtransaction',
        'params':[
          account.PrivateKey,
          paymentAddress,
          5,
          0,
          null,
          info || ''
        ],
      };

      console.log('sendGameConstant', JSON.stringify(data));
      const res = await axios.post(url, data);
      if (res?.data?.Result) {
        return res.data.Result;
      } else if (res?.data?.Error) {
        throw res.data.Error;
      }
    } catch (e) {
      console.log('sendGameConstant', e);
      throw e;
    }
    return result;
  }

  static async migrateBalance(oldAccount, newAccount, balance) {
    let result;
    try {
      const url = CONFIG.TESTNET_SERVER_ADDRESS;
      const paymentAddress = {
        [newAccount.PaymentAddress]: balance
      };
      const data = {
        'jsonrpc':'1.0',
        'id': '1',
        'method':'createandsendtransaction',
        'params':[
          oldAccount.PrivateKey,
          paymentAddress,
          0,
          0,
          null,
          'migration'
        ],
      };

      console.log('migration', JSON.stringify(data));
      const res = await axios.post(url, data);
      if (res?.data?.Result) {
        return res.data.Result;
      } else if (res?.data?.Error) {
        throw res.data.Error;
      }
    } catch (e) {
      console.log('sendGameConstant', e);
      throw e;
    }
    return result;
  }

  static async sendGameToken(
    submitParam,
    account,
    info,
  ) {
    try {
      const url = CONFIG.TESTNET_SERVER_ADDRESS;
      const data = {
        'jsonrpc':'1.0',
        'id': '1',
        'method':'createandsendprivacycustomtokentransaction',
        'params':[
          account.PrivateKey,
          null,
          5,
          0,
          submitParam,
          0,
          info || '',
        ],
      };
      console.log('Send Game Token', JSON.stringify(data));
      const res = await axios.post(url, data);

      if (res?.data?.Result) {
        return res.data.Result;
      } else if (res?.data?.Error) {
        throw res.data.Error;
      }
    } catch (e) {
      console.log('sendGameToken error', e);
      throw e;
    }
  }

  static async migrate(wallet) {
    const accounts = await wallet.listAccount();
    if (accounts.length === 1) {
      const firstAccount = accounts[0];
      const bytes = firstAccount.PublicKeyBytes.split(',');
      const lastByte = bytes[bytes.length - 1];
      const passPhrase = CONSTANT_CONFIGS.PASSPHRASE_WALLET_DEFAULT;
      if (lastByte % 8 === 1) {
        await this.removeAccount(firstAccount.PrivateKey, passPhrase, wallet);
        const newAccount = await this.createAccount(firstAccount.AccountName, wallet);
        const balance = await this.getBalance(firstAccount, wallet);

        await this.migrateBalance(firstAccount, newAccount, balance);
        await gameAPI.migrateAccount(firstAccount, newAccount);
      }
    }
  }

  // param = { type: Number(stakingType), burningAddress: BurnAddress }
  // static async staking(param, fee, candidatePaymentAddress, isRewardFunder, account, wallet) {
  //   if (!param || typeof param?.type !== 'number') throw new Error('Invalid staking param');
  //   if (!candidatePaymentAddress) throw new Error('Missing candidatePaymentAddress');
  //   if (!account) throw new Error('Missing account');
  //   if (!wallet) throw new Error('Missing wallet');
  //   // param: payment address string, amount in Number (miliconstant)
  //   await Wallet.resetProgressTx();
  //   const indexAccount = wallet.getAccountIndexByName(account.name);
  //   // create and send constant
  //   let result;
  //   try {
  //     result = await wallet.MasterAccount.child[
  //       indexAccount
  //     ].createAndSendStakingTx(param, fee, candidatePaymentAddress, isRewardFunder);

  //     // save wallet
  //     await saveWallet(wallet);
  //   } catch (e) {
  //     throw e;
  //   }
  //   await Wallet.resetProgressTx();
  //   return result;
  // }

  static async staking(param, fee, candidatePaymentAddress, account, wallet, rewardReceiverPaymentAddress, autoReStaking = false) {
    if (!param || typeof param?.type !== 'number') throw new Error('Invalid staking param');
    if (!candidatePaymentAddress) throw new Error('Missing candidatePaymentAddress');
    if (!account) throw new Error('Missing account');
    if (!wallet) throw new Error('Missing wallet');
    // param: payment address string, amount in Number (miliconstant)
    await Wallet.resetProgressTx();
    const indexAccount = wallet.getAccountIndexByName(account.name);
    const candidateMiningSeedKey = account.ValidatorKey;
    // create and send constant
    let result;
    try {
      result = await wallet.MasterAccount.child[
        indexAccount
      ].createAndSendStakingTx(param, fee, candidatePaymentAddress, candidateMiningSeedKey, rewardReceiverPaymentAddress, autoReStaking);

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

  // // create new account
  // static async createAccount(accountName, wallet) {
  //   const activeShardNumber = await getActiveShard();
  //   let shardID = CONSTANT_CONFIGS.SHARD_ID;
  //   if (shardID) {
  //     shardID = Math.floor(Math.random() * (activeShardNumber - 1));
  //   }

  //   return wallet.createNewAccount(accountName, shardID);
  // }

  // create new account hienton
  static async createAccount(accountName, wallet) {
    const activeShardNumber = await getActiveShard();
    let shardID = CONSTANT_CONFIGS.SHARD_ID;
    if (
      shardID &&
      (parseInt(shardID) >= parseInt(activeShardNumber) ||
        parseInt(shardID) < 0)
    ) {
      shardID = Math.floor(Math.random() * (activeShardNumber - 1));
    }

    const result = await wallet.createNewAccount(accountName, shardID);
    return result;
  }

  // get progress tx
  static getProgressTx() {
    console.log('Wallet.progressTx: ', Wallet.ProgressTx);
    return Wallet.ProgressTx;
  }

  static checkPaymentAddress(paymentAddrStr) {
    try {
      const key = KeyWallet.base58CheckDeserialize(paymentAddrStr);
      const paymentAddressObj = key?.KeySet?.PaymentAddress || {};
      if (paymentAddressObj.Pk?.length === 32 && paymentAddressObj.Tk?.length === 32) {
        return true;
      }
    } catch (e) {
      return false;
    }

    return false;
  }

  /**
   * 
   * @param {object} account 
   * @param {object} wallet 
   * @param {string} tokenId 
   * 
   * If `tokenId` is not passed, this method will return native token (PRV) balance, else custom token balance (from `tokenId`)
   */
  static async getBalance(account, wallet, tokenId) {
    const indexAccount = wallet.getAccountIndexByName(account.name);
    return await wallet.MasterAccount.child[indexAccount].getBalance(tokenId);
  }

  static getFollowingTokens(account, wallet){
    const indexAccount = wallet.getAccountIndexByName(account.name);
    return wallet.MasterAccount.child[indexAccount].listFollowingTokens()?.map(tokenModel.fromJson);
  }

  static async addFollowingTokens(tokens, account, wallet) {
    const indexAccount = wallet.getAccountIndexByName(account.name);
    await wallet.MasterAccount.child[indexAccount].addFollowingToken(...tokens);
  }

  static async removeFollowingToken(tokenId, account, wallet) {
    const indexAccount = wallet.getAccountIndexByName(account.name);
    await wallet.MasterAccount.child[indexAccount].removeFollowingToken(
      tokenId
    );
    return wallet;
  }

  /**
   *
   * @param {string} tokenID
   * @param {string} accountName
   * @param {object} wallet
   * @param {bool} isGetAll
   */
  static async getRewardAmount(tokenID, accountName, wallet,isGetAll = false) {
    
    const accountWallet = wallet.getAccountByName(accountName);
    let result = 0;
    try {
      result = await accountWallet?.getRewardAmount(isGetAll,tokenID);
    } catch (e) {
      throw e;
    }
    return result;
  }

  /**
   *
   * @param {string} tokenID
   * @param {object} account
   * @param {object} wallet
   */
  static async createAndSendWithdrawRewardTx(tokenID, account, wallet) {
    let indexAccount = wallet.getAccountIndexByName(account.name);
    let result;
    try {
      result = await wallet.MasterAccount.child[
        indexAccount
      ].createAndSendWithdrawRewardTx(tokenID);
    } catch (e) {
      throw e;
    }
    return result;
  }

  /**
   *
   * @param {object} accountWallet
   */
  static toSerializedAccountObj(accountWallet) {
    return accountWallet.toSerializedAccountObj();
  }

  /**
   *
   * @param {object} account
   * @param {object} wallet
   */
  // stakerStatus returns -1 if account haven't staked,
  // returns 0 if account is a candidator and
  // returns 1 if account is a validator
  static stakerStatus(account, wallet) {
    const accountWallet = wallet.getAccountByName(account?.name);
    return accountWallet.stakerStatus();
  }

  /**
   * 
   * @param {string} blsKey 
   * @param {object} wallet 
   * @returns :AccountModel: template
   */
  static async getAccountWithBLSPubKey(blsKey,wallet) {
    try {
      let accountWallet = null;
      if(!_.isEmpty(blsKey)){
        console.log(TAG,'getAccountWithBLSPubKey begin');
        const listAccounts = await loadListAccountWithBLSPubKey(wallet)||[];
        console.log(TAG,'getAccountWithBLSPubKey listAccount ',listAccounts);
        let account = listAccounts.find(item=> _.isEqual(item.BLSPublicKey,blsKey));

        account = account? await wallet.getAccountByName(account.AccountName):null;
        console.log(TAG,'getAccountWithBLSPubKey end ---- ',account);
        // accountWallet = account? new AccountModel(account):null;
        accountWallet = account;
      }
      return accountWallet;

    } catch (e) {
      console.warn(TAG,'getAccountWithBLSPubKey error =',e );
    }
    return null;
  }
}
