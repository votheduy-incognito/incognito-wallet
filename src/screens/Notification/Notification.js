import React from 'react';
import {SafeAreaView, FlatList, RefreshControl} from 'react-native';
import PropTypes from 'prop-types';
import LoadingContainer from '@src/components/LoadingContainer';
import {styled} from './Notification.styled';
import withNotifications from './Notification.enhance';
import Notification from './Notification.item';

const Notifications = props => {
  const {
    list,
    handleLoadmore,
    showActivityIndicator,
    refreshing,
    onRefresh,
  } = props;
  const [state, setState] = React.useState({
    activeRowKey: null,
  });
  const {activeRowKey} = state;
  const _onClose = () => {
    !!activeRowKey ?? setState({...state, activeRowKey: null});
  };
  const _onOpen = rowId => {
    setState({...state, activeRowKey: rowId});
  };
  return (
    <SafeAreaView style={styled.container}>
      <FlatList
        refreshControl={
          <RefreshControl refreshing={refreshing} onRefresh={onRefresh} />
        }
        style={styled.flatlist}
        data={list}
        renderItem={({item, index}) => {
          const {id} = item;
          return (
            <Notification
              {...{
                item,
                firstChild: index === 0,
                lastChild: list.length - 1 === index,
                _onClose: () => _onClose(id),
                _onOpen: () => _onOpen(id),
                closeSwipe: activeRowKey !== id,
              }}
            />
          );
        }}
        keyExtractor={item => item.id}
        onEndReachedThreshold={0.5}
        onEndReached={handleLoadmore}
        ListFooterComponent={showActivityIndicator ? LoadingContainer : null}
      />
    </SafeAreaView>
  );
};

Notifications.propTypes = {
  list: PropTypes.array.isRequired,
  handleLoadmore: PropTypes.func.isRequired,
  isFetching: PropTypes.bool.isRequired,
  showActivityIndicator: PropTypes.bool.isRequired,
  refreshing: PropTypes.bool.isRequired,
  onRefresh: PropTypes.func.isRequired,
};

export default withNotifications(Notifications);
