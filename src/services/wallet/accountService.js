/* eslint-disable import/no-cycle */
import AccountModel from '@models/account';
import { COINS, CONSTANT_COMMONS, CONSTANT_KEYS } from '@src/constants';
import tokenModel from '@src/models/token';
import storage from '@src/services/storage';
import {
  AccountWallet,
  KeyWallet,
  Wallet,
  constants,
} from 'incognito-chain-web-js/build/wallet';
import _ from 'lodash';
import { STACK_TRACE } from '@services/exception/customError/code/webjsCode';
import { cachePromise } from '@services/cache';
import { chooseBestCoinToSpent } from 'incognito-chain-web-js/lib/tx/utils';
import bn from 'bn.js';
import Server from '@services/wallet/Server';
import { CustomError, ErrorCode } from '../exception';
import tokenService from './tokenService';
import {
  loadListAccountWithBLSPubKey,
  saveWallet,
  SuccessTx,
} from './WalletService';

const TAG = 'Account';

export const getBalanceNoCache = (
  indexAccount,
  wallet,
  tokenId,
) => async () => {
  const account = wallet.MasterAccount.child[indexAccount];
  account.isRevealViewKeyToGetCoins = true;

  const balance = await wallet.MasterAccount.child[indexAccount].getBalance(
    tokenId,
  );

  if (Object.keys(account.derivatorToSerialNumberCache).length < 10000) {
    await account.saveAccountCached(wallet.storage, `${wallet.Name}-${account.name}-cached`);
  }

  return balance;
};

const getPendingHistory = (histories, spendingCoins) => {
  histories = histories.filter((item) => item.status === SuccessTx);

  const pendingHistory = histories.find(
    (history) =>
      spendingCoins.find((coin) =>
        history.listUTXOForPToken.includes(coin.SNDerivator),
      ) ||
      spendingCoins.find((coin) =>
        history.listUTXOForPRV.includes(coin.SNDerivator),
      ),
  );

  return !!pendingHistory;
};

const hasSpendingCoins = async (indexAccount, wallet, amount, tokenId) => {
  const account = wallet.MasterAccount.child[indexAccount];
  let coins = await account.getUnspentToken(tokenId, Wallet.RpcClient);

  let histories;

  histories = await account.getNormalTxHistory();
  histories = histories.concat(await account.getPrivacyTokenTxHistory());

  const spendingCoins = chooseBestCoinToSpent(coins, new bn(amount))
    .resultInputCoins;

  return getPendingHistory(histories, spendingCoins);
};

export default class Account {
  static NO_OF_INPUT_PER_DEFRAGMENT_TX = 10;
  static MAX_DEFRAGMENT_TXS = 3;
  static NO_OF_INPUT_PER_DEFRAGMENT =
    Account.NO_OF_INPUT_PER_DEFRAGMENT_TX * Account.MAX_DEFRAGMENT_TXS;

