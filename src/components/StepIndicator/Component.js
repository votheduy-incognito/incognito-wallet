import React,{Component} from 'react';
import {Platform,View } from 'react-native';
import RNStepIndicator from 'react-native-step-indicator';
import PropTypes from 'prop-types';
import _ from 'lodash';
import style,{ indicatorStyles } from './style';
import {StepIndicatorProps} from './type';

type State = {
  currentPage:number
}
class StepIndicator extends Component<StepIndicatorProps,State> {
  constructor(props:StepIndicatorProps) {
    super(props);
    this.state={
      currentPage: 0
    };
  }

  static getDerivedStateFromProps(props, state) {
    if(!_.isEqual(props.currentPage,state.currentPage)){
      return {
        currentPage:props.currentPage
      };
    }
    return undefined;
  }
  setCurrentPage=(currentPage:Number)=>{
    this.setState({
      currentPage:currentPage
    });
  }
  CurrentPage=()=>{
    const {currentPage} = this.state;
    return currentPage??0;
  }
  renderStepIndicator =(position: Number, stepStatus: String)=>{
    const {renderStepIndicator } = this.props;
    return renderStepIndicator?renderStepIndicator(position,stepStatus):undefined;
  }
  render(){
    const {currentPage} = this.state;

    const {containerStyle,stepStyle,stepCount,labels=[]} = this.props;
    return (
      <View style={[style.container,containerStyle]}>
        <RNStepIndicator
          labels={labels}
          currentPosition={currentPage}
          direction='horizontal'
          stepCount={stepCount}
          customStyles={[indicatorStyles,stepStyle]}
        />
      </View>
    );
  }
}

StepIndicator.defaultProps={
  stepStyle :indicatorStyles,
  stepCount:3,
  currentPage:0
};

export default StepIndicator;