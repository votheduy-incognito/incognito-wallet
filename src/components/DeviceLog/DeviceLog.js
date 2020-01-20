import { CONSTANT_CONFIGS } from '@src/constants';
import React, { Component } from 'react';
import { Text, TouchableOpacity, View } from 'react-native';
import deviceLog, { InMemoryAdapter, LogView } from 'react-native-device-log';
import style from './style';

export const TAG = 'DeviceLog';
const LOG = 1;
const INFO = 2;
const DEBUG = 3;
const SUCCESS = 4;


let instance;
const isOnLogView = __DEV__ || !CONSTANT_CONFIGS.isMainnet;
class DeviceLog extends Component {
  
  constructor(props) {
    super(props);
    this.state = {
      open: isOnLogView
    };
  }

  static log(...params) {
    if (instance && typeof instance?.log === 'function') {
      instance?.log(...params);
    }
  }

  static logSuccess(msg) {
    DeviceLog.log(msg, SUCCESS);
  }

  static logInfo(msg) {
    DeviceLog.log(msg, INFO);
  }


  static close = () =>  instance?.close();

  static show = () => {
     instance?.show();
  }

  async componentDidMount() {
    await deviceLog.init(new InMemoryAdapter()
      ,{
        logToConsole : true,
        logRNErrors : true,
        maxNumberToRender : 0,
        maxNumberToPersist : 0
      });
    deviceLog?.clear();

    deviceLog?.startTimer(`${TAG}`);
    instance = this;
  }
  componentWillUnmount(){
    deviceLog?.stopTimer(`${TAG}`);
  }

  handleToggleOnOf = ()=>{
    const { open } = this.state;
    open ? this.close():this.show();
  }

  close = () =>{
    const { open } = this.state;
    open &&this.setState({ open: false });
  }

  show = () => {
    console.log(TAG,'show OKKKKKK');
    const { open } = this.state;
    !open && this.setState({ open: true });
  }

  log = (msg, type = LOG) => {
    switch (type) {
    case INFO :
      deviceLog.info(msg);
      break;
    case DEBUG :
      deviceLog.debug(msg);
      break;
    case SUCCESS :
      deviceLog.success(msg);
      break;
    default:
      deviceLog.log(msg);
      break;
    }
    
  }
  render() {
    const { open } = this.state;
    const text = open? 'Close':'Show';
    const styleView = open?style.showContainer:style.hideContainer;
    return (
      
      <View style={[style.container]}>
        <TouchableOpacity onPress={this.handleToggleOnOf}><Text style={style.textTitle}>{text}</Text></TouchableOpacity>
        <View style={styleView}>
          <LogView inverted={false} multiExpanded timeStampFormat='HH:mm:ss' />
        </View>
      </View>
    );
  }
}

export default DeviceLog;
