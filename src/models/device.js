const template = {
  status:{
    code: -1,
    message:'Waiting'
  }
};
export default class Device {
  static CODE_UNKNOWN = -1;
  static CODE_STOP = 0;
  static CODE_START = 1;
  static CODE_MINING = 2;
  static CODE_SYNCING = 3;
  static CODE_OFFLINE = -2;
  constructor(data:template){
    this.data = {...template, ...data};
  }
  isStartedChain=()=>{
    return this.data.status.code === Device.CODE_START;
  }
  static offlineStatus =()=>{
    return {
      code:Device.CODE_UNKNOWN,
      message:'Offline'
    };
  }
  
  toJSON(){
    return this.data;
  }
  statusMessage =()=>{
    return this.data.status?.message||'';
  }
  static getInstance = (data=template):Device =>{
    return new Device(data);
  }
}