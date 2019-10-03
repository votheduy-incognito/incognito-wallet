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
import SSH from 'react-native-ssh';
import {NetworkInfo} from 'react-native-network-info';
import { Image, ScrollView, Text, TouchableOpacity, View } from 'react-native';
import { Button, Icon, Input } from 'react-native-elements';
import { connect } from 'react-redux';
import styles from './styles';

export const TAG = 'GetStartedAddNode';
const titleStep = ['Make sure Node is plugged in.','Connect Node to Wi-Fi','Scan the code at the base of the device'];
const titleButton = ['Done, next step','Next','Next'];

function findMaskFromSubnet(subnet) {
  switch(subnet) {
  case '0.0.0.0':
    return 0;
  case '128.0.0.0':
    return 1;
  case '192.0.0.0':
    return 2;
  case '224.0.0.0':
    return 3;
  case '240.0.0.0':
    return 4;
  case '248.0.0.0':
    return 5;
  case '252.0.0.0':
    return 6;
  case '254.0.0.0':
    return 7;
  case '255.0.0.0':
    return 8;
  case '255.128.0.0':
    return 9;
  case '255.192.0.0':
    return 10;
  case '255.224.0.0':
    return 11;
  case '255.240.0.0':
    return 12;
  case '255.248.0.0':
    return 13;
  case '255.252.0.0':
    return 14;
  case '255.254.0.0':
    return 15;
  case '255.255.0.0':
    return 16;
  case '255.255.128.0':
    return 17;
  case '255.255.192.0':
    return 18;
  case '255.255.224.0':
    return 19;
  case '255.255.240.0':
    return 20;
  case '255.255.248.0':
    return 21;
  case '255.255.252.0':
    return 22;
  case '255.255.254.0':
    return 23;
  case '255.255.255.0':
    return 24;
  case '255.255.255.128':
    return 25;
  case '255.255.255.192':
    return 26;
  case '255.255.255.224':
    return 27;
  case '255.255.255.240':
    return 28;
  case '255.255.255.248':
    return 29;
  case '255.255.255.252':
    return 30;
  case '255.255.255.254':
    return 31;
  case '255.255.255.255':
    return 32;
  }
}

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

  nodes = [];

  componentDidMount() {
    NetworkInfo.getGatewayIPAddress().then(ipv4Address => {
      NetworkInfo.getSubnet().then(async subnet => {
        const mask = findMaskFromSubnet(subnet);
        const maxIP = Math.pow(2, 32 - mask);

        let address = ipv4Address;
        let result = 0;

        address.split('.').forEach(function(octet) {
          result <<= 8;
          result += parseInt(octet, 10);
        });

        address = result >>> 0;

        for (let ip = 1; ip < maxIP; ip++) {
          let parsedIP = address | ip;

          if (ip % 2 === 0) {
            parsedIP = parsedIP - 1;
          }

          const finalIP = [parsedIP >>> 24, parsedIP >> 16 & 255, parsedIP >> 8 & 255, parsedIP & 255].join('.');
          new Promise((resolve, reject) => {
            SSH.execute({ user: 'nuc', password: 'Binh!2345', host: finalIP }, 'sudo cat /etc/NetworkManager/system-connections/Hotspot  \n').then(
              result => resolve(result),
              error =>  reject(error)
            );
          }).then((result) => {
            const ssidRow = result.find(row => row.indexOf('ssid') === 0);
            if (ssidRow) {
              const id = ssidRow.split('=')[1];
              console.log('FinalIP', finalIP, id);
              this.nodes.push({ ip: finalIP, id });
            }
          }).catch(error => {

          });
        }
      });
    });
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

      let id = deviceId || '';
      const connectedNode = this.nodes.find(node => node.id.substring(node.id.length - 6) === id.substring(id.length - 6));
      const onReset = () => {
        SSH.execute({ user: 'nuc', password: 'Binh!2345', host: connectedNode.ip }, './reset.sh');
      };

      console.log('Substring', this.nodes[0].id, this.nodes[0].id.substring(this.nodes[0].id.length - 6), id.substring(id.length - 6));
      if (connectedNode) {
        childView = <Button onPress={onReset} title="Reset" />;
      } else {
        childView = isPassedValidate && loading ? (
          <>
            {isFail && (
              <Text
                style={[styles.text, styles.item, styles.errorText]}
              >{errorMessage}
              </Text>
            )
            }
            {!isFail && <LongLoading/>}
          </>
        ) : (
          <>
            <Image style={styles.content_step1} source={images.ic_getstarted_scan_device}/>
            {_.isEmpty(deviceId) ? (
              <TouchableOpacity onPress={this.handleQrcode}>
                <Image style={styles.content_step1} source={images.ic_getstarted_qrcode}/>
                <Text style={styles.step3_text}>Tap to scan</Text>
              </TouchableOpacity>
            ) : this.renderViewComplete()}

            {!isPassedValidate && _.isEmpty(deviceId) ? (
              <Text
                style={[styles.text, styles.errorText, styles.item_container_error]}
              >Please scan QR code to get a verification code
              </Text>
            ) : (
              <Text
                style={[styles.text, styles.item_container_input, {textAlign: 'center', paddingBottom: 2}]}
              >{deviceId ?? ''}
              </Text>
            )}

          </>
        );
      }
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
