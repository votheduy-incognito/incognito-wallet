import React from 'react';
import {Text} from '@src/components/core';
import styleSheet from './style';


const PNodeContent = () =>(
  <>
    <Text style={styleSheet.text}>
      1. Unplug it then plug it back in. Make sure the blue light is on
    </Text>
    <Text style={styleSheet.text}>
      2. Check that your home Wi-Fi is running
    </Text>
  </>
);

export default React.memo(PNodeContent);
