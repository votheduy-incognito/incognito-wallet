import firebase from 'react-native-firebase';
import _ from 'lodash';
import LocalDatabase from '@src/utils/LocalDatabase';

export const notifications = firebase.notifications;
const TAG = 'firebase';
export const logEvent = async (event,eventParams = {},isGetUserInfo = true)=>{
  if(!_.isEmpty(event)){
    try {
      let user = isGetUserInfo ? await LocalDatabase.getUserInfo().catch(console.log):null;
      user = _.isEmpty(user)?{}:{email:user.toJSON().email};
      firebase.analytics().logEvent(event, {...user, ...eventParams});  
    } catch (error) {
      console.log(TAG,'logEvent error = ',error);
    }
    
  }
};
export const initFirebaseNotification = async () => {
  try {
    const enabled = await firebase.messaging().hasPermission();

    if (!enabled) {
      await firebase.messaging().requestPermission();
    }
    return true;
  } catch (e) {
    throw e;
  }
};

export const createNotificationChannel = (channelId, channelName, channelDesc) => {
  // Build a android notification channel
  const channel = new firebase.notifications.Android.Channel(
    channelId, // channelId
    channelName, // channel name
    firebase.notifications.Android.Importance.High // channel importance
  ).setDescription(channelDesc); // channel description
  // Create the android notification channel
  firebase.notifications().android.createChannel(channel);
};

export const buildNotification = ({ id, title, body , data, androidChannelId } = {}) => {
  const noti = new notifications.Notification().setNotificationId(id);
  
  title && noti.setTitle(title);
  body && noti.setBody(body);
  data && noti.setData(data);

  noti
    .android.setPriority(firebase.notifications.Android.Priority.High) // set priority in Android
    .android.setChannelId(androidChannelId) // should be the same when creating channel for Android
    .android.setAutoCancel(true); // To remove notification when tapped on it
  
  return noti;
};

export const getToken = () => {
  return firebase.messaging().getToken();
};

