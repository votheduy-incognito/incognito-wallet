/**
 * @providesModule FirebaseService
 */
import Util from '@src/utils/Util';
import _ from 'lodash';
import firebaseRN from 'react-native-firebase';
// import timer from 'react-native-timer';
const timer = require('react-native-timer');

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
  // auth = async(username, password, success, fail)=> {
  //   console.log(TAG,' auth begin');
  //   console.log(TAG,' auth begin 01 currentUserName = ',this.currentUserName);
    
  //   if (this.firebase.auth().currentUser !== null && this.currentUserName == username) {
      
  //     console.log(TAG,' auth begin02 has authenticated = ',this.firebase.auth().currentUser.uid);
  //     success(this.firebase.auth().currentUser?.uid||'');
  //   } else {
  //     if (this.firebase.auth().currentUser !== null) {
  //       console.log(TAG,'auth begin03 logout');
  //       //Logout
  //       await this.logout();
  //       this.createFirebaseAccount(username, password, success, fail);
  //     } else {
  //       console.log(TAG,'auth begin04 Create firebase account');
  //       this.createFirebaseAccount(username, password, success, fail);
  //     }
  //   }
  // }
  /**
   * @returns [string] : uid
   */
  // signIn = async(username, password) => {
    
  //   return new Promise((resolve,reject)=>{
  //     console.log(TAG,' signIn begin');
  //     let prevUser = this.firebase.auth().currentUser;
  //     const email = this.firebase.auth().currentUser?.email ||'';
  //     if (!_.isEmpty(email) && _.isEqual(email,username)) {
  //       this.currentUserName  = username;
  //       console.log(TAG,' signIn begin02 has authenticated = ',this.currentUserName);
  //       resolve(this.firebase.auth().currentUser?.uid||'');
  //       /// test
  //       // reject('fail firebase');
  //       ////
  //     } else {
  //       this.createFirebaseAccount(username, password).then(user=>{
          
  //         console.log(TAG,' signIn begin03 has authenticated = ',user?.email);
  //         await prevUser.linkWithCredential(credential);
  //         this.currentUserName  = username;
  //         resolve(user?.uid??null);
  //       }).catch(e=>{
  //         reject(e);
  //       });
  //     }
  //   });
    
  // }

  signIn = async(username, password) => {
    
    
    console.log(TAG,' signIn begin');
    let prevUser = this.firebase.auth().currentUser;
    const email = this.firebase.auth().currentUser?.email ||'';
    if (!_.isEmpty(email) && _.isEqual(email,username)) {
      this.currentUserName  = username;
      console.log(TAG,' signIn begin02 has authenticated = ',this.currentUserName);
      return this.firebase.auth().currentUser?.uid||'';
      /// test
      // reject('fail firebase');
      ////
    } else {
      const user = await this.createFirebaseAccount(username, password).catch(e=>{
        console.log(TAG,' signIn begin04 error = ',e);
        throw e;
      });
      console.log(TAG,' signIn begin03 has authenticated = ',user?.email);
      
      this.currentUserName  = username;
      
      return user?.uid??null;
    }
    
    
  }
  signInWithCredential=async (username, password)=>{
    try {
      let prevUser = this.firebase.auth().currentUser;
      
      const credential = firebaseRN.auth.EmailAuthProvider.credential(username, password);
      await prevUser.unlink(credential);
      // Sign in user with another account
      const userCredential = await this.firebase.auth().signInWithCredential(credential).catch((error) =>{
        console.log('signInWithCredential 0000 Error', error);
      });
      
      const user = userCredential?.user;
      

      console.log(TAG,'signInWithCredential begin success = ',user?.email);
      // await user.delete();
      // await prevUser.linkWithCredential(credential);
      // await this.firebase.auth().signInWithCredential(credential);
      return userCredential;
    } catch (error) {
      console.log('signInWithCredential Error', error);
      throw new Error(error.message);
    }
  }
  createFirebaseAccount = (username, password)=>{
    
    // console.log('Username: ', username);
    // console.log('Password: ', password);
    return new Promise((resolve,reject)=>{
      console.log(TAG,'createFirebaseAccount begin');
      // const credential = firebaseRN.auth.EmailAuthProvider.credential(username, password);
      console.log(TAG,'createFirebaseAccount begin 01');
      // this.signInWithCredential(username, password).then(authResult => {
      //   const user = authResult?.user;

      //   // If you need to do anything with the user, do it here
      //   // The user will be logged in automatically by the
      //   // `onAuthStateChanged` listener we set up in App.js earlier
      //   console.log(TAG,'createFirebaseAccount begin success ', username);
      //   this.currentUserName = username;
      //   resolve(user);
      // }, (error) =>{
      //   console.log(TAG,'createFirebaseAccount begin error ', username);
      //   this.firebase
      //     .auth()
      //     .createUserWithEmailAndPassword(username, password)
      //     .then(user => {
      //       resolve(user);
      //     })
      //     .catch(err => {
      //       const { code, message } = err;
      //       // For details of error codes, see the docs
      //       // The message contains the default Firebase string
      //       // representation of the error
      //       console.log('Create account error: ', err);
      //       reject(err);
      //     });
      // });
      // });
      
      this.firebase
        .auth()
        .signInWithEmailAndPassword(username, password)
        .then(authResult => {
          const user = authResult.user;

          // If you need to do anything with the user, do it here
          // The user will be logged in automatically by the
          // `onAuthStateChanged` listener we set up in App.js earlier
          console.log(TAG,'createFirebaseAccount begin success ', username);
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
      // const randomString = Util.createRandomString(16)||'FB-Node';
      this.firebase = firebaseRN.app();
      
      console.log(TAG,'configurateDatabase');
      // const currentUser = this.firebase.auth().currentUser;
      // if(!_.isNil(currentUser)){
      //   console.log(TAG,'configurateDatabase01 reload currentUser');
      //   await currentUser.reload();
      // }
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
              timer.clearTimeout(action.key);
              console.log(TAG,'checkTimeout timeout = ' + action.key + '--> ' + action.data['action']);
            }
          });
        }
      }
    }
  }

  startListenData = async (channel)=>{
    
    console.log(TAG,'startListenData Current Channel:', currentChannel);
    // console.log(TAG,'startListenData Channel: ', channel);

    //Update current subcribed channel
    if (channel) {
      const fuid = this.firebase.auth().currentUser?.uid??'';
      let path = `/${fuid}/${channel}`;
      console.log('startListenData Update Path: ', path);
      currentChannel = channel;
      // await this.firebase.database().ref(path).remove();
      const snapshot =  await this.firebase.database().ref(path).once('child_added');
      
      // console.log(TAG,'startListenData begin------- ',snapshot);
      if (snapshot.exists()) {
        let dict = snapshot.val();
        console.log('startListenData begin-------0000---- data : ', dict);
        const { data = {} } = dict;
        const snapshotKey = snapshot.key??'';
        console.log(TAG,'startListenData snapshotKey: ', snapshotKey);
        if (!_.isEmpty(data)) {
          const { action } = data;
          console.log(TAG,'startListenData Action: ', action);
          if (action) {
            console.log(TAG,'startListenData Action01 ');
            let arr = this.dictCallback[action];
            console.log(TAG,'startListenData Action02 ');
            if (arr) {
              console.log(TAG, 'startListenData Arr: ', arr);
              arr.forEach(dict => {
                const { key ,callback } = dict;
                if (this.dictKey[key] == 1) {
                  if (action !== 'update_firmware_status') {
                    this.dictKey[key] = 0;
                  }
                  console.log(TAG,'startListenData Return callback = ',key);
                  callback({status:STATUS_CODE.SERVER, ...data});
                  timer.clearTimeout(key);
                }
              });
              if (action !== 'update_firmware_status') {
                this.dictCallback[action] = null;
              }
            }
            
            const childPath = `/${fuid}/${channel}/${snapshotKey}`;
            console.log(TAG,'startListenData Action03 Child Path: ', childPath);
            !_.isEmpty(fuid)&& !_.isEmpty(snapshotKey) &&await this.firebase.database().ref(childPath).remove().catch(console.log);
          }
        }
        return true;
      }
      return false;
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
    console.log('addActionCallback Action: ', action);
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
    console.log('isAuth begin username =',username );
    const uid = await this.signIn(username,password).catch(console.log)||undefined;
    console.log('isAuth end uid =',uid );
    return uid;
  }

  sendAction = async (username, password, action, onCallback, timeout)=> {
    console.log(TAG,`Username: ${username}-password=${password}-action=${action}`);
    const fbuid = await this.isAuth(username, password);
    const getFBUID = this.getUID();
    console.log('sendAction isEqual =',_.isEqual(fbuid,getFBUID));
    if (fbuid) {
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
  push = (path,jsondata):Promise<Boolean>=>{
    return Util.excuteWithTimeout(new Promise((resolve,reject)=>{
      this.firebase
        .database()
        .ref(path)
        .push(jsondata,error=>{
          console.log(TAG,'push error: ', error);
          resolve(_.isNil(error));
        });
    }),5);
  }
  send = async(action, onCallback, timeout)=>{
    // await this.startListenData(action.source);
    if (onCallback) {
      this.addActionCallback(action, onCallback);
    }
    const actionSource = action.source??'';
    const json = {
      type: action.type,
      source: this.brainSource(actionSource),
      data: action.data,
      protocal: action.myProtocal
      //time: (new Date().getTime()) * 1000
    };
    console.log(TAG, 'send JSON: ', json);
    const uid = this.getUID();
    let path = `/${uid}/` + action.dest;
    console.log(TAG,'send Path: ', path);
    if(!_.isEmpty(uid)){
      // let chanel = `/${uid}/` + action.source;
      // await this.firebase.database().ref(chanel).remove().catch(console.log);
      const resultPush = await this.push(path,json).catch(console.log)??false;
      if(resultPush){
        const fetchData = ()=>{
          return Util.excuteWithTimeout(this.startListenData(actionSource),5);
        };
        await Util.tryAtMost(fetchData,3,3).catch(e=>{
          console.log(TAG, 'send tryAtMost-fetchData= ',e);
          this.checkTimeout(action, onCallback);
        });
      }else{
        this.checkTimeout(action, onCallback);
      }
      // this.firebase
      //   .database()
      //   .ref(path)
      //   .push(json, error => {
      //     if (_.isNil(error)) {
      //       if (onCallback) {
      //         timer.setTimeout(action.key??'',() => {
      //           console.log(TAG, 'send setTimeout ', action.key);
      //           this.checkTimeout(action, onCallback);
      //         }, timeout * 1000);
      //       }
      //     } else {
      //       console.log(TAG,'send Error:', error);
      //       return new Error(error);
      //     }
      //   });
    }
  }
  getUID =()=>{
    return this.firebase.auth()?.currentUser?.uid||'';
  }
  brainSource=(source)=>{
    return this.getUID() + '/' + source;
  }
}