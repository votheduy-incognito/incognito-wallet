import common from '@src/constants/common';
import { DEVICES } from '@src/constants/miner';
import Device from '@src/models/device';
import accountService from '@src/services/wallet/accountService';
import format from '@src/utils/format';
import LocalDatabase from '@src/utils/LocalDatabase';
import Util from '@src/utils/Util';
import _ from 'lodash';
import APIService from './api/miner/APIService';
import { ExHandler } from './exception';
import NodeService from './NodeService';
import VirtualNodeService from './VirtualNodeService';

const TAG = 'DeviceService';

const templateAction = {
  key:'',
  data:{}
};
const timeout = 10;

export default class DeviceService {

  static formatForDisplayBalance = (balance:Number)=>{
    return format.amount(_.isNaN(balance)?0:balance,common.DECIMALS['PRV']);
  }
  static getStyleStatus = (code)=>{
    let styleStatus = {color:'#91A4A6'};
    if(code === Device.CODE_STOP){
      styleStatus.color = '#91A4A6';
    }else if(code === Device.CODE_MINING || code === Device.CODE_PENDING){
      styleStatus.color = '#25CDD6';
    }else if(code === Device.CODE_SYNCING){
      // styleStatus.color = '#262727';
      styleStatus.color = '#25CDD6';
    }else if(code === Device.CODE_START){
      styleStatus.color = '#26C64D';
    }
    return styleStatus;
  }

  /**
   * dont use => wrong response data.
   * if return {} => web-js error
   * return { Role= -1, ShardID= 0 }
   */
  static fetchStakeStatus = async (account,wallet)=>{
    if(_.isEmpty(account)) throw new Error(`${TAG} fetchStakeStatus: account is empty`);
    if(_.isEmpty(wallet)) throw new Error(`${TAG} fetchStakeStatus: wallet is empty`);

    return await accountService.stakerStatus(account,wallet).catch(e=>new ExHandler(e,`${TAG} fetchStakeStatus: web-js error`).showErrorToast())??{};
  }

  static isStaked  = async(device:Device,wallet)=>{
    try {
      if(device && device.isCallStaked){
        return true;
      }
      switch(device.Type){
      case DEVICES.VIRTUAL_TYPE:
        return await VirtualNodeService.isStaked(device);

      default:{
        const accountName = device.accountName();
        const accountModel = await accountService.getFullDataOfAccount(accountName,wallet);
        return !_.isEmpty(accountModel?.BLSPublicKey) && await VirtualNodeService.checkStakedWithBlsKey(accountModel.BLSPublicKey);
      }
      }


    } catch (error) {
      console.log(TAG,'isStaked error',error);
    }
    return false;
  }


  // static fetchAndSavingInfoNodeStake = async(device:Device,isNeedSaving=false)=>{

  //   try {

  //     const paymentAddress =  device.PaymentAddressFromServer;

  //     const resultRequest =  await Util.excuteWithTimeout(APIService.fetchInfoNodeStake({
  //       PaymentAddress:paymentAddress
  //     }),5).catch(console.log);
  //     const dataRequestStake = resultRequest.data||{};
  //     if(isNeedSaving && !_.isEmpty(dataRequestStake)){
  //       const {StakerAddress = ''} = dataRequestStake??{};
  //       device.isCallStaked = !_.isEmpty(StakerAddress);
  //       let fetchProductInfo = device.toJSON()??{};
  //       fetchProductInfo.minerInfo = {
  //         ...fetchProductInfo.minerInfo,
  //         ...dataRequestStake
  //       };
  //       console.log(TAG,'fetchAndSavingInfoNodeStake fetchProductInfo = ',fetchProductInfo);
  //       !_.isEmpty(fetchProductInfo) && await LocalDatabase.updateDevice(fetchProductInfo);
  //     }

  //     return dataRequestStake;

  //   } catch (error) {
  //     console.log(TAG,'fetchAndSavingInfoNodeStake error = ',error);
  //   }

  //   return null;
  // }


  /**
   *
   * @param {string} paymentAddrStr
   * @param {string} tokenID
   * @returns {number}
   */
  static getRewardAmountWithPaymentAddress = async(paymentAddrStr,tokenID = '',isGetAll = false)=>{
    const result = !_.isEmpty(paymentAddrStr) ? await accountService.getRewardAmount(tokenID, paymentAddrStr,isGetAll).catch(e=>new ExHandler(e).showWarningToast()):null;
    console.log(TAG,'getRewardAmountWithPaymentAddress result = ',result);
    return result;
  }

