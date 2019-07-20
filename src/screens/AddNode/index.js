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
import images from '@src/assets';
import styles from './styles';

export const TAG = 'AddNode';
const listItems = [
  {
    title:'Incognito-device',
    img :images.ic_device,
  },
  {
    title:'Self-Node',
    img :images.ic_device,
  },
  {
    title:'IncogCloud-device',
    img :images.ic_device,
  }
];
class AddNode extends BaseScreen {
  constructor(props) {
    super(props);

    this.state = {
      loading: true,
      isAdmin: false,
      user: undefined
    };
    
  }

  static getDerivedStateFromProps(nextProps, prevState) {
    return null;
  }

  componentDidMount = async ()=> {
    super.componentDidMount();
  }

  render() {
    const { loading, currentConnect } = this.state;

    return (
      <View style={styles.container}>
        {this.renderListActions()}
      </View>
    );
  }

  set loading(isLoading) {
    this.setState({
      loading: isLoading
    });
  }

  onItemClick = async (index) => {
    this.goToScreen(routeNames.AddDevice);
  };

  renderListActions = () => {
    
    const styleParent = { flex: 1 };
    return (
      <View style={styles.container_list_action}>
        
        {listItems.map((item, index) => {
          return (
            <ListItem
              containerStyle={styles.item_container}
              title={item.title}
              hideChevron
              leftAvatar={{
                source:item.img
              }}
              onPress={() => this.onItemClick(index)}
              key={index}
              titleStyle={styles.title}
            />
          );
        })}
      </View>
    );
  };
}

AddNode.propTypes = {};

AddNode.defaultProps = {};
const mapStateToProps = state => ({});
const mapDispatchToProps = {};
export default connect(
  mapStateToProps,
  mapDispatchToProps
)(AddNode);
