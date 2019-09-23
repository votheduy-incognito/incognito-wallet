/**
 * @providesModule FirebaseService
 */
import Util from '@src/utils/Util';
import _ from 'lodash';
import firebaseRN from 'react-native-firebase';
import timer from 'react-native-timer';

export const MAIL_UID_FORMAT = '@autonomous.ai';
export const PHONE_CHANNEL_FORMAT = '_PHONE';
export const DEVICE_CHANNEL_FORMAT = '';
export const FIREBASE_PASS = 'at9XafdcJ7TVHzGa';
const STATUS_CODE = {
  OFFLINE :-1,
  SERVER:1,
};
// let ref = null;
// let uid = null;
// let myManager = null;

let currentChannel;
// let dictCallback = {};
let obj = {
  key1: 'value1',
  key2: 'value2'
};
// let dictKey = {};
const TAG = 'FirebaseService';
export default class FirebaseService {
  static myManager;
  constructor(){
    this.currentUserName = '';
    this.dictCallback = {};
    this.dictKey ={};
    this.configurateDatabase();
  }
  static getShareManager() {
    if (FirebaseService.myManager == null) {
      console.log('Create new instance');
      FirebaseService.myManager = new FirebaseService();
    }

    return FirebaseService.myManager;
  }
  auth = async(username, password, success, fail)=> {
    console.log(TAG,' auth begin');
    console.log(TAG,' auth begin 01 currentUserName = ',this.currentUserName);
    
    if (this.firebase.auth().currentUser !== null && this.currentUserName == username) {
      
      console.log(TAG,' auth begin02 has authenticated = ',this.firebase.auth().currentUser.uid);
      success(this.firebase.auth().currentUser?.uid||'');
    } else {
      if (this.firebase.auth().currentUser !== null) {
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
  signIn = async(username, password):Promise<String>=> {
    
    return new Promise((resolve,reject)=>{
      console.log(TAG,' signIn begin');
      const email = this.firebase.auth().currentUser?.email ||'';
      if (!_.isEmpty(email) && _.isEqual(email,username)) {
        this.currentUserName  = username;
        console.log(TAG,' signIn begin02 has authenticated = ',this.currentUserName);
        resolve(this.firebase.auth().currentUser?.uid||'');
      } else {
        this.createFirebaseAccount(username, password).then(user=>{
          
          console.log(TAG,' signIn begin03 has authenticated = ',user);
          this.currentUserName  = username;
          resolve(user?.uid??null);
        }).catch(e=>{
          reject(e);
        });
      }
    });
    
  }
  createFirebaseAccount = (username, password)=>{
    // console.log(TAG,'Create firebase account');
    // console.log('Username: ', username);
    // console.log('Password: ', password);
    return new Promise((resolve,reject)=>{
      this.firebase
        .auth()
        .signInWithEmailAndPassword(username, password)
        .then(authResult => {
          const user = authResult.user;

          // If you need to do anything with the user, do it here
          // The user will be logged in automatically by the
          // `onAuthStateChanged` listener we set up in App.js earlier
          // console.log(TAG,'createFirebaseAccount begin ', user);
          this.currentUserName = username;
          resolve(user);
        })
        .catch(error => {
          console.log('Signin failed: ', error);

          this.firebase
            .auth()
            .createUserWithEmailAndPassword(username, password)
            .then(user => {
              resolve(user);
            })
            .catch(err => {
              const { code, message } = err;
              // For details of error codes, see the docs
              // The message contains the default Firebase string
              // representation of the error
              console.log('Create account error: ', err);
              reject(err);
            });
        });
    });
    
  }
  configurateDatabase= async () =>{
    try {
      this.firebase = firebaseRN.app();
      console.log(TAG,'configurateDatabase');
      // const ref = this.firebase.database().ref();
      // console.log(TAG,'configurateDatabase01 ref = ',ref);
      if(!_.isNil(this.firebase.auth().currentUser)){
        await this.firebase.auth().currentUser.reload();
      }
    } catch (error) {
      console.log(TAG,'configurateDatabase error = ',error);
    }
    
  }
  checkTimeout = (action)=>{
    console.log(TAG,'checkTimeout begin action = ',action);
    if (action.data['action']) {
      if (this.dictCallback[action.data['action']]) {
        let arrCallbacks = this.dictCallback[action.data['action']];
        if (this.dictKey[action.key] == 1) {
          arrCallbacks.forEach(dict => {
            console.log('checkTimeout dict[key] = ', dict['key']);
            if (_.isEqual(dict['key'],action.key)) {
              const callback = dict['callback'];
              callback({status:STATUS_CODE.OFFLINE,data: { message: 'Device is offline !!!' }});
              this.dictKey[action.key] = 0;
              timer.clearTimeout(this,action.key);
              console.log(TAG,'checkTimeout timeout' + action.key + '--> ' + action.data['action']);
            }
          });
        }
      }
    }
  }

  async startListenData(channel) {
    
    console.log(TAG,'startListenData Current Channel:', currentChannel);
    // console.log(TAG,'startListenData Channel: ', channel);

    //Update current subcribed channel
    if (channel) {
      let path = `/${this.firebase.auth().currentUser.uid}/` + channel;
      console.log('Update Path: ', path);
      currentChannel = channel;
      this.firebase
        .database()
        .ref(path)
        .remove();

      // Listen for new messages in the Firebase database
      this.firebase
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
                let arr = this.dictCallback[action];
                
                if (arr) {
                  console.log(TAG, 'startListenData Arr: ', arr);
                  arr.forEach(dict => {
                    const { key ,callback } = dict;
                    if (this.dictKey[key] == 1) {
                      if (action !== 'update_firmware_status') {
                        this.dictKey[key] = 0;
                      }
                      console.log(TAG,'startListenData Return callback');
                      callback({status:STATUS_CODE.SERVER, ...data});
                      timer.clearTimeout(this,key);
                    }
                  });
                  if (action !== 'update_firmware_status') {
                    this.dictCallback[action] = null;
                  }
                }
                const childPath =
                  `/${this.firebase.auth().currentUser.uid}/` +
                  channel +
                  '/' +
                  snapshot.key;
                // console.log('Child Path: ', childPath);
                this.firebase
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
      if (!_.isNull(this.firebase.auth().currentUser)) {
        let path = `/${this.getUID()}/` + currentChannel;
        console.log(TAG,'stopListenData Path: ', path);
        this.firebase
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
    if (this.firebase.auth().currentUser !== null) {
      //stopListenData
      let result = await this.stopListenData().catch(console.log);
      console.log(TAG,'logout stop result= ',result);
      try {
        await this.firebase.auth().signOut();
      } catch (error) {
        return false;
      }
    } 
    return true;
  }
  addActionCallback = (action, onCallback)=>{
    console.log('Action: ', action);
    const { data } = action;
    const dataAction = data.action;
    console.log('Data Action: ', dataAction);

    if (dataAction) {
      let arrCallbacks = [];
      console.log(TAG,'addActionCallback dictCallback ', this.dictCallback);

      if (this.dictCallback[dataAction]) {
        arrCallbacks = this.dictCallback[dataAction];
      }

      let dict = { key: action.key, callback: onCallback };
      console.log(TAG,'addActionCallback action.key  ', action.key);
      arrCallbacks.push(dict);
      console.log(TAG,'addActionCallback Arr callback: ', arrCallbacks);
      this.dictCallback[dataAction] = arrCallbacks;
      this.dictKey[action.key] = 1;
    }
  }

  isAuth = async (username, password)=> {
    console.log('isAuth');
    const uid = await this.signIn(username,password).catch(console.log)||undefined;
    return uid;
  }

  sendAction = async (username, password, action, onCallback, timeout)=> {
    console.log(TAG,`Username: ${username}-password=${password}-action=${action}`);
    const result = await this.isAuth(username, password);
    if (result) {
      await this.send(action, onCallback, timeout);
    } else {
      console.log('You input invalid data');
    }
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
  send = async(action, onCallback, timeout)=>{
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
      this.firebase
        .database()
        .ref(path)
        .push(json, error => {
          if (_.isNil(error)) {
            if (onCallback) {
              timer.setTimeout(this,action.key??'',() => {
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
    return this.firebase.auth()?.currentUser?.uid||'';
  }
  brainSource=(source)=>{
    return this.getUID() + '/' + source;
  }
}
