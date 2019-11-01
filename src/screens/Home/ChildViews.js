import React, { Component, useEffect, useRef, useCallback } from 'react';
import { Animated, StyleSheet, View,Image } from 'react-native';
import Dialog, { DialogContent } from 'react-native-popup-dialog';
import { Text, ButtonExtension } from '@src/components/core';
import TextStyle, { scaleInApp, FontStyle } from '@src/styles/TextStyle';
import { onClickView } from '@src/utils/ViewUtil';
import images from '@src/assets';

const style = StyleSheet.create({
  dialog_title_text: {
    ...TextStyle.bigText,
    color:'#000000',
  },
  dialog_title_text2:{
    ...TextStyle.mediumText,
    color:'#000000',
    marginTop:scaleInApp(4)
  },
  dialog_content_text: {
    ...TextStyle.bigText,
    color:'#000000',
    
  },
  dialog_content: {
    flex:1,
    padding:scaleInApp(20),
  },
  dialog_content2: {
    flex:1,
    justifyContent:'flex-end',
    marginBottom:scaleInApp(20),
  },
  dialog_container:{
    flex:1,
    paddingLeft:0,
    paddingRight:0
  },
  dialog_button:{
    backgroundColor:'#25CDD6',
    borderRadius:scaleInApp(4),
  },
});
const DialogUpgradeToMainnet = React.memo(({isVisible = true ,onButtonClick})=>{
  
  return (
    <Dialog
      width={0.9}
      height={0.65}
      visible={isVisible}
      onTouchOutside={() => {
      }}
    > 
      <DialogContent style={style.dialog_container}>
        <Image style={{width:'100%'}} resizeMode="cover" source={images.dialog_top} />
        <View style={style.dialog_content}>
          <Text style={style.dialog_title_text}>Welcome to the Incognito Mainnet!</Text>
          <Text style={[style.dialog_title_text2,{...FontStyle.bold,fontStyle: 'italic', marginTop:scaleInApp(10),fontWeight:'bold'}]}>1 PRV is on its way to your wallet.</Text>
          <Text style={[style.dialog_title_text2]}>Give it a couple of minutes.</Text>
          
          <View style={style.dialog_content2}>
            <Text style={style.dialog_title_text2}>Use it to:</Text>
            <Text style={style.dialog_title_text2}>&#183; Privately store and send BTC,ETH, PRV and more</Text>
            <Text style={style.dialog_title_text2}>&#183; Issue your own privacy token</Text>
          </View>
          <ButtonExtension
            titleStyle={style.textTitleButton}
            buttonStyle={style.dialog_button}
            onPress={onButtonClick}
            title='Go incognito'
          />
        </View>
      </DialogContent>

    </Dialog>
  );
});
export {
  DialogUpgradeToMainnet
};