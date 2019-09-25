import StepIndicator from '@components/StepIndicator';
import BaseScreen from '@screens/BaseScreen';
import images from '@src/assets';
import LongLoading from '@src/components/LongLoading';
import { openQrScanner } from '@src/components/QrCodeScanner';
import SetupDevice from '@src/components/SetupDevice';
import routeNames from '@src/router/routeNames';
import { scaleInApp } from '@src/styles/TextStyle';
import LocalDatabase from '@src/utils/LocalDatabase';
import { onClickView } from '@src/utils/ViewUtil';
import _ from 'lodash';
import React from 'react';
import { Image, ScrollView, Text, TouchableOpacity, View } from 'react-native';
import { Button, Icon, Input } from 'react-native-elements';
import { connect } from 'react-redux';
import styles from './styles';

export const TAG = 'GetStartedAddNode';
const titleStep = ['Make sure Node is plugged in.','Connect Node to Wi-Fi','Scan the code at the base of the device'];
const titleButton = ['Done, next step','Next','Next'];

class GetStartedAddNode extends BaseScreen {
  constructor(props) {
    super(props);

    this.state = {
      loading: false,
      currentPage:0,
      currentConnect:{name:'',password:''},
      errorMessage:'',
      isPassedValidate:true,
      deviceId:null
    };
    this.viewStepIndicator = React.createRef();
    this.viewSetupDevice = React.createRef();
    this.wifiNameValue = '';
    this.wifiPassValue = '';
  }

  handleQrcode = onClickView(()=>{
    openQrScanner(data => {
      console.log(TAG,'openQrScanner  == data',data);
      this.setState({
        deviceId:data
      });
    });
  });

  renderTitle =()=>{
    const {currentPage,currentConnect} = this.state;
    const headerStep = `STEP ${currentPage+1}`;
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

  renderViewComplete =()=>{
    return (
      <>
        <Icon size={scaleInApp(50)} color='#25CDD6' name="check" type='simple-line-icon' />
        <Text style={[styles.step3_text,{color:'#25CDD6'}]}>Scan complete</Text>
      </>
    );
  }

  renderContent=()=>{
    const {currentPage,deviceId,currentConnect,errorMessage,loading} = this.state;
    
    let childView ;
    switch(currentPage){
    case 0:{
      childView = <Image style={styles.content_step1_image} source={images.ic_getstarted_device} />; 
      break;
    }
    case 1:{
      childView = this.renderContentStep2(); 
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
          )
          }
          {!isFail && <LongLoading />}
        </>
      ):(
        <>
          <Image style={styles.content_step1} source={images.ic_getstarted_scan_device} />
          {_.isEmpty(deviceId)?(
            <TouchableOpacity onPress={this.handleQrcode}>
              <Image style={styles.content_step1} source={images.ic_getstarted_qrcode} />
              <Text style={styles.step3_text}>Tap to scan</Text>
            </TouchableOpacity>
          ):this.renderViewComplete()}
          
          {!isPassedValidate && _.isEmpty(deviceId)?(
            <Text
              style={[styles.text,styles.errorText,styles.item_container_error]}
            >Please scan QR code to get a verification code
            </Text>
          ):(
            <Text
              style={[styles.text,styles.item_container_input,{ textAlign:'center',paddingBottom:2}]}
            >{deviceId??''}
            </Text>
          )}

        </>
      ); 
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

  handleFinish =()=>{
    console.log(TAG,'handleFinish ');
    this.goToScreen(routeNames.HomeMine);
  }

  handleStepConnect = async ()=>{
    this.setState({
      loading:true,
      currentPage:2,
    });
    const deviceIdFromQrcode = this.state.deviceId;
    
    const errorMessage = await this.viewSetupDevice.current.handleSetUpPress(deviceIdFromQrcode);
    const listNode = await LocalDatabase.getListDevices()||[];
    const subfix = Date.now()%1000;
    const nodeName =  _.padEnd(`Node ${listNode.length+1}`,10,subfix);
    const deviceObj = _.isEmpty(errorMessage) ? await this.viewSetupDevice.current.changeDeviceName(nodeName):null; 
    console.log(TAG,'handleStepConnect errorMessage ',errorMessage ,deviceObj);
    if(_.isEmpty(errorMessage) && !_.isNil(deviceObj)){
      this.handleFinish();
    }else{
      this.showToastMessage(errorMessage);
      this.setState({
        loading:false,
        currentPage:0
      });
      // this.setState({errorMessage:errorMessage,loading:false});
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
          const name = device?.name||'';
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
    case 1:{
      childView = {
        ...childView,
        onPress:()=>{
          const isPassedValidate = !_.isEmpty(this.wifiNameValue);
          this.setState({
            isPassedValidate:isPassedValidate,
            currentPage:isPassedValidate? 2:1,
            currentConnect:{
              name:this.wifiNameValue,
              password:this.wifiPassValue
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
          const {deviceId} = this.state;
          const isPassedValidate = !_.isEmpty(deviceId);
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
        <Button
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
    const { loading,currentPage,currentConnect } = this.state;

    return (
      <View style={styles.container}>
        <StepIndicator stepCount={3} currentPage={currentPage} ref={this.viewStepIndicator} />
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
