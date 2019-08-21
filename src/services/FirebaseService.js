/**
 * @providesModule FirebaseService
 */
import firebase from 'react-native-firebase';
import _ from 'lodash';
import Util from '@src/utils/Util';

export const MAIL_UID_FORMAT = '@autonomous.ai';
export const PHONE_CHANNEL_FORMAT = '_PHONE';
export const DEVICE_CHANNEL_FORMAT = '';
export const FIREBASE_PASS = 'at9XafdcJ7TVHzGa';
const STATUS_CODE = {
  OFFLINE :-1,
  SERVER:1,
};
let ref = null;
let uid = null;
// let myManager = null;

let currentChannel;
let dictCallback = {};
let obj = {
  key1: 'value1',
  key2: 'value2'
};
let dictKey = {};
const TAG = 'FirebaseService';
export default class FirebaseService {
  static myManager;
  constructor(){
    this.currentUserName = '';
  }
  static getShareManager() {
    if (FirebaseService.myManager == null) {
      console.log('Create new instance');
      FirebaseService.myManager = new FirebaseService();
      FirebaseService.myManager.configurateDatabase();
    }

    return FirebaseService.myManager;
  }
  async auth(username, password, success, fail) {
    console.log(TAG,' auth begin');
    console.log(TAG,' auth begin 01 currentUserName = ',this.currentUserName);
    
    if (firebase.auth().currentUser !== null && this.currentUserName == username) {
      
      console.log(TAG,' auth begin02 has authenticated = ',firebase.auth().currentUser.uid);
      success(firebase.auth().currentUser?.uid||'');
    } else {
      if (firebase.auth().currentUser !== null) {
        console.log(TAG,'auth begin03 logout');
        //Logout
        await this.logout();
        this.createFirebaseAccount(username, password, success, fail);
      } else {
        console.log(TAG,'auth begin04 Create firebase account');
        this.createFirebaseAccount(username, password, success, fail);
      }
    }
  }
  createFirebaseAccount(username, password, success, fail) {
    // console.log(TAG,'Create firebase account');
    // console.log('Username: ', username);
    // console.log('Password: ', password);
    firebase
      .auth()
      .signInWithEmailAndPassword(username, password)
      .then(authResult => {
        const user = authResult.user;
        // If you need to do anything with the user, do it here
        // The user will be logged in automatically by the
        // `onAuthStateChanged` listener we set up in App.js earlier
        // console.log(TAG,'createFirebaseAccount begin ', user);
        this.currentUserName = username;
        success(user.uid);
      })
      .catch(error => {
        const { code, message } = error;
        // For details of error codes, see the docs
        // The message contains the default Firebase string
        // representation of the error
        console.log('Signin failed: ', error);

        firebase
          .auth()
          .createUserWithEmailAndPassword(username, password)
          .then(user => {
            // If you need to do anything with the user, do it here
            // The user will be logged in automatically by the
            // `onAuthStateChanged` listener we set up in App.js earlier
            console.log('Create account success');

            console.log(TAG,'createFirebaseAccount fail and again -- ', user);
            this.currentUserName = username;
            success(user.uid);
          })
          .catch(err => {
            const { code, message } = err;
            // For details of error codes, see the docs
            // The message contains the default Firebase string
            // representation of the error
            console.log('Create account error: ', err);
            fail(err);
          });
      });
  }
  configurateDatabase() {
    console.log('configurateDatabase');
    ref = firebase.database().ref();
    if (firebase.auth().currentUser !== null) {
      this.logout();
    }
  }
  checkTimeout = (action, callback)=>{
    console.log(TAG,'checkTimeout begin action = ',action);
    if (action.data['action']) {
      if (dictCallback[action.data['action']]) {
        let arrCallbacks = dictCallback[action.data['action']];
        if (dictKey[action.key] == 1) {
          arrCallbacks.forEach(dict => {
            console.log('checkTimeout dict[key] = ', dict['key']);
            if (_.isEqual(dict['key'],action.key)) {
              const callback = dict['callback'];
              callback({status:STATUS_CODE.OFFLINE,data: { message: 'Device is offline !!!' }});
              dictKey[action.key] = 0;
              console.log(TAG,'timeout' + action.key + '--> ' + action.data['action']);
            }
          });
        }
      }
    }
  }

