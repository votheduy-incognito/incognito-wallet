import { ButtonExtension, Text, View } from '@components/core';
import { DEVICES } from '@src/constants/miner';
import NodeService from '@src/services/NodeService';
import TextStyle, { FontStyle, scaleInApp } from '@src/styles/TextStyle';
import Util from '@src/utils/Util';
import ViewUtil from '@src/utils/ViewUtil';
import React, { useCallback, useMemo } from 'react';
import { StyleSheet } from 'react-native';
import Dialog, { DialogContent } from 'react-native-popup-dialog';
// import styles from './style';

const TAG = 'DialogNotify';
const styles = StyleSheet.create({
  container: {
  },
  textItem:{
    ...TextStyle.normalText,
    color:'black'
  },
  textSubtitle:{
    ...TextStyle.minimizeText,
    color:'#91A4A6'
  },
  dialog_title_text: {
    ...TextStyle.bigText,
    ...FontStyle.medium,
    alignSelf:'center',
    color:'#1C1C1C',
  },
  dialog_content_text: {
    ...TextStyle.normalText,
    color:'#1C1C1C',
    textAlignVertical:'center',
    textAlign:'center',
    paddingHorizontal: 5,
  },
  dialog_content: {
    flex:1,
    alignItems:'center',
    justifyContent:'center',
  },
  dialog_container:{
    flex:1,
    paddingVertical:scaleInApp(20),
    paddingHorizontal:scaleInApp(30),
  },
  dialog_button:{
    backgroundColor:'#25CDD6',
    borderRadius:scaleInApp(4),
  },
  textTitleButton:{
    ...TextStyle.mediumText,
    ...FontStyle.medium,
    color:'#FFFFFF'
  },
});

const Loading = React.memo((props)=>{
  return (
    <View style={styles.dialog_content}>
      {ViewUtil.loadingComponent()}
      <Text style={styles.dialog_content_text}>Wait a moment</Text>
    </View>
  );
});

const ProcessingUpgrade = React.memo(({device,isUpdating,onSuccess,onFail,onClose})=>{
  const [loading,setLoading] = React.useState(false);
  const [textContent,setTextContent] = React.useState('');
  const onPressButton = useCallback(async () => {
    console.log(TAG,'DialogNotify onPressButton',isUpdating);
    onClose&&onClose();

  },[]);
  const processingUpgrade = async () =>{
    if(device && device.Type == DEVICES.MINER_TYPE){
      console.log(TAG,'processingUpgrade begin isUpdating = ');
      setLoading(true);
      const {isHave=false,current,node} = await NodeService.checkUpdatingVersion(device).catch(console.log)??{};
      console.log(TAG,'processingUpgrade begin 01');
      if(isHave){
        return new Error('Have new version');
      }else{
        setTextContent('Node firmware is upgraded successfully.');
        onSuccess&&onSuccess(current);
      }
      setLoading(false);
      return true;
    }
  };

  useMemo(
    async ()=>{
      if(isUpdating){
        console.log(TAG,'ProcessingUpgrade memo updating ------');
        await Util.tryAtMost(processingUpgrade,15,3);
      }
    },
    [isUpdating]
  );
  return (
    <>
      {loading?<Loading />: (
        <>
          <View style={styles.dialog_content}>
            <Text style={styles.dialog_content_text}>{textContent}</Text>
          </View>
          <ButtonExtension
            titleStyle={styles.textTitleButton}
            buttonStyle={styles.dialog_button}
            onPress={onPressButton}
            title='OK'
          />
        </>
      )}
    </>
  );
});

export const DialogNotify = React.memo(({walletName,visible,device,onClose})=>{
  
  const [loading,setLoading] = React.useState(false);
  const [isShowMessage,setShowMessage] = React.useState(visible);
  const textContent = 'A wallet has been created for you. Remember to copy your private key and keep it somewhere safe.';
  const textTitle = 'Now, keep Node safe!';
  const lableButton = 'OK';
  useMemo(()=>{
    setShowMessage(visible);
  },[visible]);
  
  const onPressButton = useCallback(async () => {
    setShowMessage(false);
    onClose&&onClose();
  },[visible]);
  
  
  return (
    <Dialog
      width={0.8}
      height={0.35}
      visible={isShowMessage}
    >
      <DialogContent style={styles.dialog_container}>
        <Text style={styles.dialog_title_text}>{textTitle}</Text>
        
        <View style={styles.dialog_content}>
          <Text style={styles.dialog_content_text}>{textContent}</Text>
        </View>
        <ButtonExtension
          titleStyle={styles.textTitleButton}
          buttonStyle={styles.dialog_button}
          onPress={onPressButton}
          title={lableButton}
        />
      </DialogContent>
       
    </Dialog>
  );
});