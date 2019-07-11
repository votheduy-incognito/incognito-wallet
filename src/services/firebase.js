import firebase from 'react-native-firebase';

export const initFirebaseNotification = async () => {
  try {
    const enabled = await firebase.messaging().hasPermission();

    if (!enabled) {
      await firebase.messaging().requestPermission();
    }
  } catch (e) {
    throw e;
  }
};

export const onFirebaseMessage = (onData) => {
  firebase.messaging()?.onMessage(onData);
  firebase.notifications()?.onNotification(onData);
  firebase.notifications()?.onNotificationDisplayed(onData);
};

export const getToken = () => {
  return firebase.messaging().getToken();
};

