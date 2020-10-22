/* eslint-disable react/prop-types */
import React from 'react';
import PropTypes from 'prop-types';
import _ from 'lodash';
import { compose } from 'recompose';
import { View, Text, TouchableOpacity } from '@components/core';
import { withLayout_2 } from '@components/Layout';
import Header from '@components/Header/index';
import { VirtualizedList } from 'react-native';
import { useNavigation } from 'react-navigation-hooks';
import ROUTE_NAMES from '@routers/routeNames';
import LoadingContainer from '@components/LoadingContainer/LoadingContainer';
import { LIMIT } from '@screens/DexV2/constants';
import { ArrowRightGreyIcon } from '@components/Icons';
import withHistories from './Histories.enhance';
import { styled } from './Histories.styled';

const HistoryItem = React.memo(({ item }) => {
  const navigation = useNavigation();
  const viewDetail = (item) => {
    navigation.navigate(ROUTE_NAMES.TradeHistoryDetail, { history: item });
  };
  return (
    <TouchableOpacity
      key={item.id}
      style={styled.historyItem}
      onPress={() => viewDetail(item)}
    >
      <Text style={styled.buttonTitle}>
        {item.type} <Text style={styled.content}>#{item.id}</Text>
      </Text>
      <View style={styled.row}>
        <Text style={[styled.content, styled.ellipsis]} numberOfLines={1}>
          {item.description}
        </Text>
        <View style={[styled.row, styled.center]}>
          <Text style={styled.content} numberOfLines={1}>
            {item.status}
          </Text>
          <ArrowRightGreyIcon style={{ marginLeft: 10 }} />
        </View>
      </View>
    </TouchableOpacity>
  );
});

const History = (props) => {
  const {
    histories,
    isLoadingHistories,
    onReloadHistories,
    onLoadMoreHistories,
  } = props;
  return (
    <View style={styled.wrapper}>
      <Header title="pDEX" />
      <Text style={[styled.buttonTitle, styled.historyTitle]}>
        Order history
      </Text>
      <View style={styled.wrapper}>
        {histories.length ? (
          <VirtualizedList
            data={histories}
            renderItem={({ item }) => <HistoryItem item={item} />}
            getItem={(data, index) => data[index]}
            getItemCount={(data) => data.length}
            refreshing={isLoadingHistories}
            onRefresh={onReloadHistories}
            keyExtractor={(item) => item.id}
            onEndReached={
              (histories || []).length >= LIMIT ? onLoadMoreHistories : _.noop
            }
            onEndReachedThreshold={0.1}
            showsVerticalScrollIndicator={false}
            showsHorizontalScrollIndicator={false}
          />
        ) : (
          <LoadingContainer />
        )}
      </View>
    </View>
  );
};

History.propTypes = {
  histories: PropTypes.array.isRequired,
  isLoadingHistories: PropTypes.bool.isRequired,
  onReloadHistories: PropTypes.func.isRequired,
  onLoadMoreHistories: PropTypes.func.isRequired,
};

export default compose(
  withLayout_2,
  withHistories,
)(History);
