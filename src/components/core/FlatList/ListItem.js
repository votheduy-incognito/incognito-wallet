import React from 'react';
import { ListItem as RNListItem } from 'react-native-elements';

const ListItem = React.memo((props)=>{
  const titleProps = {allowFontScaling:false,...(props?.titleProps??undefined)};
  const subtitleProps = {allowFontScaling:false,...(props?.subtitleProps??undefined)};
  return ( <RNListItem titleProps={titleProps} subtitleProps={subtitleProps} {...props}  />);
});

export default ListItem;