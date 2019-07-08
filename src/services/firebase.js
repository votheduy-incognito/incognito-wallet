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

export const getToken = () => {
  return firebase.messaging().getToken();
};

