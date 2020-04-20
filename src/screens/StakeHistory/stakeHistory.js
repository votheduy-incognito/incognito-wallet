import React from 'react';
import {
  View,
  TouchableWithoutFeedback,
  Text,
  SafeAreaView,
  FlatList,
  RefreshControl,
} from 'react-native';
import {ArrowRightGreyIcon} from '@src/components/Icons';
import PropTypes from 'prop-types';
import LoadingContainer from '@src/components/LoadingContainer';
import {useNavigation} from 'react-navigation-hooks';
import routeNames from '@src/router/routeNames';
import {styled} from './stakeHistory.styled';
import withStakeHistory from './stakeHistory.enhance';

const Item = props => {
  const {type, status, amount, statusColor, symbol, lastChild} = props;
  const navigation = useNavigation();
  const handleOnPress = () => {
    navigation.navigate(routeNames.StakeHistoryDetail, {
      data: {...props},
    });
  };
  return (
    <TouchableWithoutFeedback onPress={handleOnPress}>
      <View style={[styled.item, lastChild ? styled.lastChild : null]}>
        <View style={styled.hook}>
          <Text style={styled.type}>{type}</Text>
          <Text style={styled.amount}>{`${amount} ${symbol}`}</Text>
        </View>
        <View style={styled.action}>
          <Text style={[styled.status, {color: statusColor}]}>{status}</Text>
          <ArrowRightGreyIcon />
        </View>
      </View>
    </TouchableWithoutFeedback>
  );
};

const StakeHistory = props => {
  const {items, refreshing, onRefresh, onLoadmore, over} = props;
  return (
    <SafeAreaView style={styled.container}>
      <FlatList
        style={styled.flatList}
        data={items}
        renderItem={({item, index}) => (
          <Item {...{...item, lastChild: index === items.length - 1}} />
        )}
        keyExtractor={item => item.id}
        refreshControl={
          <RefreshControl refreshing={refreshing} onRefresh={onRefresh} />
        }
        onEndReachedThreshold={0.1}
        onEndReached={onLoadmore}
        ListFooterComponent={over ? null : <LoadingContainer />}
      />
    </SafeAreaView>
  );
};

Item.propTypes = {
  type: PropTypes.string.isRequired,
  status: PropTypes.string.isRequired,
  amount: PropTypes.oneOfType([PropTypes.string, PropTypes.number]).isRequired,
  statusColor: PropTypes.string.isRequired,
  symbol: PropTypes.string.isRequired,
  lastChild: PropTypes.bool.isRequired,
};

StakeHistory.propTypes = {
  items: PropTypes.array.isRequired,
  onRefresh: PropTypes.func.isRequired,
  refreshing: PropTypes.bool.isRequired,
  onLoadmore: PropTypes.func.isRequired,
  over: PropTypes.bool.isRequired,
};

export default withStakeHistory(StakeHistory);
