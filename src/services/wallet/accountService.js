/* eslint-disable import/no-cycle */
import { CONSTANT_CONFIGS, CONSTANT_KEYS } from '@src/constants';
import tokenModel from '@src/models/token';
import storage from '@src/services/storage';
import axios from 'axios';
import { KeyWallet, Wallet,AccountWallet } from 'incognito-chain-web-js/build/wallet';
import _ from 'lodash';
import { getUserUnfollowTokenIDs, setUserUnfollowTokenIDs } from './tokenService';
import { getActiveShard } from './RpcClientService';
import { loadListAccountWithBLSPubKey, saveWallet } from './WalletService';
import { CustomError, ErrorCode } from '../exception';

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
  static async createAndSendNativeToken(paymentInfos, fee, isPrivacy, account, wallet, info) {
    console.log('Wallet.ProgressTx: ', Wallet.ProgressTx);
    // paymentInfos: payment address string, amount in Number (miliconstant)
    // await Wallet.resetProgressTx();
    // console.log('Wallet.ProgressTx: ', Wallet.ProgressTx);
    const indexAccount = wallet.getAccountIndexByName(account.name || account.AccountName);

    console.log('Account', account);

    // create and send constant
    let result;
    try {
      const infoStr = ![undefined, null].includes(info) ? JSON.stringify(info) : undefined;
      result = await wallet.MasterAccount.child[
        indexAccount
      ].createAndSendNativeToken(paymentInfos, fee, isPrivacy, infoStr);

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
      const url = CONSTANT_CONFIGS.MASTER_NODE_ADDRESS;
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

  static async sendGameToken(
    submitParam,
    account,
    info,
  ) {
    try {
      const url = CONSTANT_CONFIGS.MASTER_NODE_ADDRESS;
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

  static async staking(param, feeNativeToken, candidatePaymentAddress, account, wallet, rewardReceiverPaymentAddress, autoReStaking = false) {
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
      ].createAndSendStakingTx(param, feeNativeToken, candidatePaymentAddress, candidateMiningSeedKey, rewardReceiverPaymentAddress, autoReStaking);

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
  static async createAccount(accountName, wallet, initShardID) {
    const activeShardNumber = await getActiveShard();
    let shardID = _.isNumber(initShardID) ? initShardID : CONSTANT_CONFIGS.SHARD_ID;
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
    const indexAccount = wallet.getAccountIndexByName(account.name || account.AccountName);

    return wallet.MasterAccount.child[indexAccount].getBalance(tokenId);
  }

  static parseShard(account) {
    const bytes = account.PublicKeyBytes;
    const arr = bytes.split(',');
    const lastByte = arr[arr.length - 1];
    return lastByte % 8;
  }


  static getFollowingTokens(account, wallet){
    const indexAccount = wallet.getAccountIndexByName(account.name);
    return wallet.MasterAccount.child[indexAccount].listFollowingTokens()?.map(tokenModel.fromJson);
  }

  static async addFollowingTokens(tokens, account, wallet) {
    const indexAccount = wallet.getAccountIndexByName(account.name);
    await wallet.MasterAccount.child[indexAccount].addFollowingToken(...tokens);

    // remove these tokenIds out of tracking list
    const followList = tokens.map(t => t.ID);
    const prevList = await getUserUnfollowTokenIDs();
    const newList = _.difference(prevList, followList);
    setUserUnfollowTokenIDs(newList);
  }

  static async removeFollowingToken(tokenId, account, wallet) {
    const indexAccount = wallet.getAccountIndexByName(account.name);
    await wallet.MasterAccount.child[indexAccount].removeFollowingToken(
      tokenId
    );

    // save these tokenIds for tracking list token of user
    const prevList = await getUserUnfollowTokenIDs();

    prevList.push(tokenId);
    setUserUnfollowTokenIDs(prevList);

    return wallet;
  }

  /**
   *
   * @param {string} tokenID
   * @param {string} accountName
   * @param {object} wallet
   * @param {bool} isGetAll
   * @returns {map[TokenID] : number}
   */
  static async getRewardAmount(tokenID, paymentAddrStr,isGetAll = false) {
    if(_.isEmpty(paymentAddrStr)) throw new CustomError(ErrorCode.payment_address_empty,{name:'payment address is empty'});
    let result = null;
    try {
      result = await AccountWallet?.getRewardAmount(paymentAddrStr,isGetAll,tokenID);
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

  /**
   * get all of tokens that have balance in the account, even it hasnt been added to following list
   * return array of { id: TokenID, amount }
   *
   * @param {object} account
   * @param {object} wallet
   */
  static async getListTokenHasBalance(account, wallet) {
    try {
      if (!account) throw new Error('Account is required');

      const accountWallet = wallet.getAccountByName(account.name);

      if (accountWallet) {
        const list = await accountWallet.getAllPrivacyTokenBalance();

        return list?.map(tokenData => ({
          amount: tokenData?.Balance,
          id: tokenData?.TokenID,
        })) || [];
      } else {
        throw new Error('Can not get list coin has balance of non-existed account');
      }
    } catch (e) {
      throw e;
    }
  }

  static async createAndSendTxWithNativeTokenContribution(wallet, account, fee, pdeContributionPairID, contributedAmount, info = '') {
    let indexAccount = wallet.getAccountIndexByName(account.name || account.AccountName);
    let result;
    try {
      result = await wallet.MasterAccount.child[
        indexAccount
      ].createAndSendTxWithNativeTokenContribution(fee, pdeContributionPairID, contributedAmount, info);
    } catch (e) {
      throw e;
    }
    return result;
  }

  static async createAndSendPTokenContributionTx(wallet, account, tokenParam, feeNativeToken, feePToken, pdeContributionPairID, contributedAmount) {
    let indexAccount = wallet.getAccountIndexByName(account.name || account.AccountName);
    let result;
    try {
      result = await wallet.MasterAccount.child[
        indexAccount
      ].createAndSendPTokenContributionTx(tokenParam, feeNativeToken, feePToken, pdeContributionPairID, contributedAmount);
    } catch (e) {
      throw e;
    }
    return result;
  }

  static async createAndSendNativeTokenTradeRequestTx(wallet, account, fee, tokenIDToBuyStr, sellAmount, minimumAcceptableAmount, tradingFee, info = '') {
    let indexAccount = wallet.getAccountIndexByName(account.name || account.AccountName);
    let result;
    try {
      console.debug('CREATE AND SEND NATIVE TOKEN TRADE', fee, tokenIDToBuyStr, sellAmount, minimumAcceptableAmount, tradingFee, info);
      result = await wallet.MasterAccount.child[
        indexAccount
      ].createAndSendNativeTokenTradeRequestTx(fee, tokenIDToBuyStr, sellAmount, minimumAcceptableAmount, tradingFee, info);
    } catch (e) {
      throw e;
    }
    return result;
  }

  static async createAndSendPTokenTradeRequestTx(wallet, account, tokenParam, feeNativeToken, feePToken, tokenIDToBuyStr, sellAmount, minimumAcceptableAmount, tradingFee) {
    let indexAccount = wallet.getAccountIndexByName(account.name || account.AccountName);
    let result;

    try {
      console.debug('CREATE AND SEND PTOKEN TRADE', tokenParam, feeNativeToken, feePToken, tokenIDToBuyStr, sellAmount, minimumAcceptableAmount, tradingFee);
      result = await wallet.MasterAccount.child[
        indexAccount
      ].createAndSendPTokenTradeRequestTx(tokenParam, feeNativeToken, feePToken, tokenIDToBuyStr, sellAmount, minimumAcceptableAmount, tradingFee);
    } catch (e) {
      throw e;
    }
    return result;
  }

  static async createAndSendWithdrawDexTx(wallet, account, fee, withdrawalToken1IDStr, withdrawalToken2IDStr, withdrawalShareAmt, info = '') {
    let indexAccount = wallet.getAccountIndexByName(account.name || account.AccountName);
    let result;
    try {
      result = await wallet.MasterAccount.child[
        indexAccount
      ].createAndSendWithdrawDexTx(fee, withdrawalToken1IDStr, withdrawalToken2IDStr, withdrawalShareAmt, info);
    } catch (e) {
      throw e;
    }
    return result;
  }

  static isNotEnoughCoinError(error, tokenAmount, tokenFee, tokenBalance, prvBalance, prvFee) {
    tokenAmount = tokenAmount || 0;
    tokenFee = tokenFee || 0;
    tokenBalance = tokenBalance || 0;
    prvBalance = prvBalance || 0;
    prvFee = prvFee || 0;
    console.debug('ERROR', error, tokenAmount, tokenFee, tokenBalance, prvFee, prvBalance);
    console.debug('CONDITION', tokenAmount + tokenFee <= tokenBalance, prvFee <= prvBalance);
    return tokenAmount + tokenFee <= tokenBalance && prvFee <= prvBalance;
  }

  static isNotEnoughCoinErrorCode(error) {
    return error.code === 'WEB_JS_ERROR(-5)';
  }
}
