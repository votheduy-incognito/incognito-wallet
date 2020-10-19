import Axios from 'axios';
import {
  getEstimateFee,
  getEstimateFeeForPToken as getEstimateFeeForPTokenService,
  getMaxWithdrawAmount,
  RpcClient,
  Wallet,
} from 'incognito-chain-web-js/build/wallet';
import { CustomError, ErrorCode, ExHandler } from '../exception';

let lastPDEStateData = null;
let lastBeaconHeight = null;

function getRpcClient() {
  return Wallet.RpcClient;
}

function setRpcClientInterceptor() {
  const instance = Wallet.RpcClient?.rpcHttpService?.axios;

  instance?.interceptors.response.use(
    (res) => {
      return Promise.resolve(res);
    },
    (errorData) => {
      const errResponse = errorData?.response;

      // can not get response, alert to user
      if (errorData?.isAxiosError && !errResponse) {
        return new ExHandler(
          new CustomError(ErrorCode.network_make_request_failed),
        ).throw();
      }

      return Promise.reject(errorData);
    },
  );
}

export function setRpcClient(server, username, password) {
  Wallet.RpcClient = new RpcClient(server, username, password);
}

export function listCustomTokens() {
  return getRpcClient().listCustomTokens();
}

export function listPrivacyTokens() {
  return getRpcClient().listPrivacyCustomTokens();
}

/**
 *
 * @param {string} from Incognito Address
 * @param {string} to Incognito Address
 * @param {number} amount nano unit
 * @param {object} accountWallet get from WalletService.getAccountByName(accountName);
 *
 * Estimate fee for sending native token (PRV), fee is returned in PRV nano unit
 */
export async function getEstimateFeeForNativeToken(
  from,
  to,
  amount,
  accountWallet,
) {
  console.log('Estimating fee ...');
  let fee;
  const isPrivacyForNativeToken = true;
  const isPrivacyForPrivateToken = false;
  try {
    fee = await getEstimateFee(
      from,
      to,
      amount,
      accountWallet,
      isPrivacyForNativeToken,
      isPrivacyForPrivateToken,
      getRpcClient(),
    );
  } catch (e) {
    throw e;
  }
  return fee;
}

/**
 *
 * @param {string} from
 * @param {string} to
 * @param {number} amount in nano
 * @param {object} tokenObject
 * @param {object} account get from WalletService.getAccountByName(accountName);
 * @param {number} feeToken  in nano
 * @param {bool} isGetTokenFee default `false`
 *
 * Estimate fee for sending PRIVATE_TOKEN (pETH, pBTC, Incognito Custom Tokens,...) in
 * - nano PRV if `isGetTokenFee` is `false` (default)
 * - nano PRIVATE_TOKEN if `isGetTokenFee` is `true`
 *
 * tokenObject format
 * @param {bool} Privacy
 * @param {string} TokenID
 * @param {string} TokenName
 * @param {string} TokenSymbol
 * @param {string} TokenTxType see here CONSTANT_COMMONS.TOKEN_TX_TYPE
 * @param {string} TokenAmount in nano
 * @param {string} TokenReceivers  { PaymentAddress: string, Amount: number in nano }
 */
export async function getEstimateFeeForPToken(
  from,
  to,
  amount,
  tokenObject,
  account,
  isGetTokenFee = false,
) {
  let fee;
  const isPrivacyForNativeToken = false;
  const isPrivacyForPrivateToken = true;
  const feeToken = 0;
  try {
    fee = await getEstimateFeeForPTokenService(
      from,
      to,
      amount,
      tokenObject,
      account,
      getRpcClient(),
      isPrivacyForNativeToken,
      isPrivacyForPrivateToken,
      feeToken,
      isGetTokenFee,
    );
  } catch (e) {
    throw e;
  }
  return fee;
}

export async function getStakingAmount(type) {
  let resp;
  try {
    resp = await getRpcClient().getStakingAmount(type);
  } catch (e) {
    throw e;
  }
  return resp.res;
}

export async function getActiveShard() {
  let resp;
  try {
    resp = await getRpcClient().getActiveShard();
  } catch (e) {
    throw e;
  }

  return resp.shardNumber;
}

export async function getMaxShardNumber() {
  let resp;
  try {
    resp = await getRpcClient().getMaxShardNumber();
  } catch (e) {
    throw e;
  }

  return resp.shardNumber;
}

export async function hashToIdenticon(hashStrs) {
  let resp;
  try {
    resp = await getRpcClient().hashToIdenticon(hashStrs);
  } catch (e) {
    throw e;
  }

  return resp.images;
}