  static async getDefaultAccountName() {
    try {
      return await storage.getItem(CONSTANT_KEYS.DEFAULT_ACCOUNT_NAME);
    } catch (e) {
      console.error(
        'Error while getting default account index, fallback index to 0',
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
      account = await wallet.importAccount(privakeyStr, accountName, passPhrase);
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
    return wallet.removeAccount(privateKeyStr, passPhrase);
  }

  // paymentInfos = [{ paymentAddressStr: toAddress, amount: amount}];
  static async createAndSendNativeToken(
    paymentInfos,
    fee,
    isPrivacy,
    account,
    wallet,
    info = '',
    txHandler,
  ) {
    console.log('Wallet.ProgressTx: ', Wallet.ProgressTx);
    // paymentInfos: payment address string, amount in Number (miliconstant)
    // await Wallet.resetProgressTx();
    // console.log('Wallet.ProgressTx: ', Wallet.ProgressTx);
    const indexAccount = wallet.getAccountIndexByName(
      account.name || account.AccountName,
    );
    // create and send constant
    let result;

    const infoStr = typeof info !== 'string' ? JSON.stringify(info) : info;

    result = await wallet.MasterAccount.child[
      indexAccount
    ].createAndSendNativeToken(paymentInfos, fee, isPrivacy, infoStr, false, txHandler);

    console.log(
      'Spendingcoin after sendConstant: ',
      wallet.MasterAccount.child[indexAccount].spendingCoins,
    );

    // save wallet
    await saveWallet(wallet);
    await Wallet.resetProgressTx();
    return result;
  }

  static createAndSendToken(
    account,
    wallet,
    receiverAddress,
    amount,
    tokenId,
    nativeFee,
    tokenFee,
    prvAmount,
    memo = '',
    txHandler,
  ) {
    if (tokenId === COINS.PRV_ID) {
      const paymentInfos = [
        {
          paymentAddressStr: receiverAddress,
          amount: Math.floor(amount),
        },
      ];

      return Account.createAndSendNativeToken(
        paymentInfos,
        Math.floor(nativeFee),
        true,
        account,
        wallet,
        memo,
        txHandler,
      );
    }

    const receivers = [
      {
        PaymentAddress: receiverAddress,
        Amount: Math.floor(amount),
      },
    ];

    let paymentInfos = null;
    if (prvAmount) {
      paymentInfos = {
        paymentAddressStr: receiverAddress,
        amount: Math.floor(prvAmount),
      };
    }

    const tokenObject = {
      Privacy: true,
      TokenID: tokenId,
      TokenName: 'Name',
      TokenSymbol: 'Symbol',
      TokenTxType: CONSTANT_COMMONS.TOKEN_TX_TYPE.SEND,
      TokenAmount: amount,
      TokenReceivers: receivers,
    };

    return tokenService.createSendPToken(
      tokenObject,
      nativeFee,
      account,
      wallet,
      paymentInfos,
      tokenFee,
      memo,
    );
  }

  static async createAndSendStopAutoStakingTx(
    wallet,
    account,
    feeNativeToken,
    candidatePaymentAddress,
    candidateMiningSeedKey,
  ) {
    const indexAccount = wallet.getAccountIndexByName(
      account.name || account.AccountName,
    );
    let result;
    result = await wallet.MasterAccount.child[
      indexAccount
    ].createAndSendStopAutoStakingTx(
      feeNativeToken,
      candidatePaymentAddress,
      candidateMiningSeedKey,
    );
    await saveWallet(wallet);
    await Wallet.resetProgressTx();
    return result;
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

  static async staking(
    param,
    feeNativeToken,
    candidatePaymentAddress,
    account,
    wallet,
    rewardReceiverPaymentAddress,
    autoReStaking = false,
  ) {
    if (!param || typeof param?.type !== 'number')
      throw new Error('Invalid staking param');
    if (!candidatePaymentAddress)
      throw new Error('Missing candidatePaymentAddress');
    if (!account) throw new Error('Missing account');
    if (!wallet) throw new Error('Missing wallet');
    // param: payment address string, amount in Number (miliconstant)
    await Wallet.resetProgressTx();
    const indexAccount = wallet.getAccountIndexByName(
      account.name || account.AccountName,
    );
    const candidateMiningSeedKey = account.ValidatorKey;
    // create and send constant
    let result;
    try {
      result = await wallet.MasterAccount.child[
        indexAccount
      ].createAndSendStakingTx(
        param,
        feeNativeToken,
        candidatePaymentAddress,
        candidateMiningSeedKey,
        rewardReceiverPaymentAddress,
        autoReStaking,
      );

      // save wallet
      await saveWallet(wallet);
    } catch (e) {
      throw e;
    }
    await Wallet.resetProgressTx();
    return result;
  }

  static async createAccount(accountName, wallet, initShardID) {
    const server = await Server.getDefault();

    if (server.id === 'testnode') {
      let lastByte = null;
      let newAccount;

      while (lastByte !== 0) {
        newAccount = await wallet.createAccount(accountName, 0, wallet.deletedAccountIds || []);
        const childKey = newAccount.key;
        lastByte =
          childKey.KeySet.PaymentAddress.Pk[
            childKey.KeySet.PaymentAddress.Pk.length - 1
          ];
      }

      wallet.MasterAccount.child.push(newAccount);
      await saveWallet(wallet);

      return newAccount;
    }

    let shardID = _.isNumber(initShardID) ? initShardID : undefined;
    if (shardID && parseInt(shardID) < 0) {
      shardID = 0;
    }

    return await wallet.createNewAccount(accountName, shardID, wallet.deletedAccountIds || []);
  }

  // get progress tx
  static getProgressTx() {
    return Wallet.ProgressTx;
  }

  static getDebugMessage() {
    return Wallet.Debug;
  }

  static checkPaymentAddress(paymentAddrStr) {
    try {
      const key = KeyWallet.base58CheckDeserialize(paymentAddrStr);
      const paymentAddressObj = key?.KeySet?.PaymentAddress || {};
      if (
        paymentAddressObj.Pk?.length === 32 &&
        paymentAddressObj.Tk?.length === 32
      ) {
        return true;
      }
    } catch (e) {
      return false;
    }

    return false;
  }

  static validatePrivateKey(privateKey) {
    try {
      const keyWallet = KeyWallet.base58CheckDeserialize(privateKey);
      return !!keyWallet;
    } catch (e) {
      return false;
    }
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
    const key = `balance-${wallet.Name}-${account.name || account.AccountName}-${tokenId ||
      '0000000000000000000000000000000000000000000000000000000000000004'}`;
    const indexAccount = wallet.getAccountIndexByName(
      this.getAccountName(account),
    );

    return await cachePromise(
      key,
      getBalanceNoCache(indexAccount, wallet, tokenId),
    );
  }

  static parseShard(account) {
    const bytes = account.PublicKeyBytes;
    const arr = bytes.split(',');
    const lastByte = arr[arr.length - 1];
    return lastByte % 8;
  }

  static getFollowingTokens(account, wallet) {
    const indexAccount = wallet.getAccountIndexByName(this.getAccountName(account));
    return wallet.MasterAccount.child[indexAccount]
      .listFollowingTokens()
      ?.map(tokenModel.fromJson);
  }

  static async addFollowingTokens(tokens, account, wallet) {
    const indexAccount = wallet.getAccountIndexByName(this.getAccountName(account));
    const walletAccount = wallet.MasterAccount.child[indexAccount];
    await walletAccount.addFollowingToken(...tokens);
    saveWallet(wallet);
    return wallet;
  }

  static async removeFollowingToken(tokenId, account, wallet) {
    const indexAccount = wallet.getAccountIndexByName(this.getAccountName(account));
    await wallet.MasterAccount.child[indexAccount].removeFollowingToken(
      tokenId,
    );
    saveWallet(wallet);
    return wallet;
  }

  /**
   *
   * @param {string} tokenID
   * @param paymentAddrStr
   * @param {bool} isGetAll
   * @returns {object}
   */
  static async getRewardAmount(tokenID, paymentAddrStr, isGetAll = false) {
    if (_.isEmpty(paymentAddrStr))
      throw new CustomError(ErrorCode.payment_address_empty, {
        name: 'payment address is empty',
      });
    return await AccountWallet?.getRewardAmount(
      paymentAddrStr,
      isGetAll,
      tokenID,
    );
  }

  /**
   *
   * @param {string} tokenID
   * @param {object} account
   * @param {object} wallet
   */
  static async createAndSendWithdrawRewardTx(tokenID, account, wallet) {
    const indexAccount = wallet.getAccountIndexByName(
      account.name || account.AccountName,
    );
    return wallet.MasterAccount.child[
      indexAccount
    ].createAndSendWithdrawRewardTx(tokenID);
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
  static async getAccountWithBLSPubKey(blsKey, wallet) {
    try {
      let accountWallet = null;
      if (!_.isEmpty(blsKey)) {
        console.log(TAG, 'getAccountWithBLSPubKey begin');
        const listAccounts = (await loadListAccountWithBLSPubKey(wallet)) || [];
        console.log(TAG, 'getAccountWithBLSPubKey listAccount ', listAccounts);
        let account = listAccounts.find((item) =>
          _.isEqual(item.BLSPublicKey, blsKey),
        );

        account = account
          ? await wallet.getAccountByName(account.AccountName)
          : null;
        console.log(TAG, 'getAccountWithBLSPubKey end ---- ', account);
        // accountWallet = account? new AccountModel(account):null;
        accountWallet = account;
      }
      return accountWallet;
    } catch (e) {
      console.warn(TAG, 'getAccountWithBLSPubKey error =', e);
    }
    return null;
  }

  /**
   *
   * @param {string} blsKey
   * @param {object} wallet
   * @returns :AccountModel: template
   */
  static async getFullDataOfAccount(accountName, wallet) {
    try {
      let accountWallet = null;
      if (!_.isEmpty(accountName)) {
        console.log(TAG, 'getFullDataOfAccount begin');
        const listAccounts = (await loadListAccountWithBLSPubKey(wallet)) || [];
        console.log(TAG, 'getFullDataOfAccount listAccount ', listAccounts);
        let account: JSON = listAccounts.find((item) =>
          _.isEqual(item.AccountName, accountName),
        );

        let accountTemp = account
          ? await wallet.getAccountByName(account.AccountName)
          : null;
        console.log(TAG, 'getFullDataOfAccount end ---- ', account);
        // accountWallet = account? new AccountModel(account):null;
        accountWallet = accountTemp
          ? new AccountModel({ ...accountTemp, ...account })
          : null;
      }
      return accountWallet;
    } catch (e) {
      console.warn(TAG, 'getFullDataOfAccount error =', e);
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
    if (!account) throw new Error('Account is required');

    const accountWallet = wallet.getAccountByName(account.name);

    if (accountWallet) {
      const list = await accountWallet.getAllPrivacyTokenBalance();

      return (
        list?.map((tokenData) => ({
          amount: tokenData?.Balance,
          id: tokenData?.TokenID,
        })) || []
      );
    } else {
      throw new Error(
        'Can not get list coin has balance of non-existed account',
      );
    }
  }

  static async createAndSendTxWithNativeTokenContribution(
    wallet,
    account,
    fee,
    pdeContributionPairID,
    contributedAmount,
    info = '',
  ) {
    let indexAccount = wallet.getAccountIndexByName(
      account.name || account.AccountName,
    );
    let result;
    try {
      result = await wallet.MasterAccount.child[
        indexAccount
      ].createAndSendTxWithNativeTokenContribution(
        fee,
        pdeContributionPairID,
        contributedAmount,
        info,
      );
    } catch (e) {
      throw e;
    }
    return result;
  }

  static async createAndSendPTokenContributionTx(
    wallet,
    account,
    tokenParam,
    feeNativeToken,
    feePToken,
    pdeContributionPairID,
    contributedAmount,
  ) {
    let indexAccount = wallet.getAccountIndexByName(
      account.name || account.AccountName,
    );
    let result;
    try {
      result = await wallet.MasterAccount.child[
        indexAccount
      ].createAndSendPTokenContributionTx(
        tokenParam,
        feeNativeToken,
        feePToken,
        pdeContributionPairID,
        contributedAmount,
      );
    } catch (e) {
      throw e;
    }
    return result;
  }

  static async createAndSendNativeTokenTradeRequestTx(
    wallet,
    account,
    fee,
    tokenIDToBuyStr,
    sellAmount,
    minimumAcceptableAmount,
    tradingFee,
    info = '',
  ) {
    let indexAccount = wallet.getAccountIndexByName(
      account.name || account.AccountName,
    );
    let result;
    try {
      console.debug(
        'CREATE AND SEND NATIVE TOKEN TRADE',
        fee,
        tokenIDToBuyStr,
        sellAmount,
        minimumAcceptableAmount,
        tradingFee,
        info,
      );
      result = await wallet.MasterAccount.child[
        indexAccount
      ].createAndSendNativeTokenTradeRequestTx(
        fee,
        tokenIDToBuyStr,
        sellAmount,
        minimumAcceptableAmount,
        tradingFee,
        info,
      );
    } catch (e) {
      throw e;
    }
    return result;
  }

  static async createAndSendPTokenTradeRequestTx(
    wallet,
    account,
    tokenParam,
    feeNativeToken,
    feePToken,
    tokenIDToBuyStr,
    sellAmount,
    minimumAcceptableAmount,
    tradingFee,
  ) {
    let indexAccount = wallet.getAccountIndexByName(
      account.name || account.AccountName,
    );
    let result;

    try {
      console.debug(
        'CREATE AND SEND PTOKEN TRADE',
        tokenParam,
        feeNativeToken,
        feePToken,
        tokenIDToBuyStr,
        sellAmount,
        minimumAcceptableAmount,
        tradingFee,
      );
      result = await wallet.MasterAccount.child[
        indexAccount
      ].createAndSendPTokenTradeRequestTx(
        tokenParam,
        feeNativeToken,
        feePToken,
        tokenIDToBuyStr,
        sellAmount,
        minimumAcceptableAmount,
        tradingFee,
      );
    } catch (e) {
      throw e;
    }
    return result;
  }

  static async createAndSendWithdrawDexTx(
    wallet,
    account,
    fee,
    withdrawalToken1IDStr,
    withdrawalToken2IDStr,
    withdrawalShareAmt,
    info = '',
  ) {
    let indexAccount = wallet.getAccountIndexByName(
      account.name || account.AccountName,
    );
    let result;
    try {
      result = await wallet.MasterAccount.child[
        indexAccount
      ].createAndSendWithdrawDexTx(
        fee,
        withdrawalToken1IDStr,
        withdrawalToken2IDStr,
        withdrawalShareAmt,
        info,
      );
    } catch (e) {
      throw e;
    }
    return result;
  }

  static isNotEnoughCoinErrorCode(error) {
    return error.code === 'WEB_JS_ERROR(-5)';
  }

  static isPendingTx(error) {
    return error.stackTrace.includes(STACK_TRACE.REPLACEMENT);
  }

  static hasSpendingCoins(account, wallet, amount, tokenId = null) {
    const indexAccount = wallet.getAccountIndexByName(
      account.name || account.AccountName,
    );
    return hasSpendingCoins(indexAccount, wallet, amount, tokenId);
  }

  static getAccountName(account) {
    if (account) {
      return account.name || account.AccountName || account.accountName;
    }

    return '';
  }

  static getPaymentAddress(account) {
    if (account) {
      return account.PaymentAddress || account.paymentAddress;
    }

    return '';
  }

  static getUTXOs(wallet, account, coinId) {
    if (!wallet || !account) {
      return 0;
    }
    const indexAccount = wallet.getAccountIndexByName(
      account.name || account.AccountName,
    );
    const walletAccount = wallet.MasterAccount.child[indexAccount];
    return (
      (walletAccount?.coinUTXOs &&
        walletAccount?.coinUTXOs[coinId || COINS.PRV_ID]) ||
      0
    );
  }

  static getMaxInputPerTx() {
    return constants.MAX_INPUT_PER_TX;
  }

  static hasExceededMaxInput(wallet, account, coinId) {
    const noOfUTXOs = this.getUTXOs(wallet, account, coinId);
    return noOfUTXOs > this.getMaxInputPerTx();
  }

  /**
   * Create multiple tx to defragment all utxo in account
   * @param {number} fee
   * @param {boolean} isPrivacy
   * @param {object} account
   * @param {object} wallet
   * @param {number} noOfTxs
   * @returns {Promise<*>}
   */
  static async defragmentNativeCoin(
    fee,
    isPrivacy,
    account,
    wallet,
    noOfTxs = this.MAX_DEFRAGMENT_TXS,
  ) {
    if (!wallet) {
      throw new Error('Missing wallet');
    }
    if (!account) {
      throw new Error('Missing account');
    }
    const indexAccount = wallet.getAccountIndexByName(
      this.getAccountName(account),
    );
    const result = await wallet.MasterAccount.child[
      indexAccount
    ].defragmentNativeCoin(
      fee,
      isPrivacy,
      this.NO_OF_INPUT_PER_DEFRAGMENT_TX,
      noOfTxs,
    );

    // save wallet
    await saveWallet(wallet);
    await Wallet.resetProgressTx();
    return result;
  }
}
