import {
  CustomTokenParamTx,
  TxTokenVout,
  KeyWallet,
  Wallet
} from 'incognito-chain-web-js/build/wallet';
import { saveWallet } from './WalletService';
import { listPrivacyTokens, listCustomTokens } from './RpcClientService';

export default class Token {
  static async createSendCustomToken(param, fee, account, wallet) {
    await Wallet.resetProgressTx();
    console.log('SEND CUSTOM TOKEN!!!!!!!');

    // get index account by name
    const indexAccount = wallet.getAccountIndexByName(account.name);

    // prepare param for create and send token
    // payment info
    // @@ Note: it is use for receivers constant
    const paymentInfos = [];
    // for (let i = 0; i < paymentInfos.length; i++) {
    //   paymentInfos[i] = new PaymentInfo(/*paymentAddress, amount*/);
    // }

    // receviers token
    const receiverPaymentAddrStr = new Array(1);
    receiverPaymentAddrStr[0] = param.TokenReceivers.PaymentAddress;

    // token param
    const tokenParam = new CustomTokenParamTx();
    tokenParam.propertyID = param.TokenID;
    tokenParam.propertyName = param.TokenName;
    tokenParam.propertySymbol = param.TokenSymbol;
    tokenParam.amount = param.TokenAmount;
    tokenParam.tokenTxType = param.TokenTxType;
    tokenParam.receivers = new Array(1);
    tokenParam.receivers[0] = new TxTokenVout();
    tokenParam.receivers[0].set(
      KeyWallet.base58CheckDeserialize(
        param.TokenReceivers.PaymentAddress
      ).KeySet.PaymentAddress,
      param.TokenReceivers.Amount
    );

    console.log(tokenParam);
    // create and send custom token
    let res;
    try {
      res = await wallet.MasterAccount.child[
        indexAccount
      ].createAndSendCustomToken(
        paymentInfos,
        tokenParam,
        receiverPaymentAddrStr,
        fee
      );

      // saving KeyWallet
      await saveWallet(wallet);
    } catch (e) {
      throw e;
    }

    await Wallet.resetProgressTx();
    return res;
  }

  static async createSendPrivacyCustomToken(
    submitParam,
    fee,
    account,
    wallet
  ) {
    await Wallet.resetProgressTx();
    console.log('SEND PRIVACY CUSTOM TOKEN!!!!!!!');

    // get index account by name
    const indexAccount = wallet.getAccountIndexByName(account.name);

    // prepare param for create and send privacy custom token
    // payment info
    // @@ Note: it is use for receivers constant
    const paymentInfos = [];
    // for (let i = 0; i < paymentInfos.length; i++) {
    //   paymentInfos[i] = new PaymentInfo(/*paymentAddress, amount*/);
    // }
    let response;
    try {
      response = await wallet.MasterAccount.child[
        indexAccount
      ].createAndSendPrivacyCustomToken(paymentInfos, submitParam, fee);

      await saveWallet(wallet);
    } catch (e) {
      throw e;
    }

    await Wallet.resetProgressTx();

    return response;
  }

  static async getPrivacyTokens() {
    try {
      const data = await listPrivacyTokens();
      const tokens = data.listPrivacyToken || [];
      return tokens;
    } catch (e) {
      throw e;
    }
  }

  static async getNormalTokens() {
    try {
      const data = await listCustomTokens();
      const tokens = data.listCustomToken || [];

      return tokens;
    } catch (e) {
      throw e;
    }
  }

  static getFollowingTokens({ account, wallet }) {
    try {
      const accountWallet = wallet.getAccountByName(account.name);
      const followingTokens = accountWallet.listFollowingTokens();

      return followingTokens;
    } catch (e) {
      throw e;
    }
  }

  static getFollowingPrivacyTokens({ account, wallet }) {
    try {
      const followingTokens = Token.getFollowingTokens({ account, wallet });

      return followingTokens.filter(
        token => token?.IsPrivacy
      );
    } catch (e) {
      throw e;
    }
  }

  static getFollowingNormalTokens({ account, wallet }) {
    try {
      const followingTokens = Token.getFollowingTokens({ account, wallet });

      return followingTokens.filter(
        token => !token?.IsPrivacy
      );
    } catch (e) {
      throw e;
    }
  }

  static async getTokenHistory({ account, wallet, token }) {
    try {
      if (!token?.ID) {
        throw new Error('Token is required');
      }

      const accountWallet = wallet.getAccountByName(account.name);
      let histories = [];
        
      if (token?.IsPrivacy) {
        histories = await accountWallet.getPrivacyCustomTokenTxByTokenID(token?.ID);
      } else {
        histories = await accountWallet.getCustomTokenTxByTokenID(token?.ID);
      }
      
      return histories;
    } catch (e) {
      throw e;
    }
  }

  
}
