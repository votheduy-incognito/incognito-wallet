import React, { Component } from 'react';
import PropTypes from 'prop-types';
import { View, Text, Button, Container } from '@src/components/core';
import { Field } from 'redux-form';
import { createForm, InputField, ImagePickerField, SwitchField, validator } from '@src/components/core/reduxForm';
import styleSheet from './style';

const formName = 'updateTokenInfo';

const Form = createForm(formName, {
  enableReinitialize: true,
  keepDirtyOnReinitialize: true,
});
const descriptionMaxLength = validator.maxLength(255);


class TokenInfoUpdate extends Component {
  constructor(props) {
    super(props);
    this.state = {
    };
  }

  render() {
    const { incognitoInfo: { description, showOwnerAddress, image, updatedAt } = {}, onUpdate, onClose, isUpdating } = this.props;

    const initialValues = {
      description,
      showOwnerAddress
    };

    return (
      <Container style={styleSheet.container}>
        <Form initialValues={initialValues} style={styleSheet.form}>
          {({ handleSubmit }) => (
            <>
              <View style={styleSheet.fields}>
                <View style={styleSheet.block}>
                  <Field
                    component={InputField}
                    inputStyle={styleSheet.descriptionInput}
                    containerStyle={styleSheet.descriptionInput}
                    componentProps={{ multiline: true, numberOfLines: 10 }}
                    name='description'
                    placeholder='Explain what your token is for, how users can get it, and any other details of your project. 255 characters max.'
                    label='Description'
                    style={[styleSheet.input, styleSheet.descriptionInput, { marginBottom: 25 }]}
                    validate={descriptionMaxLength}
                  />
                </View>
                <View style={styleSheet.block}>
                  <View style={styleSheet.showMyAddressContainer}>
                    <Text>Display my Incognito Address (Optional)</Text>
                    <Field
                      component={SwitchField}
                      name='showOwnerAddress'
                      style={[styleSheet.input, styleSheet.switch]}
                    />
                  </View>
                </View>
                
                <View style={styleSheet.block}>
                  <Field
                    component={ImagePickerField}
                    name='logo'
                    text={'Update your coin\'s icon (optional, PNG and less than 50kb, changes will be reflected in about 1 hour.)'}
                    textButton='Upload'
                    style={styleSheet.input}
                    maxSize={1024 * 50 * 8} // 50kb
                    defaultImageUri={`${image}?t=${updatedAt}`}
                  />
                </View>
              </View>
              <View style={styleSheet.btnGroup}>
                <Button
                  title='Close'
                  style={styleSheet.closeBtn}
                  titleStyle={styleSheet.closeBtnText}
                  onPress={onClose}
                />
                <Button
                  title='Update'
                  style={styleSheet.submitBtn}
                  onPress={handleSubmit(onUpdate)}
                  isAsync
                  isLoading={isUpdating}
                />
              </View>
            </>
          )}
        </Form>
      </Container>
    );
  }
}

TokenInfoUpdate.defaultProps = {
  isUpdating: false
};

TokenInfoUpdate.propTypes = {
  incognitoInfo: PropTypes.object.isRequired,
  onUpdate: PropTypes.func.isRequired,
  onClose: PropTypes.func.isRequired,
  isUpdating: PropTypes.bool,
};

export default TokenInfoUpdate;