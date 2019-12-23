import images from '@src/assets';
import { Text } from '@src/components/core';
import { openQrScanner } from '@src/components/QrCodeScanner';
import APIService from '@src/services/api/miner/APIService';
import { scaleInApp } from '@src/styles/TextStyle';
import Util from '@src/utils/Util';
import ViewUtil, { onClickView } from '@src/utils/ViewUtil';
import _ from 'lodash';
import React, { useCallback, useMemo, useState } from 'react';
import { Image, TouchableOpacity } from 'react-native';
import { Icon } from 'react-native-elements';
import styles from './styles';

export const TAG = 'GetQrcode';
const  GetQrcode = React.memo(({onSuccess,qrCode = ''})=>{
  const [deviceId,setDeviceId] = useState(qrCode);
  const [loading,setLoading] = useState(false);
  const [isPassedValidate,setIdPassedValidate] = useState(false);
  const [errorMessage,setErrorMessage] = useState(''); 
  const verifyQrcode = async (qrcode)=>{
    if(!_.isEmpty(qrcode)){
      setLoading(true);
      console.log(TAG,'openQrScanner  == data',data);
      const checked = await Util.excuteWithTimeout(APIService.qrCodeCheck({QRCode:qrcode})).catch(console.log)||{};
      const {data='',status = -1 } = checked??{};
      const isPassed =  _.isEqual(status,1) || __DEV__;
      setIdPassedValidate(isPassed);
      setDeviceId(qrcode);
      setErrorMessage(isPassed?'':data);
      isPassed && onSuccess && onSuccess(qrcode);
      setLoading(false);
    }
  };
  useMemo(()=>verifyQrcode(qrCode),[qrCode]);
  const handleQrcode = useCallback(onClickView(()=>{
    openQrScanner(async dataReader => {
      if(_.isEmpty(dataReader)) {
        setDeviceId('');
        setIdPassedValidate(false);
        setErrorMessage('Please scan QR code to get a verification code');
      }else{
        setDeviceId(dataReader);
        verifyQrcode(dataReader);
      }
      
    });
  }),[deviceId]);
  return (
    <>
      <Image style={styles.content_step1} source={images.ic_getstarted_scan_device} />
      
      {!isPassedValidate ?(
        <TouchableOpacity onPress={handleQrcode}>
          <Image style={styles.content_step1} source={images.ic_getstarted_qrcode} />
          <Text style={styles.step3_text}>Tap to scan</Text>
        </TouchableOpacity>
      ):(loading?ViewUtil.loadingComponent(): (
        <>
          <Icon size={scaleInApp(50)} color='#25CDD6' name="check" type='simple-line-icon' />
          <Text style={[styles.step3_text,{color:'#25CDD6'}]}>Scan complete</Text>
        </>
      )
      )}
      {!isPassedValidate && (
        <Text style={[styles.text,styles.errorText,styles.item_container_error]}>{errorMessage}</Text>
      )}
      
      { !_.isEmpty(deviceId) && (
        <Text style={[styles.text,styles.item_container_input,{ textAlign:'center',paddingBottom:2}]}>{deviceId}</Text>
      )}
    
    </>
  );
});

export default GetQrcode;