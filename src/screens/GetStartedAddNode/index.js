import LongLoading from '@components/LongLoading';
import StepIndicator from '@components/StepIndicator';
import BaseScreen from '@screens/BaseScreen';
import CreateAccount from '@screens/CreateAccount';
import images from '@src/assets';
import { ButtonExtension, InputExtension as Input, Text } from '@src/components/core';
import SetupDevice from '@src/components/SetupDevice';
import { getAccountByName } from '@src/redux/selectors/account';
import routeNames from '@src/router/routeNames';
import { CustomError, ExHandler } from '@src/services/exception';
import knownCode from '@src/services/exception/customError/code/knownCode';
import NodeService from '@src/services/NodeService';
import { onClickView } from '@src/utils/ViewUtil';
import _ from 'lodash';
import React from 'react';
import { Image, ScrollView, View } from 'react-native';
import { connect } from 'react-redux';
import { DialogNotify } from './DialogNotify';
import GetQrcode from './GetQrCode';
import styles from './styles';

export const TAG = 'GetStartedAddNode';
const titleStep = ['Make sure Node is plugged in.','Scan the code at the base of the device','Connect Node to\nyour home Wi-Fi'];
const titleButton = ['Done, next step','Next','Next'];
const styleHideView = {
  opacity: 0,width: 0,height: 0
};

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
    this.viewCreateAccount = React.createRef();
    this.wifiNameValue = '';
    this.wifiPassValue = '';
    this.accountNode=null;
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

  createAccount = onClickView(async(qrCode)=>{
    try {
      if(!_.isEmpty(qrCode)){
        const {getAccountByName} = this.props;
        this.accountNode = _.isEmpty(this.accountNode)? await getAccountByName(qrCode): this.accountNode;
        // create account of node with qrcode
        console.log(TAG,'createAccount 00 accountNode ',this.accountNode);
        this.accountNode = _.isEmpty(this.accountNode) ? await this.viewCreateAccount?.current?.createAccount(qrCode):this.accountNode;
        console.log(TAG,'createAccount 01 accountNode ',this.accountNode);
      }else{
        new ExHandler(new CustomError(knownCode.node_create_account_fail),'QR-Code is empty').showWarningToast();
      }
    } catch (error) {
      new ExHandler(new CustomError(knownCode.node_create_account_fail)).showWarningToast();
    }
  })

  handleScanQrcodeSuccess = async(qrCode)=>{
    this.createAccount(qrCode);
    this.setState({QRCode:qrCode});
  }

  handleFinish =()=>{
    console.log(TAG,'handleFinish ');
    this.goToScreen(routeNames.HomeMine);
  }

  handleSetupComplete =()=>{
    // will show a pop-up message    
    this.CurrenPage = 4;
  }

  handleStepTestConnect = async ()=>{
    
    try{
      this.setState({
        loading:true,
        currentPage:2,
      });
      // setup complete
      // await Util.delay(3);
      // await Util.delay(3).then(this.handleSetupComplete);
      // setup fail
      // new ExHandler(new CustomError(knownCode.node_verify_code_fail)).showWarningToast().throw();
      // new ExHandler(new CustomError(knownCode.node_auth_firebase_fail)).showWarningToast().throw();
      // new ExHandler(new Error('Something’s not right. Please try again.')).showWarningToast().throw();
      ////
      const deviceIdFromQrcode = this.state.QRCode;
      
      const errorMessage = await this.viewSetupDevice.current.handleSetUpPress(deviceIdFromQrcode);
      
      const nodeName = deviceIdFromQrcode || await NodeService.getAName();
      const deviceObj =  await this.viewSetupDevice.current.changeDeviceName(nodeName,deviceIdFromQrcode,this.accountNode)||null; 
      console.log(TAG,'handleStepConnect errorMessage ',errorMessage ,deviceObj);
      if(_.isEmpty(errorMessage) && !_.isNil(deviceObj)){
        this.handleSetupComplete();
      }else{
        this.showToastMessage(errorMessage);
        this.setState({
          loading:false,
          errorInSetUp:null,
          currentPage:2
        });
        
      }
    }catch(e){
      let currentPage = 0;
      const {code,message = '' } = e;
      switch(code){
      case(knownCode.node_verify_code_fail):
        currentPage = 2;
        break;
      case (knownCode.node_can_not_connect_hotspot):
        currentPage = 0;
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

  handleStepConnect = async ()=>{
    try{
      this.setState({
        loading:true,
        currentPage:2,
      });
      const deviceIdFromQrcode = this.state.QRCode;
      
      const errorMessage = await this.viewSetupDevice.current.handleSetUpPress(deviceIdFromQrcode);
      
      const nodeName = deviceIdFromQrcode || await NodeService.getAName();
      const deviceObj =  await this.viewSetupDevice.current.changeDeviceName(nodeName,deviceIdFromQrcode,this.accountNode)||null; 
      console.log(TAG,'handleStepConnect errorMessage ',errorMessage ,deviceObj);
      if(_.isEmpty(errorMessage) && !_.isNil(deviceObj)){
        this.handleSetupComplete();
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
            errorInSetUp:null,
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
          const wifiName = _.trim(this.wifiNameValue);
          const isPassedValidate = !_.isEmpty(wifiName);
          
          if(isPassedValidate){
            this.setState({
              isPassedValidate:true,
              currentConnect:{
                ...currentConnect,
                name:wifiName,
                password:this.wifiPassValue
              }
            },()=>{
              // hienton test
              
              this.handleStepTestConnect();
              /////
              // this.handleStepConnect();
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
    const {isRenderUI,navigation} = this.props;
    
    return (
      <View style={styles.container}>
        <View style={styleHideView}>
          <CreateAccount ref={this.viewCreateAccount} navigation={navigation} />
        </View>
        <DialogNotify visible={currentPage==4} onClose={this.handleFinish} />
        <StepIndicator stepCount={3} currentPage={currentPage} ref={this.viewStepIndicator} />
        
        <ScrollView>
          {this.renderTitle()}
          {this.renderContent()}
          <Text style={styles.errorText}>{rootCauseMessage}</Text>
          {this.renderFooter()}
          <SetupDevice ref={this.viewSetupDevice} isRenderUI={false} currentConnect={currentConnect} />
        </ScrollView>
      </View>
    );
  }

}

GetStartedAddNode.propTypes = {};

GetStartedAddNode.defaultProps = {};
const mapStateToProps = state => ({
  getAccountByName: getAccountByName(state),
});
const mapDispatchToProps = {};
export default connect(
  mapStateToProps,
  mapDispatchToProps
)(GetStartedAddNode);
