import _ from 'lodash';
import React from 'react';
import { Text, View } from 'react-native';
import { connect } from 'react-redux';
import { Button } from 'react-native-elements';
import StakeValidatorTypeSelector from '@src/components/StakeValidatorTypeSelector/StakeValidatorTypeSelector';
import { createForm, InputField, InputQRField, validator } from '@src/components/core/reduxForm';
import { Field } from 'redux-form';
import BaseComponent from '@components/BaseComponent';
import style from './styles';

const formName = 'formBorrowStake';
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
export const TAG = 'BorrowStake';

class BorrowStake extends BaseComponent {
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
        <Text style={style.errorText}>{errorText}</Text>
        <Field
          component={FieldQrcode}
          name='address'
          placeholder='Enter device serial number'
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

BorrowStake.propTypes = {};

BorrowStake.defaultProps = {};
const mapStateToProps = state => ({});
const mapDispatchToProps = {};
export default connect(
  mapStateToProps,
  mapDispatchToProps
)(BorrowStake);
