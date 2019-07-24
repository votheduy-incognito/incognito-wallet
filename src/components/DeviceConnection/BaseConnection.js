export const TAG = 'BaseConnection';
export class ObjConnection {
  constructor() {
    this.id = -1;
    this.name = '';
  }
}
class BaseConnection {
  constructor() {
    this.currentConnect = null;
  }
  // get currentConnect():ObjConnection{
  //   return this.currentConnect;
  // }

  // set currentConnect(obj:ObjConnection){
  //   this.currentConnect = obj;
  // }
  init = () => {};

  connectDevice = async (device: ObjConnection) => {};

  destroy = () => {};
  // getCurrentConnect = (): ObjConnection => {};
  disconnectDevice = () => {};

  checkRegular = async () => {
    return false;
  };

  scan = async (): Promise<ObjConnection[]> => {};

  stopScan = () => {};
}
export default BaseConnection;
