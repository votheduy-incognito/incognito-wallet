import React from 'react';
import {TouchableOpacity, Image, StyleSheet} from 'react-native';
import srcNotification from '@src/assets/images/icons/notification.png';
import srcHasNotification from '@src/assets/images/icons/has_notification.png';
import PropTypes from 'prop-types';
import {useNavigation} from 'react-navigation-hooks';
import routeNames from '@src/router/routeNames';
import {useDispatch, useSelector} from 'react-redux';
import {actionFetchReadAll} from '@src/screens/Notification/Notification.actions';
import {dataNotificationsSelector} from '@src/screens/Notification/Notification.selector';
import ReadAllIcon from './icon.readAll';

const styled = StyleSheet.create({
  icon: {
    width: 22,
    height: 24,
  },
});

const NotificationIcon = props => {
  const {isReadAll, ...rest} = props;
  const navigation = useNavigation();
  const {list} = useSelector(dataNotificationsSelector);
  const disabledReadAll = list.length === 0;
  const dispatch = useDispatch();
  const handleReadAllNotifications = () => {
    if (!disabledReadAll) {
      dispatch(actionFetchReadAll());
    }
  };
  const onNavNotify = () => {
    navigation.navigate(routeNames.Notification, {
      navigationOptions: {
        title: 'Notifications',
        headerRight: (
          <ReadAllIcon
            disabled={disabledReadAll}
            onPress={handleReadAllNotifications}
          />
        ),
      },
    });
  };
  return (
    <TouchableOpacity onPress={onNavNotify} {...rest}>
      <Image
        style={styled.icon}
        source={isReadAll === true ? srcNotification : srcHasNotification}
      />
    </TouchableOpacity>
  );
};

NotificationIcon.defaultProps = {};

NotificationIcon.propTypes = {
  isReadAll: PropTypes.bool.isRequired,
};

export default NotificationIcon;
