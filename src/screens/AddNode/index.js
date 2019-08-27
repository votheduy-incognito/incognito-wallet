import routeNames from '@routers/routeNames';
import BaseScreen from '@screens/BaseScreen';
import _ from 'lodash';
import React from 'react';
import { Image, Text, View } from 'react-native';
import { CheckBox, Icon, ListItem } from 'react-native-elements';
import { connect } from 'react-redux';
import images from '@src/assets';
import { onClickView } from '@src/utils/ViewUtil';
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
    subTitle:'Run a virtual node on your computer',
    img :images.ic_add_self_node,
  },
  // {
  //   title:'IncogCloud-Node',
  //   subTitle:'Run a script on your',
  //   img :images.ic_add_cloud_node,
  // }
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

  handleItemClick = (index) => {
    this.goToScreen(index ===0?routeNames.AddDevice:routeNames.AddSelfNode);
  };

  renderListActions = () => {

    return (
      <View style={styles.container_list_action}>
        
        {listItems.map((item, index) => {
          return (
            <ListItem
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
const mapStateToProps = state => ({});
const mapDispatchToProps = {};
export default connect(
  mapStateToProps,
  mapDispatchToProps
)(AddNode);
