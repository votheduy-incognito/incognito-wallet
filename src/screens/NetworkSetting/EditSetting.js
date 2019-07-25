/* eslint-disable import/no-cycle */
import {
  ScrollView,
  Toast,
  View,
  Button
} from '@src/components/core';
import { createForm, InputField, validator } from '@src/components/core/reduxForm';
import { Field } from 'redux-form';
import { reloadWallet } from '@src/redux/actions/wallet';
import serverService from '@src/services/wallet/Server';
import PropTypes from 'prop-types';
import React, { Component } from 'react';
import { connect } from 'react-redux';
import { networkItemShape } from './NetworkItem';
import { networkEditStyle } from './style';

const formName = 'editSetting';

class EditSetting extends Component {
  constructor(props) {
    super(props);
    this.state = {
      form: createForm(formName, {
        initialValues: { ...props.network }
      }) 
    };
  }

  handleEdit = async values => {
    try {
      const { network, reloadWallet } = this.props;
      const servers = await serverService.get();
      const newServers = servers.map(server => {
        if (server?.id === network?.id) {
          return {
            ...server,
            ...values
          };
        }
        return server;
      });

      serverService.set(newServers);

      // need to reload wallet if current network was updated
      if (network?.default) {
        reloadWallet();
      }

      Toast.showInfo('Update completed!');
    } catch (e) {
      Toast.showError(e.message);
    }
  };

  render() {
    const { form: Form } = this.state;
    return (
      <ScrollView>
        <Form>
          {({ handleSubmit, submitting }) => (
            <>
              <Field
                component={InputField}
                name='address'
                placeholder='RPC Server Address'
                label='RPC Server Address'
                validate={[validator.required]}
              />
              <Field
                component={InputField}
                name='username'
                placeholder='User Name'
                label='User Name'
              />
              <Field
                component={InputField}
                name='password'
                placeholder='Password'
                label='Password'
              />
              <Field
                component={InputField}
                name='name'
                placeholder='Name'
                label='Name'
                validate={[validator.required]}
              />
              <View style={networkEditStyle.btnGroups}>
                {/* <Button title='Remove' type='danger' style={networkEditStyle.removeBtn} disabled /> */}
                <Button title='SAVING' style={networkEditStyle.saveBtn} onPress={handleSubmit(this.handleEdit)} isAsync isLoading={submitting} />
              </View>
            </>
          )}
        </Form>
      </ScrollView>
    );
  }
}

EditSetting.defaultProps = {
  network: undefined,
  reloadWallet: undefined
};
EditSetting.propTypes = {
  network: networkItemShape,
  reloadWallet: PropTypes.func
};

const mapDispatch = { reloadWallet };

export default connect(
  null,
  mapDispatch
)(EditSetting);