  async startListenData(channel) {
    
    console.log(TAG,'startListenData Current Channel:', currentChannel);
    console.log(TAG,'startListenData Channel: ', channel);

    //Update current subcribed channel
    if (currentChannel !== channel) {
      let path = `/${firebase.auth().currentUser.uid}/` + channel;
      console.log('Update Path: ', path);
      currentChannel = channel;
      firebase
        .database()
        .ref(path)
        .remove();

      // Listen for new messages in the Firebase database
      firebase
        .database()
        .ref(path)
        .on('child_added', snapshot => {
          if (snapshot.exists()) {
            let dict = snapshot.val();
            // console.log('Snapshot: ', dict);
            const { data = {} } = dict;
            console.log(TAG,'startListenData Data: ', data);
            if (!_.isEmpty(data)) {
              const { action } = data;
              console.log(TAG,'startListenData Action: ', action);
              if (action) {
                let arr = dictCallback[action];
                // console.log('Arr: ', arr);
                if (arr) {
                  arr.forEach(dict => {
                    const { key } = dict;
                    if (dictKey[key] == 1) {
                      if (action !== 'update_firmware_status') {
                        dictKey[key] = 0;
                      }

                      let callback = dict.callback;
                      console.log(TAG,'startListenData Return callback');
                      callback({status:STATUS_CODE.SERVER, ...data});
                    }
                  });
                  if (action !== 'update_firmware_status') {
                    dictCallback[action] = null;
                  }
                }
                const childPath =
                  `/${firebase.auth().currentUser.uid}/` +
                  channel +
                  '/' +
                  snapshot.key;
                // console.log('Child Path: ', childPath);
                firebase
                  .database()
                  .ref(childPath)
                  .remove();
              }
            }
          }
        });
    }
  }

  stopListenData = ()=>{
    console.log('stopListenData begin');
    let funcExcute = new Promise((resolve,reject)=>{
      if (!_.isNull(firebase.auth().currentUser)) {
        let path = `/${this.getUID()}/` + currentChannel;
        console.log(TAG,'stopListenData Path: ', path);
        firebase
          .database()
          .ref(path)
          .off('child_added', (dataSnapshot) => {
            console.log(TAG,'stopListenData off ----');
            this.currentUserName = '';
            currentChannel = '';
            resolve(true);
          });
      }else{
        resolve(true);
      }
    });
    return Util.excuteWithTimeout(funcExcute,3);
    
  }
  logout = async ()=>{
    console.log(TAG,'logout begin');
    if (firebase.auth().currentUser !== null) {
      //stopListenData
      let result = await this.stopListenData().catch(console.log);
      console.log(TAG,'logout stop result= ',result);
      try {
        await firebase.auth().signOut();
      } catch (error) {
        return false;
      }
    } 
    return true;
  }
  addActionCallback(action, onCallback) {
    console.log('Action: ', action);
    const { data } = action;
    const dataAction = data.action;
    console.log('Data Action: ', dataAction);

    if (dataAction) {
      var arrCallbacks = [];
      console.log('dictCallback ', dictCallback);

      if (dictCallback[dataAction]) {
        arrCallbacks = dictCallback[dataAction];
      }

      let dict = { key: action.key, callback: onCallback };
      console.log('action.key  ', action.key);
      arrCallbacks.push(dict);
      console.log('Arr callback: ', arrCallbacks);
      dictCallback[dataAction] = arrCallbacks;
      dictKey[action.key] = 1;
    }
  }

  isAuth(username, password, onCallback) {
    console.log('isAuth');
    this.auth(
      username,
      password,
      () => {
        if (onCallback) {
          onCallback(true);
        }
      },
      () => {
        if (onCallback) {
          onCallback(false);
        }
      }
    );
  }
  sendAction(username, password, action, onCallback, timeout) {
    console.log(TAG,`Username: ${username}-password=${password}-action=${action}`);
    
    this.isAuth(username, password, value => {
      if (value) {
        this.send(action, onCallback, timeout);
      } else {
        console.log('You input invalid data');
      }
    });
  }
  // async listen(action, onCallback, timeout) {
  //   await this.startListenData(action.source);
  //   if (onCallback !== null) {
  //     this.addActionCallback(action, onCallback);
  //     setTimeout(() => {
  //       this.checkTimeout(action, onCallback);
  //     }, timeout * 1000);
  //   }
  // }
  // listenAction(username, password, action, onCallback, timeout) {
  //   console.log('Username: ', username);
  //   console.log('Password: ', password);
  //   console.log('Action: ', action);

  //   this.isAuth(username, password, value => {
  //     if (value) {
  //       this.listen(action, onCallback, timeout);
  //     } else {
  //       console.log('You input invalid data');
  //     }
  //   });
  // }
  async send(action, onCallback, timeout) {
    await this.startListenData(action.source);
    if (onCallback) {
      this.addActionCallback(action, onCallback);
    }

    const json = {
      type: action.type,
      source: this.brainSource(action.source),
      data: action.data,
      protocal: action.myProtocal
      //time: (new Date().getTime()) * 1000
    };
    console.log(TAG, 'send JSON: ', json);
    const uid = this.getUID();
    let path = `/${uid}/` + action.dest;
    console.log(TAG,'send Path: ', path);
    if(!_.isEmpty(uid)){
      firebase
        .database()
        .ref(path)
        .push(json, error => {
          if (!error) {
            if (onCallback) {
              setTimeout(() => {
                this.checkTimeout(action, onCallback);
              }, timeout * 1000);
            }
          } else {
            console.log(TAG,'send Error:', error);
            return new Error(error);
          }
        });
    }
  }
  getUID =()=>{
    return firebase.auth()?.currentUser?.uid||'';
  }
  brainSource=(source)=>{
    return this.getUID() + '/' + source;
  }
}
