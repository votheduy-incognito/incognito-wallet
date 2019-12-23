export const TAG = 'BaseConnection';
export class ObjConnection {
  constructor() {
    this.id = -1;
    this.name = '';
    this.password = '';
  }
}
class BaseConnection {
  constructor() {
    this.currentConnect = null;
  }
  fetchCurrentConnect=()=>{
    return this.currentConnect;
  }

  init = () => {};

  connectDevice = async (device: ObjConnection) => {};
  removeConnection = async (device: ObjConnection) => {};

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
