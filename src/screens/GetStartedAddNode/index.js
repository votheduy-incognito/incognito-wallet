import BaseScreen from '@screens/BaseScreen';
import _ from 'lodash';
import React from 'react';
import { TouchableOpacity, Text, View,Image,TextInput } from 'react-native';
import { connect } from 'react-redux';
import StepIndicator from '@components/StepIndicator';
import images from '@src/assets';
import { Button, Icon } from 'react-native-elements';
import { openQrScanner } from '@src/components/QrCodeScanner';
import { onClickView } from '@src/utils/ViewUtil';
import { scaleInApp } from '@src/styles/TextStyle';
import { ScrollView } from '@src/components/core';
import routeNames from '@src/router/routeNames';
import styles from './styles';

export const TAG = 'GetStartedAddNode';
const titleStep = ['Make sure to plug-in the device into AC.','Connect your Node to a Wi-Fi','Scan the code at the base of the device','Nearly there'];
const titleButton = ['Done, next step','Next','Next','Nearly there'];
type State={
  deviceId:string
}
class GetStartedAddNode extends BaseScreen {
  constructor(props) {
    super(props);

    this.state = {
      loading: false,
      currentPage:0,
      deviceId:null
    };
    this.viewStepIndicator = React.createRef();
  }

  static getDerivedStateFromProps(nextProps, prevState) {
    return null;
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
    const {currentPage} = this.state;
    const headerStep = `STEP ${currentPage+1}`;
    return (
      <>
        <Text style={styles.title1}>{headerStep}</Text>
        <Text style={styles.title2}>{titleStep[currentPage]??''}</Text>
      </>
    );
  }

  renderContentStep2 =()=>{
    const {textInput,item} = styles;
    return (
      <>          
        <TextInput
          underlineColorAndroid="transparent"
          style={[textInput, item]}
          placeholder="Wi-Fi name"
          onChangeText={text => {}}
        />
        <TextInput
          underlineColorAndroid="transparent"
          style={[textInput, item]}
          placeholder="Password"
          onChangeText={text =>{}}
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
    const {currentPage,deviceId} = this.state;
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
      childView = (
        <>
          <Image style={styles.content_step1} source={images.ic_getstarted_scan_device} />
          {_.isEmpty(deviceId)?(
            <TouchableOpacity onPress={this.handleQrcode}>
              <Image style={styles.content_step1} source={images.ic_getstarted_qrcode} />
              <Text style={styles.step3_text}>Tap to scan</Text>
            </TouchableOpacity>
          ):this.renderViewComplete()}
          <Text
            style={[styles.textInput, styles.item]}
          >{deviceId??''}
          </Text>
        
        </>
      ); 
      break;
    }
    case 3:{
      childView = <Image style={styles.content_step1} source={images.ic_getstarted_scan_device} />; 
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
    this.onPressBack();
  }

  renderFooter=()=>{
    const {currentPage} = this.state;
    let childView  = {
      title:titleButton[currentPage],
    };
    switch(currentPage){
    case 0:{
      childView = {
        ...childView,
        onPress:()=>{
          this.CurrenPage = 1;
        },
      };
      break;
    }
    case 1:{
      childView = {
        ...childView,
        onPress:()=>{
          this.CurrenPage = 2;
        },
      }; 
      break;
    }
    case 2:{
      childView = {
        ...childView,
        onPress:()=>{
          this.CurrenPage = 3;
        },
      };
      break;
    }
    case 3:{
      childView = {
        ...childView,
        onPress:()=>{
          this.goToScreen(routeNames.AddDevice);
        },
      };
      break;
    }
    }
    return (
      <View style={styles.footer}>
        <Button
          titleStyle={styles.textTitleButton}
          buttonStyle={styles.button}
          onPress={childView.onPress}
          title={childView.title}
        />
      </View>
    );
    
  }

  render() {
    const { loading,currentPage } = this.state;

    return (
      <View style={styles.container}>
        <StepIndicator stepCount={4} currentPage={currentPage} ref={this.viewStepIndicator} />
        <ScrollView>
          <>
            {this.renderTitle()}
            {this.renderContent()}
            {this.renderFooter()}
          </>
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
