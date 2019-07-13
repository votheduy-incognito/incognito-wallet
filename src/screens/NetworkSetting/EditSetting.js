/* eslint-disable import/no-cycle */
import {
  Form,
  FormSubmitButton,
  FormTextField,
  ScrollView,
  Toast,
  View
} from '@src/components/core';
import { reloadWallet } from '@src/redux/actions/wallet';
import serverService from '@src/services/wallet/Server';
import PropTypes from 'prop-types';
import React, { Component } from 'react';
import { connect } from 'react-redux';
import { object, string } from 'yup';
import { networkItemShape } from './NetworkItem';
import { networkEditStyle } from './style';

const validator = object().shape({
  address: string().required('Required!'),
  name: string().required('Required!')
});

class EditSetting extends Component {
  constructor(props) {
    super(props);
    this.state = {
      initialFormValues: {
        ...props.network
      }
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
    const { initialFormValues } = this.state;
    return (
      <ScrollView>
        <Form
          formRef={form => (this.form = form)}
          initialValues={initialFormValues}
          onSubmit={this.handleEdit}
          validationSchema={validator}
        >
          <FormTextField name="address" placeholder="RPC Server Address" />
          <FormTextField name="username" placeholder="User Name" />
          <FormTextField name="password" placeholder="Password" />
          <FormTextField name="name" placeholder="Name" />
          <View style={networkEditStyle.btnGroups}>
            {/* <Button title='Remove' type='danger' style={networkEditStyle.removeBtn} disabled /> */}
            <FormSubmitButton title="SAVING" style={networkEditStyle.saveBtn} />
          </View>
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
