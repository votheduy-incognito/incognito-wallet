import { imagesVector } from '@src/assets';
import BottomSheet from '@src/components/BottomSheet';
import TextStyle from '@src/styles/TextStyle';
import PropTypes from 'prop-types';
import React, { Component } from 'react';
import { StyleSheet, TouchableOpacity, View } from 'react-native';
import {Text,ButtonExtension, ListItem} from '@components/core';
import Dialog, { DialogContent } from 'react-native-popup-dialog';
import styles from './style';

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
// const labels = [{title:'Change WiFi network',subtitle:'Connect Node to a different network'},{title:'Factory reset',subtitle:'Remove all data and start again'},{title:'Update Firware',subtitle:'Remove all data and start again'}];
const labels = [{title:'Change WiFi network',subtitle:'Connect Node to a different network'},{title:'Factory reset',subtitle:'Remove all data and start again'}];
class AdvanceOption extends Component {
  constructor(props){
    super(props);
    this.state={
      isShowMessage:false,
    };
    this.mainView = React.createRef();
  }
  render(){
    return (
      <>
        {this.renderDialogNotify()}
        <BottomSheet ref={this.mainView} contentView={this.renderContent()} />
      </>
    );
  }

  renderDialogNotify =()=>{
    const {isShowMessage} = this.state;
    return (
      <Dialog
        width={0.8}
        height={0.35}
        visible={isShowMessage}
        onTouchOutside={() => {
          this.setState({ isShowMessage: false });
        }}
      >
        <DialogContent style={styles.dialog_container}>
          <Text style={styles.dialog_title_text}>Are you sure?</Text>
          <View style={styles.dialog_content}>
            <Text style={styles.dialog_content_text}>Are you sure you want to reset your device?{'\n'}Please remember to back up your wallet. Only you can restore your private key.</Text>
          </View>
          <ButtonExtension
            titleStyle={styles.textTitleButton}
            buttonStyle={styles.dialog_button}
            onPress={()=>{
              const {handleReset} = this.props;
              handleReset && handleReset();
              this.setState({ isShowMessage: false });
            }}
            title='Reset'
          />
        </DialogContent>
       
      </Dialog>
    );
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
              disabled={index!=1?true:false}
              disabledStyle={{opacity:0.3}}
              Component={TouchableOpacity}
              onPress={()=>{
                this.close();
                const {handleUpdateWifi,handleReset,handleUpdateUpdateFirware} = this.props;
                if(index === 0){
                  handleUpdateWifi && handleUpdateWifi();
                }else if(index === 1){
                  this.setState({
                    isShowMessage:true
                  });
                }else{
                  handleUpdateUpdateFirware && handleUpdateUpdateFirware();
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
  handleUpdateWifi: PropTypes.func,
  handleUpdateUpdateFirware: PropTypes.func
};
export default AdvanceOption;