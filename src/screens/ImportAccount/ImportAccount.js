import {
  Container,
  Button,
  View,
  Text,
  TouchableOpacity
} from '@src/components/core';
import PropTypes from 'prop-types';
import { Field } from 'redux-form';
import { createForm, InputField, InputQRField, validator } from '@src/components/core/reduxForm';
import React, { Component } from 'react';
import randomName from '@src/utils/randomName';
import { CustomError, ErrorCode, ExHandler } from '@src/services/exception';
import styleSheet from './style';

const formName = 'importAccount';
const Form = createForm(formName);
const isRequired = validator.required();

class ImportAccount extends Component {
  constructor() {
    super();

    this.state = {
      isUseRandomName: true
    };
  }

  componentWillMount() {
    this.setState(({ isUseRandomName }) => {
      if (isUseRandomName) {
        return {
          randomName: this.genAccountName()
        };
      }
    });
  }

  goBack = () => {
    const { navigation } = this.props;
    navigation.popToTop();
  };

  genAccountName = () => {
    const { accountList } =  this.props;
    const excludeNameList = accountList.map(account => account.name);
    return randomName({ excludes: excludeNameList });
  };

  handleImportAccount = async ({ accountName : name, privateKey }) => {
    const { accountList, importAccount, navigation } = this.props;
    const { isUseRandomName, randomName } = this.state;
    const accountName = isUseRandomName ? randomName : name;

    const lowerCase = str => String(str).toLowerCase();
    try {
      if (
        accountList.find(
          _account => lowerCase(_account.name) === lowerCase(accountName)
        )
      ) {
        return throw new CustomError(ErrorCode.importAccount_existed);
      }

      const account = await importAccount({ privateKey, accountName });

      // switch to this account
      const onSwitchAccount = navigation?.getParam('onSwitchAccount');
      if (typeof onSwitchAccount === 'function') {
        onSwitchAccount(account);
      }

      this.goBack();
    } catch (e) {
      new ExHandler(e, 'Import account failed, please try again.').showErrorToast();
    }
  };

  hanldeChangeRandomName = () => {
    const { rfChange } = this.props;
    const { randomName } = this.state;

    // fill "random name" to form
    rfChange(formName, 'accountName', randomName);

    this.setState({ isUseRandomName: false });
  }

  render() {
    const { isUseRandomName, randomName } = this.state;

    return (
      <Container style={styleSheet.container}>
        <Form>
          {({ handleSubmit, submitting }) => (
            <View style={styleSheet.form}>
              {
                isUseRandomName && randomName
                  ? (
                    <View style={styleSheet.randomNameField}>
                      <Text style={styleSheet.randomNameLabel}>Account Name</Text>
                      <View style={styleSheet.randomNameValue}>
                        <Text numberOfLines={1} ellipsizeMode='tail' style={styleSheet.randomNameText}>
                          {randomName}
                        </Text>
                        <TouchableOpacity onPress={this.hanldeChangeRandomName} style={styleSheet.randomNameChangeBtn}>
                          <Text style={styleSheet.randomNameChangeBtnText}>Edit</Text>
                        </TouchableOpacity>
                      </View>
                    </View>
                  )
                  : (
                    <Field
                      component={InputField}
                      componentProps={{ autoFocus: true }}
                      name='accountName'
                      placeholder='Account Name'
                      label='Account Name'
                      validate={validator.combinedAccountName}
                    />
                  )
              }

              <Field
                component={InputQRField}
                name='privateKey'
                placeholder='Enter Private Key'
                label='Private Key'
                validate={[isRequired]}
              />
              <Button
                title='Import'
                style={styleSheet.submitBtn}
                onPress={handleSubmit(this.handleImportAccount)}
                isAsync
                isLoading={submitting}
              />
            </View>
          )}
        </Form>
      </Container>
    );
  }
}

ImportAccount.defaultProps = {
  accountList: [],
  importAccount: null,
};

ImportAccount.propTypes = {
  navigation: PropTypes.object.isRequired,
  accountList: PropTypes.array,
  importAccount: PropTypes.func,
  rfChange: PropTypes.func.isRequired
};

export default ImportAccount;