  /**
    * Result : null -> network have problem,
    *{}: not earning
  */
 static getRewardAmountAllToken = async (deviceInfo:Device)=>{
   let Result = null;
   try {
     if(!_.isEmpty(deviceInfo)){
       switch(deviceInfo.Type){
       case DEVICES.VIRTUAL_TYPE:{

         const dataResult = await VirtualNodeService.getRewardFromMiningkey(deviceInfo);
         console.log(TAG,'getRewardAmountAllToken VIRTUAL_TYPE ',dataResult);
         Result = dataResult?.Result;
         break;
       }
       default:{
         //  let stakerAddress =  deviceInfo.StakerAddressFromServer;
         //  stakerAddress =  _.isEmpty(stakerAddress) ? await NodeService.fetchAndSavingInfoNodeStake(deviceInfo,true)?.StakerAddress:stakerAddress;
         const dataStaked = await NodeService.fetchAndSavingInfoNodeStake(deviceInfo,true);
         let stakerAddress =  dataStaked?.StakerAddress ??'';
         console.log(TAG,'getRewardAmountAllToken NODE begin = ',dataStaked);
         if(_.isEmpty(stakerAddress)){
           Result = {PRV:null};
         }else{
           Result = await DeviceService.getRewardAmountWithPaymentAddress(stakerAddress,'',true);
         }
       }
       }
     }
   } catch (error) {
     new ExHandler(error,'getRewardAmountAllToken error').showWarningToast().throw();
   }

   return Result;
 }

 //  /**
 //     * balance : null -> node die,
 //     *-1: full-node die
 //   */
 //  static getRewardAmount = async (deviceInfo:Device)=>{
 //    let balance = null;
 //    if(!_.isEmpty(deviceInfo)){
 //      switch(deviceInfo.Type){
 //      case DEVICES.VIRTUAL_TYPE:{
 //        console.log(TAG,'getRewardAmount VIRTUAL_TYPE begin');
 //        let dataResult = await VirtualNodeService.getRewardFromMiningkey(deviceInfo);

 //        balance = _.isNil(dataResult) || _.isNil(dataResult.Result) ?-1:dataResult.Result?.PRV;
 //        console.log(TAG,'getRewardAmount VIRTUAL_TYPE dataResult = ',dataResult,deviceInfo.Name,balance);
 //        break;
 //      }
 //      default:{
 //        let stakerAddress =  deviceInfo.StakerAddressFromServer;
 //        stakerAddress =  _.isEmpty(stakerAddress) ? await NodeService.fetchAndSavingInfoNodeStake(deviceInfo,true)?.StakerAddress:stakerAddress;
 //        balance = _.isEmpty(stakerAddress)? 0: await NodeService.balanceToken(stakerAddress,'',false);
 //        balance = _.isNaN(balance)? 0:balance;
 //      }
 //      }
 //    }
 //    balance = _.isNil(balance)||_.isNaN(balance)?null:balance;
 //    console.log(TAG,'getRewardAmount balance = ',balance,deviceInfo.Name);
 //    return balance;
 //  }

 /**
    * balance : null -> node die,
    *-1: full-node die
  */
 static getRewardAmount = async (deviceInfo:Device)=>{
   let balance = null;
   if(!_.isEmpty(deviceInfo)){
     const Result = await DeviceService.getRewardAmountAllToken(deviceInfo).catch(console.log) ?? null;
     balance = _.isNil(Result) ?-1:Result?.PRV;

     switch(deviceInfo.Type){
     case DEVICES.VIRTUAL_TYPE:{
       console.log(TAG,'getRewardAmount VIRTUAL_TYPE dataResult = ',Result,deviceInfo.Name,balance);
       break;
     }
     default:{
       balance = _.isNaN(balance)? 0:balance;
     }
     }
   }
   balance = _.isNil(balance)||_.isNaN(balance)?null:balance;
   console.log(TAG,'getRewardAmount end balance = ',balance,deviceInfo.Name);
   return balance;
 }

 /**
  * return {1}: begin to updating
  * {-1}: error
  * * {0}: updating
  */
 static updateFirmwareForNode= async(device:Device)=>{
   try {
     console.log(TAG,'updateFirmwareForNode begin -- ',device.isUpdatingFirmware());
     if(!device.isUpdatingFirmware()){
       console.log(TAG,'updateFirmwareForNode begin01');
       const {data,status} = await NodeService.updateFirmware(device).catch(console.log)??{};
       await LocalDatabase.saveUpdatingFirware(device.ProductId,true);
       return 0;
     }
   } catch (error) {
     return -1;
   }

   return 1;
 }

}
