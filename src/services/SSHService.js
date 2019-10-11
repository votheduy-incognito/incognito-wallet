import Util from '@src/utils/Util';
import { SSH_PASS, SSH_USER } from 'react-native-dotenv';
import SSH from 'react-native-ssh';

const TAG = 'SSHService';
export default class SSHService {
  static run =  async (ipAddress,cmdString ='')=>{
    return await Util.excuteWithTimeout(SSH.execute({ user: SSH_USER, password: SSH_PASS, host: ipAddress }, `${cmdString}  \n`),10).catch(error => {
    })||{};
  }
}