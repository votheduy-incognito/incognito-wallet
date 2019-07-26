const template = {
  status:{
    code: -1,
    message:'Waiting'
  }
};
export default class Device {
  static CODE_UNKNOWN = -1;
  static CODE_STOP = 4;
  static CODE_START = 2;
  static CODE_MINING = 3;
  static CODE_SYNCING = 1;
  static CODE_OFFLINE = -2;

  //  SYNCING = 1
  // READY   = 2
  // MINING  = 3
  // STOP    = 4
  constructor(data:template){
    this.data = {...template, ...data};
  }
  isStartedChain=()=>{
    return this.data.status.code !== Device.CODE_STOP;
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