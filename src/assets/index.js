import { Icon } from 'react-native-elements';
import React from 'react';
import {TouchableOpacity} from 'react-native';
import { scaleInApp } from '@src/styles/TextStyle';

const images = {
  bgTop: require('./images/bg_top.png'),
  ic_add_device: require('./images/ic_add_device.png'),
  ic_device: require('./images/ic_device.png'),
  ic_virtual_device: require('./images/ic_virtual_device.png'),
  ic_no_finding_device: require('./images/ic_no_finding_device.png'),
  bg_top_device: require('./images/bg_top_device.png'),
  bg_top_virtual_device: require('./images/bg_top_virtual_device.png'),
  bg_first: require('./images/bg_first.png'),
  bg_top_detail: require('./images/bg_top_detail.png'),
  ic_back: require('./images/ic_back.png'),
  ic_add_node_device:require('./images/ic_add_node_device.png'),
  ic_add_self_node:require('./images/ic_add_self_node.png'),
  ic_add_cloud_node:require('./images/ic_add_cloud_node.png'),
  // autonomous_logo: require('@/assets/images/autonomous_logo.png'),
  // autonomous_text: require('@/assets/images/autonomous_text.png'),
  // background_top: require('@/assets/images/background_top.png'),
  // bg_home_top: require('@/assets/images/bg_home_top.png'),
  // bg_home_bottom: require('@/assets/images/bg_home_bottom.png'),
  // ic_logo_default: require('@/assets/images/ic_logo_default.png'),
  // bt_qrcode: require('@/assets/images/bt_qr_code.png'),
  // ic_next: require('@/assets/images/ic_next.png'),
  // bg_qrcode: require('@/assets/images/bg_qrcode.png'),
  // ic_setting: require('@/assets/images/ic_settings.png'),
  // lineOverview: require('@/assets/images/lineOverview.png'),
  // checkin_success: require('@/assets/images/checkin_success.png'),
  // ic_capture_photo: require('@/assets/images/ic_capture_photo.png'),
  // ic_capture: require('@/assets/images/ic_capture.png')
};
const ic_back = (props?,containerIconStyle?)=>(
  <TouchableOpacity {...props}>
    <Icon
      size={scaleInApp(25)}
      name='ios-arrow-back'
      type='ionicon'
      color='#ffffff'
      containerStyle={[{paddingHorizontal:scaleInApp(15)},containerIconStyle]}
    />
  </TouchableOpacity>
);

const ic_wifi = (props)=>(
  <Icon
    size={scaleInApp(25)}
    name='ios-wifi'
    type='ionicon'
    color='#000000'
    {...props} 
  />
);
export const imagesVector = {
  ic_back:ic_back,
  ic_wifi,
};
export default images;
