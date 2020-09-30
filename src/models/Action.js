/**
 * @providesModule Action
 */
const TYPE = {
  PRODUCT_CONTROL:'product_control',
  INCOGNITO:'incognito'
};
export default class Action {
  static TYPE = TYPE;
  constructor(type, source, data, myProtocal, dest) {
    this.type = type;
    this.source = source;
    this.myProtocal = myProtocal;
    this.data = data;
    this.dest = dest;
    this.key = `${data.action} + ${new Date().getTime() * 1000}`;
    const { timestamp } = data;
    console.log('TimeStamp: ', timestamp);
    if (!timestamp) {
      //this.data["timestamp"] = (new Date().getTime())*1000
      this.data = { ...data, timestamp: new Date().getTime() * 1000 };
    }
    console.log('Data: ', this.data);
  }

  buildAction = (source)=>{
    return {
      type: this.type,
      source: source || this.source,
      data: this.data,
      protocal: this.myProtocal
    };
  }
}
