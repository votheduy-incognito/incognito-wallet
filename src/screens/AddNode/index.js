import routeNames from '@routers/routeNames';
import BaseScreen from '@screens/BaseScreen';
import images from '@src/assets';
import { onClickView } from '@src/utils/ViewUtil';
import React from 'react';
import { Image, TouchableOpacity, View } from 'react-native';
import { ListItem } from '@src/components/core';
import styles, { rightNextIcon } from './styles';

export const TAG = 'AddNode';
const listItems = [
  {
    title:'Device',
    subTitle:'Plug in and connect',
    img :images.ic_add_node_device,
  },
  {
    title:'Virtual Node',
    subTitle:'Run a virtual node',
    img :images.ic_add_self_node,
  },
];

class AddNode extends BaseScreen {
  render() {
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

  handleItemClick = (index) => {
    if (index === 2) {
      return this.goToScreen(routeNames.LinkDevice);
    }

    this.goToScreen(index ===0?routeNames.GetStaredAddNode:routeNames.AddSelfNode);
  };

  renderListActions = () => {

    return (
      <View style={styles.container_list_action}>

        {listItems.map((item, index) => {
          return (
            <ListItem
              Component={TouchableOpacity}
              containerStyle={styles.item_container}
              title={item.title}
              subtitle={item.subTitle}
              leftElement={<Image resizeMode='contain' source={item.img} style={styles.avatar} />}
              rightIcon={rightNextIcon}
              subtitleStyle={styles.subTitle}
              onPress={onClickView(()=>this.handleItemClick(index))}
              key={`${item.title}`}
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

export default AddNode;
