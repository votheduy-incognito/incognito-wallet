import DeviceConnection from '@src/components/DeviceConnection';
import BaseScreen from '@src/screens/BaseScreen';
import TextStyle from '@src/styles/TextStyle';
import _ from 'lodash';
import React from 'react';
import { ScrollView, Text, View } from 'react-native';
import { Button, CheckBox, Icon, ListItem } from 'react-native-elements';
import Pulse from 'react-native-pulse';
import { connect } from 'react-redux';
import styles from './styles';

export const TAG = 'AddDevice';

class AddDevice extends BaseScreen {
  constructor(props) {
    super(props);

    this.state = {
      loading: true,
      isAdmin: false,
      user: undefined,
      locationsList: [],
      selectedDevice: null,
      DevicesList: []
    };
    this.deviceId = React.createRef();
  }

  static getDerivedStateFromProps(nextProps, prevState) {
    return null;
  }

  componentDidMount() {
    super.componentDidMount();
  }

  renderWaiting =()=>{
    const {loading} = this.state;
    return loading && (
      <View style={{marginTop:100,alignItems:'center',justifyContent:'center',position:'relative',width:300,height:300}}>
        <Pulse style={{position:'absolute'}} color='orange' numPulses={3} diameter={400} speed={20} duration={2000} />
        <Icon
          reverse
          name='robot'
          type='material-community'
          color='#517fa4'
        />
        <Text>Find Miner</Text>
      </View>
    );
    
  }

  render() {
    const { loading } = this.state;
    return (
      <View style={styles.container}>
        <Button
          title="Scan"
          onPress={() => {
            this.loading = true;
            this.deviceId.current.scan();
          }}
        />
        <DeviceConnection
          ref={this.deviceId}
          callbackGettingListPairedDevices={(list: []) => {
            const newList = list.filter(
              item => !_.isEmpty(item.name) && !_.isEmpty(item.id)
            );
            this.setState({
              loading: false,
              devicesList: newList
            });
          }}
        />
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
      this.deviceId?.current.saveItemConnectedInLocal(itemDeviceSelected);
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
                      TextStyle.normalText,
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
const mapStateToProps = state => ({
 
});
const mapDispatchToProps = {};
export default connect(
  mapStateToProps,
  mapDispatchToProps
)(AddDevice);
