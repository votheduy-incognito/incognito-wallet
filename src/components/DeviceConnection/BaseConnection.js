export const TAG = 'BaseConnection';
class ObjConnection{
  constructor() {
    this.id = -1;
    this.name = '';
  }
};
class BaseConnection{

  constructor() {
  }
  init = ()=>{}
  
  connectDevice = (device:ObjConnection) => {
  };

  destroy = ()=>{   
  }

  disconnectDevice = () => {};

  checkRegular =  async ():Boolean => {
    return false;
  };

  scan = async ():Promise<ObjConnection[]>=> {
  };

  stopScan = () => {
  };
}
export default BaseConnection;
