import { imagesVector } from '@src/assets';
import BottomSheet from '@src/components/BottomSheet';
import TextStyle from '@src/styles/TextStyle';
import React, { Component } from 'react';
import { StyleSheet, Text, View } from 'react-native';

const style = StyleSheet.create({
  container: {
    flex:1,
    alignItems:'center',
    flexDirection:'row',
    backgroundColor: 'white'
  },
  containerItem: {
    
  },
  textItem:{
    ...TextStyle.normalText,
    color:'black'
  }
});
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
    const labels = ['Update Wifi','Factory reset'];
    return (
      <>
        {labels.map(item=>{
          return (
            <View style={style.container} key={item}>      
              {imagesVector.ic_update_wifi()}
              <Text style={[style.containerItem,style.textItem]}>{item}</Text>
            </View>      
          );  
        })}
      </>
    );
  }
}
export default AdvanceOption;