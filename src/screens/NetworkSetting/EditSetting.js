import React, { Component } from 'react';
import { ScrollView, Form, FormTextField, FormSubmitButton, Button, View, Toast } from '@src/components/core';
import { object, string } from 'yup';
import { networkEditStyle } from './style';

const validator = object().shape({
  rpcServerAddress: string()
    .required('Required!'),
  username: string()
    .required('Required!'),
  password: string()
    .required('Required!'),
  name: string()
    .required('Required!'),
});

class EditSetting extends Component {
  constructor() {
    super();
    this.state = {
      initialFormValues: {}
    };
  }

  handleEdit = values => {
    try {
      console.log(values);
      Toast.showInfo('Update completed!');
    } catch(e) {
      Toast.showError(e.message);
    }
  }

  render() {
    const { initialFormValues } = this.state;
    return (
      <ScrollView>
        <Form formRef={form => this.form = form} initialValues={initialFormValues} onSubmit={this.handleEdit} validationSchema={validator}>
          <FormTextField name='rpcServerAddress' placeholder='RPC Server Address' />
          <FormTextField name='username' placeholder='User Name' />
          <FormTextField name='password' placeholder='Password' />
          <FormTextField name='name' placeholder='Name' />
          <View style={networkEditStyle.btnGroups}> 
            <Button title='Remove' type='danger' style={networkEditStyle.removeBtn} />
            <FormSubmitButton title='SAVING' style={networkEditStyle.saveBtn} />
          </View>
        </Form>
      </ScrollView>
    );
  }
}

EditSetting.propTypes = {
};

export default EditSetting;