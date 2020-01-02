import { Button, Text, View } from '@src/components/core';
import PropTypes from 'prop-types';
import React, { Component } from 'react';
import { Linking, Platform } from 'react-native';
import AndroidOpenSettings from 'react-native-android-open-settings';
import { PASS_HOSPOT } from 'react-native-dotenv';
import styleSheet from './style';

class ConnectInstruction extends Component {
  constructor(props) {
    super(props);
    this.state = {
    };
  }
  renderStep=()=>{
    const {hotspotName='Node'} = this.props;
    return (
      <>
        <Text style={[styleSheet.text,styleSheet.row]}>1. Go to &quot;System Settings -&gt; Wifi&quot;</Text>
        <Text style={[styleSheet.text,styleSheet.row]}>2. Connect hotspot &quot;<Text style={[styleSheet.bold]}>{hotspotName}</Text>&quot; with password &quot;<Text style={[styleSheet.bold]}>{PASS_HOSPOT}</Text>&quot;, wait 3-5s on System Wi-Fi page</Text>
        <Text style={[styleSheet.text,styleSheet.row]}>3. Return to Incognito App and setup</Text>
      </>
    );
  }
  handleOpenSetting =()=>{
    try {
      if(Platform.OS == 'ios'){
        Linking.openURL('App-Prefs:root=WIFI').then(supported => {
        });
      }else{
        AndroidOpenSettings.wifiSettings();
      }
    } catch (error) {
      console.log('Can\'t handle settings url');
    }
   
  }
  render() {
    const { text, isVerified, containerStyle, style } = this.props;

    return (
      <View style={[styleSheet.container, containerStyle]}>
        <Text style={[styleSheet.textTitle, style]}>How to connect HOTSPOT</Text>
        <Text style={[styleSheet.text, style]}>{text}</Text>
        {this.renderStep()}
        <Button title="Go to Setting" style={styleSheet.button} onPress={this.handleOpenSetting} />
      </View>
    );
  }
}

ConnectInstruction.defaultProps = {
  text: null,
  hotspotName:'',
  isVerified: false,
  containerStyle: null,
  style: null,
};

ConnectInstruction.propTypes = {
  text: PropTypes.string,
  hotspotName: PropTypes.string,
  isVerified: PropTypes.bool,
  containerStyle: PropTypes.object,
  style: PropTypes.object,
};


export default ConnectInstruction;
