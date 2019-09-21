import { imagesVector } from '@src/assets';
import BottomSheet from '@src/components/BottomSheet';
import TextStyle from '@src/styles/TextStyle';
import PropTypes from 'prop-types';
import React, { Component } from 'react';
import { StyleSheet, TouchableOpacity } from 'react-native';
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
                
                const {handleUpdateWifi,handleReset} = this.props;
                if(index === 0){
                  handleUpdateWifi && handleUpdateWifi();
                }else{
                  handleReset && handleReset();
                  
                }
                
                this.close();
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