import LongLoading from '@components/LongLoading';
import StepIndicator from '@components/StepIndicator';
import BaseScreen from '@screens/BaseScreen';
import images from '@src/assets';
import { openQrScanner } from '@src/components/QrCodeScanner';
import SetupDevice from '@src/components/SetupDevice';
import routeNames from '@src/router/routeNames';
import APIService from '@src/services/api/miner/APIService';
import { scaleInApp } from '@src/styles/TextStyle';
import LocalDatabase from '@src/utils/LocalDatabase';
import Util from '@src/utils/Util';
import ViewUtil, { onClickView } from '@src/utils/ViewUtil';
import _ from 'lodash';
import React, { useCallback, useState, useMemo } from 'react';
import { Image, ScrollView, TouchableOpacity, View } from 'react-native';
import { Icon } from 'react-native-elements';
import { connect } from 'react-redux';
import { Text,ButtonExtension,InputExtension as Input } from '@src/components/core';
import knownCode from '@src/services/exception/customError/code/knownCode';
import NodeService from '@src/services/NodeService';
import styles from './styles';

export const TAG = 'GetStartedAddNode';
const titleStep = ['Make sure Node is plugged in.','Scan the code at the base of the device','Connect Node to\nyour home Wi-Fi'];
const titleButton = ['Done, next step','Next','Next'];
const GetQrcode = React.memo(({onSuccess,qrCode = ''})=>{
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
class GetStartedAddNode extends BaseScreen {
  constructor(props) {
    super(props);

    this.state = {
      loading: false,
      currentPage:0,
      currentConnect:{name:'',password:''},
      errorMessage:'',
      errorInSetUp:null,
      isPassedValidate:true,
      QRCode:null
    };
    this.viewStepIndicator = React.createRef();
    this.viewSetupDevice = React.createRef();
    this.wifiNameValue = '';
    this.wifiPassValue = '';
  }

  renderTitle =()=>{
    const {currentPage,currentConnect} = this.state;
    // const headerStep = `STEP ${currentPage+1}`;
    console.log(TAG,'renderTitle ',currentConnect);
    return (
      <>
        {/* <Text style={styles.title1}>{headerStep}</Text> */}
        <Text style={styles.title2}>{titleStep[currentPage]??''}</Text>
      </>
    );
  }

  renderContentStep2 =()=>{
    const {currentConnect,isPassedValidate} = this.state;
    const {text,item,item_container_input,errorText} = styles;
    return (
      <>          
        <Input
          underlineColorAndroid="transparent"
          containerStyle={item}
          inputContainerStyle={item_container_input}
          inputStyle={[text]}
          placeholder="Wi-Fi name"
          errorStyle={[errorText,{textAlign:'left'}]}
          errorMessage={!isPassedValidate && _.isEmpty(this.wifiNameValue)?'Required':''}
          defaultValue={this.wifiNameValue||''}
          onChangeText={text => {this.wifiNameValue = text;}}
        />
        <Input
          underlineColorAndroid="transparent"
          containerStyle={item}
          inputContainerStyle={item_container_input}
          inputStyle={[text]}
          placeholder="Password"
          defaultValue={this.wifiPassValue||''}
          onChangeText={text =>{this.wifiPassValue = text;}}
        />
      </>
    );
  }

  renderContent=()=>{
    const {currentPage,QRCode,currentConnect,errorMessage,loading} = this.state;
    
    let childView ;
    switch(currentPage){
    case 0:{
      childView = <Image style={styles.content_step1_image} source={images.ic_getstarted_device} />; 
      break;
    }
    // case 1:{
    //   childView = this.renderContentStep2();
    //   break;
    // }
    case 1:{
      const {isPassedValidate} = this.state;
      let isFail = !_.isEmpty(errorMessage);
      childView = (
        <>
          {isFail && (
            <Text
              style={[styles.text, styles.item,styles.errorText]}
            >{errorMessage}
            </Text>
          )}
          <GetQrcode qrCode={QRCode} onSuccess={this.handleScanQrcodeSuccess} />
        </>
      ); 
      break;
    }
    case 2:{
      const {isPassedValidate} = this.state;
      let isFail = !_.isEmpty(errorMessage);
      childView = isPassedValidate && loading? (
        <>
          {isFail && (
            <Text
              style={[styles.text, styles.item,styles.errorText]}
            >{errorMessage}
            </Text>
          )}
          {!isFail && <LongLoading />}
        </>
      ): this.renderContentStep2(); 
      break;
    }
    
    }
    return (
      <View style={styles.content}>
        {childView}
      </View>
    );
  }

  set CurrenPage(currentPage:Number){
    this.setState({
      currentPage:currentPage
    });
  }

  handleScanQrcodeSuccess = async(qrCode)=>{
    this.setState({QRCode:qrCode});
  }

  handleFinish =()=>{
    console.log(TAG,'handleFinish ');
    this.goToScreen(routeNames.HomeMine);
  }

  handleStepConnect = async ()=>{
    try{
      this.setState({
        loading:true,
        currentPage:2,
      });
      const deviceIdFromQrcode = this.state.QRCode;
      
      const errorMessage = await this.viewSetupDevice.current.handleSetUpPress(deviceIdFromQrcode);
      
      const nodeName = await NodeService.getAName();
      const deviceObj =  await this.viewSetupDevice.current.changeDeviceName(nodeName)||null; 
      console.log(TAG,'handleStepConnect errorMessage ',errorMessage ,deviceObj);
      if(_.isEmpty(errorMessage) && !_.isNil(deviceObj)){
        this.handleFinish();
      }else{
        this.showToastMessage(errorMessage);
        
      }
    }catch(e){
      let currentPage = 0;
      const {code,message = '' } = e;
      switch(code){
      case(knownCode.node_verify_code_fail):
        currentPage = 2;
        break;
      case (knownCode.node_auth_firebase_fail):{
        currentPage=2;
        break;
      }
      }
      this.setState({
        loading:false,
        errorInSetUp:e,
        currentPage:currentPage
      });
    }
    
  }

  renderFooter=()=>{
    const {currentPage,loading,errorMessage,currentConnect} = this.state;
    let childView  = {
      title:titleButton[currentPage],
    };
    switch(currentPage){
    case 0:{
      childView = {
        ...childView,
        onPress:async()=>{
          const device = await this.viewSetupDevice.current?.getCurrentConnect();
          const name = device?.name||this.wifiNameValue;
          this.wifiNameValue = name;
          this.setState({
            currentPage:1,
            currentConnect:{
              ...currentConnect,
              name:name
            }
          });
        },
      };
      break;
    }
    case 2:{
      childView = {
        ...childView,
        onPress:()=>{
          const isPassedValidate = !_.isEmpty(this.wifiNameValue);
          if(isPassedValidate){
            this.setState({
              isPassedValidate:true
            },()=>{
              this.handleStepConnect();
            });
            
          }else{
            this.setState({
              isPassedValidate:false,
            });
          }
        
          
        },
      }; 
      break;
    }
    case 1:{
      childView = {
        ...childView,
        onPress:()=>{
          const {QRCode} = this.state;
          const isPassedValidate = !_.isEmpty(QRCode);
          this.setState({
            isPassedValidate:isPassedValidate,
            currentPage:isPassedValidate? 2:1,
            currentConnect:{
              name:this.wifiNameValue,
              password:this.wifiPassValue
            }
          });
        }
      };
      break;
    }
    case 3:{
      let title = !_.isEmpty(errorMessage)?'Retry':childView.title;
      childView = {
        title:title,
        onPress:this.handleStepConnect,
      };
      break;
    }
    }
    return (
      <View style={styles.footer}>
        <ButtonExtension
          disabled={loading}
          loading={loading}
          titleStyle={styles.textTitleButton}
          buttonStyle={styles.button}
          onPress={childView.onPress}
          title={childView.title}
        />
      </View>
    );
    
  }

  render() {
    const { loading,currentPage,currentConnect,errorMessage,errorInSetUp } = this.state;
    const rootCauseMessage = errorInSetUp?.message??'';

    return (
      <View style={styles.container}>
        <StepIndicator stepCount={3} currentPage={currentPage} ref={this.viewStepIndicator} />
        <Text style={styles.errorText}>{rootCauseMessage}</Text>
        <ScrollView>
          {this.renderTitle()}
          {this.renderContent()}
          {this.renderFooter()}
          <SetupDevice ref={this.viewSetupDevice} isRenderUI={false} currentConnect={currentConnect} />
        </ScrollView>
      </View>
    );
  }

}

GetStartedAddNode.propTypes = {};

GetStartedAddNode.defaultProps = {};
const mapStateToProps = state => ({});
const mapDispatchToProps = {};
export default connect(
  mapStateToProps,
  mapDispatchToProps
)(GetStartedAddNode);
