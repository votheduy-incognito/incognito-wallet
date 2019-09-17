import BottomSheet from '@src/components/BottomSheet';
import { COLORS, DECOR } from '@src/styles';
import TextStyle from '@src/styles/TextStyle';
import React, { Component } from 'react';
import { StyleSheet, Text, View } from 'react-native';

const style = StyleSheet.create({
  container: {
    borderTopLeftRadius: DECOR.borderRadiusBorder,
    backgroundColor: COLORS.white
  },
  containerItem: {
    backgroundColor: COLORS.white,
    flex:1,
    borderWidth:DECOR.borderWidth,
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
      <View style={style.container}>
        {labels.map(item=>{
          return <Text style={[style.containerItem,style.textItem]} key={item}>{item}</Text>;  
        })}
      </View>
    );
  }
}
export default AdvanceOption;