import DeviceConnection from '@components/DeviceConnection';
import { ObjConnection } from '@components/DeviceConnection/BaseConnection';
import routeNames from '@routers/routeNames';
import BaseScreen from '@screens/BaseScreen';
import _ from 'lodash';
import React from 'react';
import { ScrollView, Text, View } from 'react-native';
import { CheckBox, Icon, ListItem } from 'react-native-elements';
import Pulse from 'react-native-pulse';
import { connect } from 'react-redux';
import { imagesVector } from '@src/assets';
import { onClickView } from '@src/utils/ViewUtil';
import styles, { iconWifi } from './styles';

export const TAG = 'AddDevice';

class AddDevice extends BaseScreen {
  constructor(props) {
    super(props);

    this.state = {
      loading: true,
      isAdmin: false,
      user: undefined,
      locationsList: [],
      currentConnect: undefined,
      selectedDevice: null,
      DevicesList: []
    };
    this.deviceId = React.createRef();
  }

  static getDerivedStateFromProps(nextProps, prevState) {
    return null;
  }

  componentDidMount = async ()=> {
    super.componentDidMount();
    
        this.deviceId?.current?.getCurrentConnect().then((device:ObjConnection) => {
          console.log(
            TAG,
            'componentDidMount begin currentConnect = ',device);
          if (!_.isEmpty(device)) {
            // const name = device.name;
            // const isConnectedHotpost = _.isEqual(name, 'The Miner');
            // if (!isConnectedHotpost) {
            //   const deviceMiner = new ObjConnection();
            //   deviceMiner.name = 'The Miner';
            //   deviceMiner.id = 'The Miner';
            //   this.deviceId.current.connectDevice(deviceMiner).then(result => {
            //     console.log(
            //       TAG,
            //       'componentDidMount connectDevice result =',
            //       result
            //     );
            //     if (result) {
            //       this.setState({
            //         loading: false,
            //         currentConnect: deviceMiner
            //       });
            //     }
            //   });
            // }
            
            this.setState({
              loading: false,
              currentConnect: device
            });
          }
        });
  }

  handleEnterPassword = onClickView(()=>{
    const {currentConnect} = this.state;
    this.goToScreen(routeNames.SetupWifiDevice,{
      currentConnect:currentConnect
    });
  });

  renderWaiting = () => {
    const { loading } = this.state;
    return (
      loading && (
        <View style={styles.groupWaiting}>
          <Pulse
            style={{ position: 'absolute' }}
            color="#0ECBEE"
            numPulses={3}
            diameter={400}
            speed={20}
            duration={2000}
          />
          <Icon
            reverse
            name="robot"
            size={40}
            type="material-community"
            color="#517fa4"
          />
          {/* <Text style={{ color: 'white', fontSize: 30 }}>Find Miner</Text> */}
        </View>
      )
    );
  };

  renderGroup1 =()=>{
    const { loading, currentConnect } = this.state;
    const wifiName = currentConnect?.name||'';
    if(_.isEmpty(wifiName)){
      return null;
    }
    return (
      <View style={styles.group1}>
        <Text style={styles.textLabelWifi}>
      Connect current phone
        </Text>
        <ListItem
          containerStyle={styles.group1_listitem}
          titleStyle={styles.textTitleWifi}
          title={wifiName}
          onPress={this.handleEnterPassword}
          rightIcon={iconWifi}
          subtitle='Tap to enter password'
          subtitleStyle={styles.textEnterPass}
          chevron={false}
        />
      </View>
    );
  }

  renderGroup2=()=>{
    return (
      <View style={styles.group2}>
        <ListItem
          onPress={this.handleEnterPassword}
          containerStyle={styles.group2_listitem}
          titleStyle={styles.group2_title}
          title='Connect to another router'
          chevronColor="#979797"
          chevron
        />
      </View>
    );
  }

  render() {
    const { loading, currentConnect } = this.state;

    return (
      <View style={styles.container}>
        {this.renderGroup1()}
        {this.renderGroup2()}
        <DeviceConnection
          ref={this.deviceId}
          callbackGettingListPairedDevices={(list: []) => {
            const newList = list.filter(
              item => !_.isEmpty(item.name) && !_.isEmpty(item.id)
            );
            this.setState({
              loading: _.isEmpty(newList),
              devicesList: newList
            });
          }}
        />
        {this.renderWaiting()}
        {this.renderDeviceList()}
        
      </View>
    );
  }

  set loading(isLoading) {
    this.setState({
      loading: isLoading
    });
  }

  onItemDeviceClick = async (itemDeviceSelected: {}) => {
    try {
      // save local
      // console.log(TAG, 'onItemDeviceClick begin ', itemDeviceSelected);
      // this.deviceId?.current.saveItemConnectedInLocal(itemDeviceSelected);
    } catch (error) {
      console.log(TAG, 'onItemDeviceClick error ');
    }
  };

  renderDeviceList = () => {
    const { devicesList = [], locationsList = [] } = this.state;
    const styleParent =
      _.size(locationsList) > 0 && _.size(devicesList) > 0
        ? { flex: 1 }
        : { flex: 0 };
    return (
      <View style={[styles.containerDevice, styleParent]}>
        <ScrollView>
          {devicesList.map((item, index) => {
            return (
              <ListItem
                containerStyle={{
                  width: '50%',
                  backgroundColor: 'transparent',
                  paddingHorizontal: 0
                }}
                hideChevron
                key={index}
                bottomDivider
                leftElement={(
                  <CheckBox
                    containerStyle={styles.checkBoxContent}
                    textStyle={[
                      { color: '#A3A3A3', fontWeight: 'normal' }
                    ]}
                    onPress={() => this.onItemDeviceClick(item)}
                    title={item.name || item.address}
                    checkedIcon="dot-circle-o"
                    uncheckedIcon="circle-o"
                    checked={item.checked}
                  />
                )}
              />
            );
          })}
        </ScrollView>
      </View>
    );
  };
}

AddDevice.propTypes = {};

AddDevice.defaultProps = {};
const mapStateToProps = state => ({});
const mapDispatchToProps = {};
export default connect(
  mapStateToProps,
  mapDispatchToProps
)(AddDevice);
