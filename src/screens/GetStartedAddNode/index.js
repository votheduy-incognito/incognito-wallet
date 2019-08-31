import BaseScreen from '@screens/BaseScreen';
import _ from 'lodash';
import React from 'react';
import { TouchableOpacity, Text, View,Image,TextInput,ScrollView } from 'react-native';
import { connect } from 'react-redux';
import StepIndicator from '@components/StepIndicator';
import images from '@src/assets';
import { Button, Icon } from 'react-native-elements';
import { openQrScanner } from '@src/components/QrCodeScanner';
import { onClickView } from '@src/utils/ViewUtil';
import { scaleInApp } from '@src/styles/TextStyle';
import routeNames from '@src/router/routeNames';
import SetupDevice from '@src/components/SetupDevice';
import LongLoading from '@src/components/LongLoading';
import styles from './styles';

export const TAG = 'GetStartedAddNode';
const titleStep = ['Make sure to plug-in the device into AC.','Connect your Node to a Wi-Fi','Scan the code at the base of the device'];
const titleButton = ['Done, next step','Next','Next'];

class GetStartedAddNode extends BaseScreen {
  constructor(props) {
    super(props);

    this.state = {
      loading: false,
      currentPage:0,
      currentConnect:{name:'',password:''},
      errorMessage:'',
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
    const {currentConnect} = this.state;
    const {textInput,item} = styles;
    return (
      <>          
        <TextInput
          underlineColorAndroid="transparent"
          style={[textInput, item]}
          placeholder="Wi-Fi name"
          defaultValue={this.wifiNameValue||''}
          onChangeText={text => {this.wifiNameValue = text;}}
        />
        <TextInput
          underlineColorAndroid="transparent"
          style={[textInput, item]}
          placeholder="Password"
          onChangeText={text =>{this.wifiPassValue = text;}}
        />
      </>
    );
  }

  renderViewComplete =()=>{
    return (
      <>
        <Icon size={scaleInApp(50)} color='#25CDD6' name="check" type='simple-line-icon' />
        <Text style={[styles.step3_text,{color:'#25CDD6'}]}>Completed</Text>
      </>
    );
  }

  renderContent=()=>{
    const {currentPage,deviceId,currentConnect,errorMessage,loading} = this.state;
    let childView ;
    switch(currentPage){
    case 0:{
      childView = <Image style={styles.content_step1} source={images.ic_getstarted_device} />; 
      break;
    }
    case 1:{
      childView = this.renderContentStep2(); 
      break;
    }
    case 2:{
      let isFail = !_.isEmpty(errorMessage);
      childView = loading? (
        <>
          {isFail && (
            <Text
              style={[styles.textInput, styles.item,styles.errorText]}
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
          <Text
            style={[styles.textInput,{ textAlign:'center',paddingBottom:2}]}
          >{deviceId??''}
          </Text>

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
    const errorMessage = await this.viewSetupDevice.current.handleSetUpPress();
    const deviceObj = _.isEmpty(errorMessage) && await this.viewSetupDevice.current.changeDeviceName('Node'); 
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
          this.setState({
            currentPage:2,
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
        onPress:this.handleStepConnect,
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
          {this.renderToastMessage()}
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
