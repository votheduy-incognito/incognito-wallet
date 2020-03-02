import Util from '@src/utils/Util';
import { SSH_PASS, SSH_USER } from 'react-native-dotenv';
import SSH from 'react-native-ssh';

export default class SSHService {
  static run =  async (ipAddress,cmdString ='',timeout = 12)=>{
    return await Util.excuteWithTimeout(SSH.execute({ user: SSH_USER, password: SSH_PASS, host: ipAddress }, `${cmdString}`),timeout).catch(error => {
    });
  };

  static testConnect = async ()=>{
    const pathData = '/home/nuc/aos/data';
    return await SSHService.run('10.42.0.1',`ls ${pathData}`,5).catch(console.warn);
  }
}
