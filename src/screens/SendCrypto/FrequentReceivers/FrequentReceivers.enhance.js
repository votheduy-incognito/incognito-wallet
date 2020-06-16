import React from 'react';
import {ExHandler} from '@src/services/exception';
import {useNavigationParam, useNavigation} from 'react-navigation-hooks';
import _ from 'lodash';
import {useSelector, useDispatch} from 'react-redux';
import {receiversSelector} from '@src/redux/selectors/receivers';
import {actionDelete} from '@src/redux/actions/receivers';
import routeNames from '@src/router/routeNames';
import {compose} from 'recompose';
import {withHeaderTitle} from '@src/components/Hoc';
import {getRecently} from './FrequentReceivers.utils';
import withSync from './FrequentReceivers.withSync';
import Empty from './FrequentReceivers.empty';

const enhance = WrappedComp => props => {
  const navigation = useNavigation();
  const dispatch = useDispatch();
  const [state, setState] = React.useState({
    data: [],
    keySearch: '',
  });
  const keySave = useNavigationParam('keySave');
  const onSelectedItem = useNavigationParam('onSelectedItem');
  const disabledSwipe = useNavigationParam('disabledSwipe');
  const disabledSelectedAddr =
    useNavigationParam('disabledSelectedAddr') || false;
  const {data, keySearch} = state;
  const {receivers} = useSelector(receiversSelector)[keySave];
  const recently = getRecently(receivers);
  const initData = async () => {
    try {
      await setState({...state, data: [...receivers]});
    } catch (error) {
      new ExHandler(error).showErrorToast();
    }
  };
  const searchByKey = async () => {
    try {
      const key = keySearch.trim().toLowerCase();
      if (key.length === 0) {
        return await setState({
          ...state,
          data: [...receivers],
        });
      }
      return await setState({
        ...state,
        data: [
          ...receivers.filter(
            item =>
              _.includes(item?.name.toLowerCase(), key) ||
              _.includes(item?.address.toLowerCase(), key),
          ),
        ],
      });
    } catch (error) {
      new ExHandler(error).showErrorToast();
    }
  };
  const onSelectedAddress = async (receiver = {name: '', address: ''}) => {
    if (typeof onSelectedItem === 'function') {
      return onSelectedItem(receiver);
    }
  };
  const onClearAddress = async () => {
    await setState({
      ...state,
      keySearch: '',
    });
  };
  const onChangeKeySearch = keySearch => setState({...state, keySearch});
  const onUpdateReceiver = async info => {
    navigation.navigate(routeNames.FrequentReceiversForm, {
      info: {
        ...info,
        toAddress: info?.address,
      },
      keySave,
      action: 'update',
      headerTitle: 'Edit',
    });
  };

  const onDeleteReceiver = async receiver => {
    try {
      await dispatch(
        actionDelete({
          keySave,
          receiver,
        }),
      );
    } catch (error) {
      new ExHandler(error).showErrorToast();
    }
  };

  React.useEffect(() => {
    searchByKey();
  }, [keySearch]);
  React.useEffect(() => {
    initData();
  }, [receivers]);
  if (receivers.length === 0) {
    return <Empty />;
  }
  return (
    <WrappedComp
      {...{
        ...props,
        data: data.sort((a, b) => a.name.localeCompare(b.name)),
        keySearch,
        setState,
        onClearAddress,
        onSelectedAddress,
        onChangeKeySearch,
        disabledSwipe,
        onUpdate: onUpdateReceiver,
        onDelete: onDeleteReceiver,
        shouldDisabledItem: typeof onSelectedItem !== 'function',
        disabledSelectedAddr,
        recently,
        hideRecently: keySearch.length > 0,
      }}
    />
  );
};

export default compose(withHeaderTitle, withSync, enhance);
