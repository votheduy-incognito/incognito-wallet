import { imagesVector } from '@src/assets';
import BottomSheet from '@src/components/BottomSheet';
import TextStyle from '@src/styles/TextStyle';
import PropTypes from 'prop-types';
import React, { Component } from 'react';
import { Alert, StyleSheet, TouchableOpacity } from 'react-native';
import { ListItem } from 'react-native-elements';

const style = StyleSheet.create({
  container: {
  },
  textItem:{
    ...TextStyle.normalText,
    color:'black'
  },
  textSubtitle:{
    ...TextStyle.minimizeText,
    color:'#91A4A6'
  }
});
const labels = [{title:'Change WiFi network',subtitle:'Connect Node to a different network'},{title:'Factory reset',subtitle:'Remove all data and start again'}];
class AdvanceOption extends Component {
  constructor(props){
    super(props);
    
    this.mainView = React.createRef();
  }
  render(){
    return (<BottomSheet ref={this.mainView} contentView={this.renderContent()} />);
  }

  open = ()=>{
    this.mainView?.current.open();
  }

  close = ()=>{
    this.mainView?.current.close();
  }
  renderContent = ()=>{
    
    return (
      <>
        {labels.map((item,index)=>{
          return (
            <ListItem
              Component={TouchableOpacity}
              onPress={()=>{
                this.close();
                const {handleUpdateWifi,handleReset} = this.props;
                if(index === 0){
                  handleUpdateWifi && handleUpdateWifi();
                }else{
                  Alert.alert('','Are you sure you want to reset your device?Please remember to back up your wallet. Only you can restore your private key.',[{text: 'Reset', onPress: () => handleReset && handleReset()},
                    {
                      text: 'Cancel',
                      onPress: () => console.log('Cancel Pressed'),
                      style: 'cancel',
                    },]);
                }
              }}
              key={item.title}
              containerStyle={style.container}
              leftIcon={index==0?imagesVector.ic_update_wifi():imagesVector.ic_factory_reset()}
              titleStyle={style.textItem}
              title={item.title}
              subtitleStyle={style.textSubtitle}
              subtitle={item.subtitle}
            />  
          );  
        })}
      </>
    );
  }
}

AdvanceOption.propTypes = {
  handleReset: PropTypes.func,
  handleUpdateWifi: PropTypes.func
};
export default AdvanceOption;