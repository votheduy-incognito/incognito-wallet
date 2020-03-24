import { scaleInApp } from '@src/styles/TextStyle';
import React from 'react';
import { Icon } from 'react-native-elements';

const images = {
  bg_top_device: require('./images/bg_top_device.png'),
  bg_top_detail: require('./images/bg_top_detail.png'),
  ic_add_node_device:require('./images/ic_add_node_device.png'),
  ic_add_self_node:require('./images/ic_add_self_node.png'),
  ic_getstarted_scan_device:require('./images/ic_getstarted_scan_device.png'),
  ic_getstarted_qrcode: require('./images/ic_getstarted_qrcode.png'),
};

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
  ic_wifi,
};

export default images;
