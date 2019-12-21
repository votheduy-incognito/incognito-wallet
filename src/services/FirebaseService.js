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
      this.currentUser  = this.firebase.auth().currentUser;
      console.log(TAG,' signIn begin02 has authenticated = ',this.currentUserName);
      return this.currentUser?.uid||'';
      /// test
      // reject('fail firebase');
      ////
    } else {
      const user = await this.createFirebaseAccount(username, password).catch(e=>{
        console.log(TAG,' signIn begin04 error = ',e);
        throw e;
      });
      this.currentUser  = user;
      console.log(TAG,' signIn begin03 has authenticated = ',user?.email);
      
      this.currentUserName  = username;
      
      return user?.uid??null;
    }
    
    
  }
  signInWithCredential=async (username, password)=>{
    try {
      let prevUser = this.firebase.auth().currentUser;
      
      const credential = firebaseRN.auth.EmailAuthProvider.credential(username, password);
      // await prevUser.unlink(credential);
      // Sign in user with another account
      const userCredential = await this.firebase.auth().signInWithCredential(credential).catch((error) =>{
        console.log('signInWithCredential 0000 Error', error);
      });
      
      const user = userCredential?.user;
      

      console.log(TAG,'signInWithCredential begin success = ',user?.email);
      // await user.delete();
      await prevUser.linkWithCredential(credential).catch(console.log);
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
      //   this.signInWithCredential(username, password).then(authResult => {
      //     const user = authResult?.user;

      //     // If you need to do anything with the user, do it here
      //     // The user will be logged in automatically by the
      //     // `onAuthStateChanged` listener we set up in App.js earlier
      //     console.log(TAG,'createFirebaseAccount begin success ', username);
      //     this.currentUserName = username;
      //     resolve(user);
      //   }, (error) =>{
      //     console.log(TAG,'createFirebaseAccount begin error ', username);
      //     this.firebase
      //       .auth()
      //       .createUserWithEmailAndPassword(username, password)
      //       .then(user => {
      //         this.currentUser  = user; 
      //         resolve(user);
      //       })
      //       .catch(err => {
      //         const { code, message } = err;
      //         // For details of error codes, see the docs
      //         // The message contains the default Firebase string
      //         // representation of the error
      //         console.log('Create account error: ', err);
      //         reject(err);
      //       });
      //   });
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
          this.currentUser  = user; 
          resolve(user);
        })
        .catch(error => {
          console.log('Signin failed: ', error);

          this.firebase
            .auth()
            .createUserWithEmailAndPassword(username, password)
            .then(user => {
              this.currentUser  = user; 
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
      this.currentUser  = this.firebase.auth().currentUser;
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
    let result = false;
    try {
      await this.isAuth(this.username,this.password);
      const fuid = this.getUID();
      let path = `/${fuid}/${channel}`;
      //Update current subcribed channel
      if (channel) {
        console.log('startListenData Update Path: ', path);
        currentChannel = channel;
      
      
        const snapshot =  await this.firebase.database().ref(path).once('child_added');
      
        console.log(TAG,'startListenData begin------- ');
        if (snapshot.exists()) {
        // snapshot.forEach(hihi=>{
        //   console.log(TAG,'startListenData begin kakakaa------- ',hihi);
        // });
          const dictValue = snapshot.exists()? snapshot.val():null;
          console.log('startListenData begin-------0000---- data : ', dictValue);
          const timeNanoNow = _.now()* 1000000;
          const { data = {},time = timeNanoNow } = dictValue;
          const snapshotKey = snapshot.key??'';
          let isNeedClear  = (timeNanoNow - time) >(3*60*1000*1000000);
          console.log(TAG,'startListenData snapshotKey: ', snapshotKey);
          if (!_.isEmpty(data)) {
            const { action } = data;
          
            console.log(TAG,'startListenData Action: ', action,'--- _.now() - timestamp = ',timeNanoNow - time);
            if (action) {
              console.log(TAG,'startListenData Action01 ');
              let arr = this.dictCallback[action];
              console.log(TAG,'startListenData Action02 ');
              if (arr) {
                console.log(TAG, 'startListenData Arr: ', arr);
                arr.forEach(dict => {
                  const { key ,callback } = dict;
                  if (this.dictKey[key] == 1) {
                    result = true;
                    if (action !== 'update_firmware_status') {
                      this.dictKey[key] = 0;
                    }
                    console.log(TAG,'startListenData Return callback = ',key);
                    callback && callback({status:STATUS_CODE.SERVER, ...data});
                    timer.clearTimeout(key);
                  }
                });
                if (action !== 'update_firmware_status') {
                  this.dictCallback[action] = null;
                }
              }
            
              const childPath = `/${fuid}/${channel}/${snapshotKey}`;
              console.log(TAG,'startListenData Action03 Child Path: ', childPath,'-isNeedClear = ',isNeedClear);
              result  && !_.isEmpty(fuid)&& !_.isEmpty(snapshotKey) && await this.firebase.database().ref(childPath).remove();
              console.log(TAG,'startListenData Action04 End--------');
            }
          
          }
        
        }
      }
      !result && await this.firebase.database().ref(path).remove();
    } catch (error) {
      console.log(TAG,'startListenData error ');
    }
    console.log(TAG,'startListenData Action05 End--------result = ',result);
    
    return result;
  }

  stopListenData = ()=>{
    console.log('stopListenData begin');
    let funcExcute = new Promise((resolve,reject)=>{
      if (!_.isNull(this.currentUser)) {
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
    if (this.currentUser !== null) {
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
    let fuid = this.getUID();
    const email = this.firebase.auth().currentUser?.email ||'';
    if(!_.isEqual(email ,username)){
      fuid = await this.signIn(username,password).catch(console.log)||undefined;
    }
    // fuid = await this.signIn(username,password).catch(console.log)||undefined;
    
    console.log('isAuth end uid =',fuid );
    return fuid;
  }

  sendAction = async (username, password, action, onCallback, timeout)=> {
    console.log(TAG,`sendAction Username: ${username}-password=${password}`);
    this.username = username;
    this.password = password;
    // await this.send(action, onCallback, timeout);

    const fbuid = await this.isAuth(username, password);
    const getFBUID = this.getUID();
    // console.log('sendAction isEqual =',_.isEqual(fbuid,getFBUID));
    if (_.isEqual(fbuid,getFBUID)) {
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
  push = async (path,jsondata)=>{
    // await this.isAuth(this.username,this.password);
    const temp = Util.excuteWithTimeout(new Promise((resolve,reject)=>{
      this.firebase
        .database()
        .ref(path)
        .push(jsondata,error=>{
          console.log(TAG,'push error: ', error);
          resolve(_.isNil(error));
        });
    }),5);
    return await temp.catch(console.log)||false;
  }
  send = async(action, onCallback, timeout)=>{
    
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
    await this.isAuth(this.username,this.password);
    const uid = this.getUID();
    let path = `/${uid}/` + action.dest;
    console.log(TAG,'send Path: ', path);
    if(!_.isEmpty(uid)){
      // let chanel = `/${uid}/` + action.source;
      // await this.firebase.database().ref(chanel).remove().catch(console.log);
      const pushData = async ()=>{
        console.log(TAG, 'send pushData begin ------');
        await this.isAuth(this.username,this.password);
        const temp  = await this.push(path,json).catch(console.log)??false;
        // return temp?temp:new Error('pushData  fail');
        return temp;
      };
      // const fetchData = async ()=>{
      //   console.log(TAG, 'send fetchData begin ------');
      //   let receiveData = false;
      //   try {
      //     receiveData =  await Util.excuteWithTimeout(this.startListenData(actionSource),8);
      //     console.log(TAG, 'send fetchData receiveData ------',receiveData);
      //   } catch (error) {
      //     console.log(TAG, 'send tryAtMost-fetchData error ',error);
      //   }
      //   const resultPush = receiveData?true: await Util.tryAtMost(pushData,3,3).catch(e=>{
      //     console.log(TAG, 'send tryAtMost-pushData HienTON= ',e);
      //   });
        
      //   return receiveData?receiveData:new Error('fetchData fail');
      // };

      const fetchData = async ()=>{
        console.log(TAG, 'send fetchData begin ------');
        let receiveData = false;
        try {
          receiveData =  await Util.excuteWithTimeout(this.startListenData(actionSource),8);
          console.log(TAG, 'send fetchData receiveData ------',receiveData);
        } catch (error) {
          console.log(TAG, 'send tryAtMost-fetchData error ',error);
        }
        
        // return receiveData?receiveData:new Error('fetchData fail');
        return receiveData;
      };

      const codeData  = async ()=>{
        console.log(TAG, 'send codeData begin ------');
        let receiveData = false;
        try {
          let [isPush,isFetch] = await Promise.all([pushData(),fetchData()]);
          // receiveData =  await Util.excuteWithTimeout(this.startListenData(actionSource),8);
          console.log(TAG, 'send codeData receiveData ------',isPush,'-isFetch = ',isFetch);
          receiveData = isPush && isFetch;
        } catch (error) {
          console.log(TAG, 'send tryAtMost-codeData error ',error);
        }
        
        return receiveData?receiveData:new Error('codeData fail');
      };

      const resultReceive = await Util.tryAtMost(codeData,4,3).catch(e=>{
        console.log(TAG, 'send tryAtMost-fetchData= ',e);
        this.checkTimeout(action, onCallback);
      });
      
      // const resultPush = await Util.tryAtMost(pushData,3,5).catch(e=>{
      //   console.log(TAG, 'send tryAtMost-pushData HienTON= ',e);
      //   this.checkTimeout(action, onCallback);
      // });
      
      if(resultReceive){
        // const fetchData = async ()=>{
        //   const temp = await Util.excuteWithTimeout(this.startListenData(actionSource),5);
        //   return temp?temp:new Error('fetchData fail');
        // };
        // await Util.tryAtMost(fetchData,3,3).catch(e=>{
        //   console.log(TAG, 'send tryAtMost-fetchData= ',e);
        //   this.checkTimeout(action, onCallback);
        // });
      }else{
        this.checkTimeout(action, onCallback);
      }
    }
  }
  getUID =()=>{
    return this.currentUser?.uid||'';
  }
  brainSource=(source)=>{
    return this.getUID() + '/' + source;
  }
}