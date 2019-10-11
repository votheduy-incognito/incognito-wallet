import {
  Wallet,
  RpcClient,
  getEstimateFee,
  getEstimateFeeForSendingToken,
  getEstimateTokenFee,
  getMaxWithdrawAmount
} from 'incognito-chain-web-js/build/wallet';
import { ExHandler, CustomError, ErrorCode } from '../exception';

function getRpcClient() {
  return Wallet.RpcClient;
}

function setRpcClientInterceptor() {
  const instance = Wallet.RpcClient?.rpcHttpService?.axios;

  instance?.interceptors.response.use(res => {
    return Promise.resolve(res);
  }, errorData => {
    const errResponse = errorData?.response;

    // can not get response, alert to user
    if (!errResponse) {
      return new ExHandler(new CustomError(ErrorCode.network_make_request_failed)).throw();
    }

    return Promise.reject(errorData);
  });
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
 * @param {bool} isPrivacy default `true`
 * 
 * Estimate fee for sending native token (PRV), fee is returned in nano unit
 */
export async function getEstimateFeeForNativeToken(
  from,
  to,
  amount,
  accountWallet,
  isPrivacy = true
) {
  console.log('Estimating fee ...');
  let fee;
  try {
    fee = await getEstimateFee(
      from,
      to,
      amount,
      accountWallet,
      isPrivacy,
      getRpcClient()
    );
  } catch (e) {
    throw e;
  }
  return fee;
}

export async function getEstimateFeeForSendingTokenService(
  from,
  to,
  amount,
  tokenObject,
  privateKey,
  account,
  isPrivacyForPrivateToken,
  feeToken
) {
  console.log('getEstimateFeeForSendingToken');
  console.log('\tfrom:' + from);
  console.log('\tto: ' + to);
  console.log('\tamount:' + amount);
  console.log('\ttokenObject', tokenObject);
  console.log('\tprivateKey', privateKey);

  let fee;
  try {
    fee = await getEstimateFeeForSendingToken(
      from,
      to,
      amount,
      tokenObject,
      privateKey,
      account,
      getRpcClient(),
      isPrivacyForPrivateToken,
      feeToken
    );
  } catch (e) {
    throw e;
  }
  return fee;
}

export async function getEstimateTokenFeeService(
  from,
  to,
  amount,
  tokenObject,
  privateKey,
  account,
  isPrivacyForPrivateToken
) {
  console.log('getEstimateTokenFee');
  console.log('\tfrom:' + from);
  console.log('\tto: ' + to);
  console.log('\tamount:' + amount);
  console.log('\ttokenObject', tokenObject);
  console.log('\tprivateKey', privateKey);
  console.log('HHHHHHHH : ', typeof getEstimateTokenFee);

  let fee;
  try {
    fee = await getEstimateTokenFee(
      from,
      to,
      amount,
      tokenObject,
      privateKey,
      account,
      getRpcClient(),
      isPrivacyForPrivateToken
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

export async function getMaxWithdrawAmountService(
  from,
  to,
  tokenObject,
  privateKey,
  account,
  isPrivacyForPrivateToken
) {
  let response;
  try {
    response = await getMaxWithdrawAmount(
      from,
      to,
      tokenObject,
      privateKey,
      account,
      getRpcClient(),
      isPrivacyForPrivateToken
    );
  } catch (e) {
    throw e;
  }
  return response;
}

setRpcClientInterceptor();