/**
 *
 * @param {string} from
 * @param {string} to
 * @param {object} tokenObject
 * @param {object} account get from wallet.getAccountByName(account?.name)
 * @param {bool} isPrivacyForPrivateToken for centralized = true, decentralized = false
 *
 * tokenObject = {
      Privacy: bool,
      TokenID: string,
      TokenName: string,
      TokenSymbol: string,
      TokenTxType: from CONSTANT_COMMONS.TOKEN_TX_TYPE,
      TokenAmount: amount in nano,
      TokenReceivers: {
        PaymentAddress: string,
        Amount: amount in nano
      }
    }
 */
export async function getMaxWithdrawAmountService(
  from,
  to,
  tokenObject,
  account,
  isPrivacyForPrivateToken,
) {
  let response;
  const isPrivacyForNativeToken = false;
  try {
    response = await getMaxWithdrawAmount(
      from,
      to,
      tokenObject,
      account,
      getRpcClient(),
      isPrivacyForNativeToken,
      isPrivacyForPrivateToken,
    );
  } catch (e) {
    throw e;
  }
  return response;
}

export function isExchangeRatePToken(tokenID) {
  if (typeof tokenID !== 'string') throw new Error('tokenID must be a string');

  return getRpcClient().isExchangeRatePToken(tokenID);
}

export async function getPDEPairs() {
  const client = await getRpcClient();
  const beaconHeight = await client.getBeaconHeight();

  if (lastBeaconHeight !== beaconHeight) {
    const data = await client.getPDEState(beaconHeight);
    lastPDEStateData = data;
  }

  return lastPDEStateData;
}

export async function getPDETradeStatus(txId) {
  const client = await getRpcClient();
  return client.getPDETradeStatus(txId);
}

export async function getPDEContributionStatus(pairId) {
  const client = await getRpcClient();
  const res = await client.getPDEContributionStatusV2(pairId);
  return res.state;
}

export async function getPDEWithdrawalStatus(txId) {
  const client = await getRpcClient();
  return client.getPDEWithdrawalStatus(txId);
}

export function getBlockChainInfo() {
  return getRpcClient().getBlockChainInfo();
}

export function getBeaconBestStateDetail() {
  return getRpcClient().getBeaconBestStateDetail();
}

export function listRewardAmount() {
  return getRpcClient().listRewardAmount();
}

export async function getTransactionByHash(txId) {
  const client = await getRpcClient();
  return client.getTransactionByHash(txId);
}

export async function getEstimateFeePerKB(paymentAddress) {
  const client = await getRpcClient();
  return client.getEstimateFeePerKB(paymentAddress);
}

export async function getNodeTime() {
  const client = await getRpcClient();
  return client.getNodeTime();
}

export async function getPublicKeyFromPaymentAddress(paymentAddress) {
  const client = await getRpcClient();
  const data = {
    jsonrpc: '1.0',
    method: 'getpublickeyfrompaymentaddress',
    params: [paymentAddress],
    id: 1,
  };

  const response = await client.rpcHttpService.postRequest(data);

  if (response.status !== 200) {
    throw new Error('Can\'t request API check has serial number derivator');
  } else if (response.data.Error) {
    throw response.data.Error;
  }

  return response.data.Result.PublicKeyInBase58Check;
}

export const getReceiveHistoryByRPC = async ({
  PaymentAddress,
  ReadonlyKey,
  Skip = 0,
  Limit = 10,
  TokenID,
}) => {
  const client = await getRpcClient();
  const data = {
    jsonrpc: '1.0',
    method: 'gettransactionbyreceiverv2',
    params: [
      {
        PaymentAddress,
        ReadonlyKey,
        Skip,
        Limit,
        TokenID,
      },
    ],
    id: 1,
  };
  const response = await client.rpcHttpService.postRequest(data);
  if (response.status !== 200) {
    throw new Error('Can\'t request API');
  } else if (response.data.Error) {
    throw response.data.Error;
  }
  return response.data.Result?.ReceivedTransactions;
};

export const getTxTransactionByHash = async (txId) => {
  const client = await getRpcClient();
  const data = {
    jsonrpc: '1.0',
    method: 'gettransactionbyhash',
    params: [txId],
    id: 3,
  };
  const response = await client.rpcHttpService.postRequest(data);
  if (response.status !== 200) {
    throw new Error('Can\'t request API');
  } else if (response.data.Error) {
    throw response.data.Error;
  }
  return response.data.Result;
};

setRpcClientInterceptor();
