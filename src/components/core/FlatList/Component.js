import ActivityIndicator from '@src/components/core/ActivityIndicator';
import PropTypes from 'prop-types';
import React from 'react';
import { FlatList as RNFlatList } from 'react-native';
import { View } from '..';
import Text from '../Text/Component';
import style from './style';
import ListItem from './ListItem';
/**
* @augments {Component<{  listItem:any>}
*/
class FlatList extends React.Component {
  constructor(props){
    super(props);
    this.combineProp = {renderItem:this.renderItem,ListEmptyComponent:this.renderEmpty,
      ListHeaderComponent:this.renderHeader,...props};
  }
  
  renderEmpty = () => {
    const { emptyText } = this.props;
    return (
      <View style={[style.containerImg, {}]}>
        <Text>
          { emptyText ?? 'There are no data available'}
        </Text>
      </View>
    );
  };
  renderLoading = () => {
    const {refreshing = false,isFetching} = this.combineProp;
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
  render() {
    return (
      <RNFlatList {...this.combineProp} {...this.props} />
    );
  }
}

FlatList.defaultProps = {
  listItem: null,
  emptyText: null
};

FlatList.propTypes = {
  listItem: PropTypes.shape(),
  emptyText: PropTypes.string,
};
export default FlatList;
