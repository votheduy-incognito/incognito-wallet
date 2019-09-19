import { scaleInApp } from '@src/styles/TextStyle';
import PropTypes from 'prop-types';
import React, { Component } from 'react';
import { View } from 'react-native';
import RBSheet from 'react-native-raw-bottom-sheet';
import style from './style';

class BottomSheet extends Component {
  render() {
    const{contentView,height} = this.props;
    return (
      <View style={style.container}>
        <RBSheet
          ref={ref => {
            this.RBSheet = ref;
          }}
          height={height}
          animationType='fade'
          duration={200}
          customStyles={{
            container: undefined
          }}
        >
          {contentView?contentView:null}
        </RBSheet>
      </View>
    );
  }
  open=()=>{
    this.RBSheet.open();
  }
  close=()=>{
    this.RBSheet.close();
  }
}

BottomSheet.defaultProps = {
  contentView: undefined,
  height: scaleInApp(200)
};
BottomSheet.propTypes = {
  contentView: PropTypes.object,
  height: PropTypes.number,
};

export default BottomSheet;