import BaseScreen from '@screens/BaseScreen';
import _ from 'lodash';
import React from 'react';
import { ScrollView, Text, View,TextInput } from 'react-native';
import { connect } from 'react-redux';
import { Button,ButtonGroup } from 'react-native-elements';
import { scaleInApp } from '@src/styles/TextStyle';
import StakeValidatorTypeSelector from '@src/components/StakeValidatorTypeSelector/StakeValidatorTypeSelector';
import { createForm, InputField, InputQRField, validator } from '@src/components/core/reduxForm';
import { Field } from 'redux-form';
import EstimateFee from '@src/components/EstimateFee/EstimateFee';
import BorrowStake from '@src/components/BorrowStake';
import SelfStaking from '@src/components/SelfStaking';
import style, { tab_border_radius } from './styles';

const buttons = ['Stake', 'Borrow & Stake'];
const formName = 'addErc20Token';
const Form = createForm(formName, {
  enableReinitialize: true,
  keepDirtyOnReinitialize: true,
});
const FieldQrcode = (props)=>(
  <InputQRField
    {...props}
    containerStyle={style.input_container}
    underlineColorAndroid="transparent"
    inputStyle={style.input}
    placeholder="Enter device serial number"
    maxLength={100}
    numberOfLines={1}
  />
);
export const TAG = 'AddStake';

class AddStake extends BaseScreen {
  constructor(props) {
    super(props);
    const {navigation}= props;
    const { params } = navigation.state;
    const accountInfo = params ? params.accountInfo : null;
    console.log(TAG,'constructor begin =',accountInfo);
    this.state = {
      loading: true,
      errorText:'',
      accountInfo:accountInfo,
      selectedIndex:0
    };
  }

  static getDerivedStateFromProps(nextProps, prevState) {
    return null;
  }
  updateIndex=(selectedIndex)=> {
    this.setState({selectedIndex});
  }
  renderTabs=()=>{
    const { selectedIndex } = this.state;
    return(
      <ButtonGroup
        onPress={this.updateIndex}
        selectedIndex={selectedIndex}
        buttons={buttons}
        textStyle={style.tab_text}
        buttonStyle={style.tab_button}
        selectedTextStyle={style.tab_text_selected}
        selectedButtonStyle={style.tab_button_selected}
        containerStyle={style.tab_container}
      />
    );
  }
  renderBorrowStake = ()=>{
    const {selectedIndex} = this.state;
    return selectedIndex === 1?<BorrowStake />:undefined; 
  }
  renderStake = ()=>{
    const {accountInfo,selectedIndex} = this.state;
    
    return (selectedIndex === 1?<BorrowStake />: (
      <SelfStaking
        onCallBackStaked={(rs)=>{
          this.onPressBack();
        }}
        minerAccountName={accountInfo.minerAccountName}
        funderAccountName={accountInfo.funderAccountName}
      />
    ));
  }

  render() {
    const { loading ,validAmount,errorText,selectedIndex} = this.state;

    return (
      <View style={style.container}>
        {/* {this.renderTabs()} */}
        {this.renderStake()}
        {/* {this.renderBorrowStake()} */}
      </View>
    );
  }

  set loading(isLoading) {
    this.setState({
      loading: isLoading
    });
  }

}

AddStake.propTypes = {};

AddStake.defaultProps = {};
const mapStateToProps = state => ({});
const mapDispatchToProps = {};
export default connect(
  mapStateToProps,
  mapDispatchToProps
)(AddStake);
