/**
 * @providesModule Action
 */
var type = '';
var source = '';
var data = {};
var myProtocal = '';
var dest = '';
var key = '';
export default class Action {
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
}
