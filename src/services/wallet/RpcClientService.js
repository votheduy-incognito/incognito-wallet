import { Wallet, RpcClient } from 'constant-chain-web-js/build/wallet';

export function getRpcClient() {
  return Wallet.RpcClient;
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

export async function getEstimateFee(from, to, amount, privateKey, accountWallet, isPrivacy) {
  console.log('Estimating fee ...');
  let fee;
  try {
    fee = await getRpcClient().getEstimateFee(
      from,
      to,
      amount,
      privateKey,
      null,
      null,
      accountWallet,
      isPrivacy
    );
  } catch (e) {
    throw e;
  }
  return fee;
}

export async function getEstimateFeeForSendingToken(
  from,
  to,
  amount,
  tokenObject,
  privateKey,
  account
) {
  console.log('getEstimateFeeForSendingToken');
  console.log('\tfrom:' + from);
  console.log('\tto: ' + to);
  console.log('\tamount:' + amount);
  console.log('\ttokenObject', tokenObject);
  console.log('\tprivateKey', privateKey);

  let fee;
  try {
    fee = await getRpcClient().getEstimateFeeForSendingToken(
      from,
      to,
      amount,
      tokenObject,
      privateKey,
      account
    );
  } catch (e) {
    throw e;
  }
  return fee;
}

export async function getEstimateFeeToDefragment(
  from,
  amount,
  privateKey,
  accountWallet,
  isPrivacy
) {
  console.log('Estimating fee ...');
  let fee;
  try {
    fee = await getRpcClient().getEstimateFeeToDefragment(
      from,
      amount,
      privateKey,
      accountWallet,
      isPrivacy
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
    console.log('resp getActiveShard: ', resp);
  } catch (e) {
    throw e;
  }

  if (resp.err !== null) {
    throw resp.err;
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

  if (resp.err !== null) {
    throw resp.err;
  }
  return resp.shardNumber;
}

export async function hashToIdenticon(hash){
  let res;

  try {
    res = await getRpcClient().hashToIdenticon([hash]);
    if (res.err !== null) {
      throw res.err;
    }
  } catch (e) {
    throw e;
  }
  
  return res.images[0];
}
