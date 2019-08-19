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

    this.state = {
      loading: true,
      errorText:'',
      selectedIndex:0
    };
  }

  static getDerivedStateFromProps(nextProps, prevState) {
    return null;
  }

  componentDidMount = async ()=> {
    super.componentDidMount();
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
  renderQrcodeForm=({ handleSubmit, submitting }) =>{ 
    const {selectedIndex} = this.state;
    console.log(TAG,'renderQrcodeForm begin');
    return(
      <Field
        component={FieldQrcode}
        name='address'
        label='Address'
        placeholder='Search by ERC20 Address'
        style={style.fields}
        validate={validator.required}
      />
    );
  };
  renderFormWithTab=({ handleSubmit, submitting }) =>{ 
    const {loading ,validAmount,errorText,selectedIndex} = this.state;
    console.log(TAG,'renderQrcodeForm begin');
    return(
      <>
        {selectedIndex ==1 &&(
          <Text style={style.label}>
          Borrow & Stake program is a special program designed for Node Device’s Owner
          </Text>
        )}
        <StakeValidatorTypeSelector />
        <EstimateFee />
        <Text style={style.errorText}>{errorText}</Text>
        <Field
          component={FieldQrcode}
          name='address'
          placeholder='Enter device serial number'
          style={style.input}
          validate={validator.required}
        />
        <Button
          titleStyle={style.button_text}
          buttonStyle={style.button}
          title='Stake'
        />
      </>
    );
  };

  render() {
    const { loading ,validAmount,errorText,selectedIndex} = this.state;

    return (
      <View style={style.container}>
        {this.renderTabs()}
        <Form onChange={this.handleFormChange} style={style.group}>
          {this.renderFormWithTab}
        </Form>
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
