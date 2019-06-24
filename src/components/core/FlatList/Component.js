import ActivityIndicator from '@src/components/core/ActivityIndicator';
import PropTypes from 'prop-types';
import React from 'react';
import { FlatList as RNFlatList } from 'react-native';
import { ListItem } from 'react-native-elements';
import { View } from '..';
import Text from '../Text/Component';
import style from './style';
/**
* @augments {Component<{  listItem:any>}
*/
class FlatList extends React.PureComponent {
  constructor(props){
    super(props);
    this.combineProp = {renderItem:this.renderItem,ListEmptyComponent:this.renderEmpty,
      ListHeaderComponent:this.renderHeader,...props};
  }
  render() {
   
    return (
      <RNFlatList {...this.combineProp} />
    );
  }
  renderEmpty = () => {
    return (
      <View style={[style.containerImg, {}]}>
        <Text>
          There are no data available
        </Text>
      </View>
    );
  };
  renderLoading = () => {
    const {refreshing = false} = this.combineProp;
    if (!isFetching) return null;
    return <ActivityIndicator />;
  };
  renderHeader = () => {
    return null;
  };

  renderItem= ({item})=>{
    const {listItem} = this.props;
    return <ListItem {...listItem} />;
  }
}

FlatList.propTypes = {
  listItem: PropTypes.shape()
};
export default FlatList;
