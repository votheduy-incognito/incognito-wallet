const template = {

};
export default class Device {
  constructor(data:template){
    this.data = {...template, ...data};
  }
  toJSON(){
    return this.data;
  }
  static getInstance = (data:template):Device =>{
    return new Device(data);
  }
}