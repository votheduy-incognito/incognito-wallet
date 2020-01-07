import { Platform, Share } from 'react-native';
import clipboard from '@src/services/clipboard';
import { accountSeleclor } from '@src/redux/selectors';
import { ExHandler } from '@src/services/exception';
import storageService from '@src/services/storage';
import PropTypes from 'prop-types';
import React, { Component } from 'react';
import { connect } from 'react-redux';
import moment from 'moment';
import { debounce } from 'lodash';
import rnfs from 'react-native-fs';
import SimpleInfo from '@src/components/SimpleInfo';
import LoadingContainer from '@src/components/LoadingContainer';
import { CONSTANT_KEYS } from '@src/constants';
import BackupKeys from './BackupKeys';

let prevAccounts;

const convertToString = (backupData) => {
  return backupData.map(pair => {
    const [name, key] = Object.entries(pair)?.flat() || [];
    return `AccountName: ${name}\nPrivateKey:${key}`;
  })
    ?.join('\n\n') || '';
};

const getBackupData = accounts => {
  try {
    const info = [];
    if (accounts instanceof Array) {
      for(let account of accounts) {
        info.push({ [account?.name]: account?.PrivateKey });
      }
    }

    if (info.length) {
      return { backupData: info, backupDataStr: convertToString(info) };
    }
  } catch (e) {
    new ExHandler(e, 'Please try again').showErrorToast();
  }
};

class BackupKeysContainer extends Component {
  constructor() {
    super();

    this.state = {
      backupData: [],
      backupDataStr: '',
    };

    this.handleSaveFile = debounce(this.handleSaveFile.bind(this), 300);
    this.handleCopyAll = debounce(this.handleCopyAll.bind(this), 300);
  }

  static getDerivedStateFromProps(nextProps) {
    let newState = {};
    const { accounts } = nextProps;

    if (prevAccounts !== accounts) {
      const { backupData, backupDataStr } = getBackupData(accounts) || {};
      newState = {
        ...newState,
        backupData,
        backupDataStr
      };

      prevAccounts = accounts;
    }

    return newState;
  }
  
  handleSaveFile = async () => {
    const { backupDataStr } = this.state;

    const time = moment().format('DD_MM_YYYY_HH_mm');

    const dir = Platform.OS === 'android' ? rnfs.ExternalDirectoryPath : rnfs.DocumentDirectoryPath;
    const path = `${dir}/incognito_${time}.txt`;
    
    await rnfs.writeFile(path, backupDataStr, 'utf8');

    const shared = await Share.share({ message: backupDataStr, url: path, title: 'Backup your accounts' });
    const isShared = shared?.action === Share.sharedAction;

    if (isShared) {
      storageService.setItem(CONSTANT_KEYS.IS_BACKEDUP_ACCOUNT, JSON.stringify(true));
    }

    return { path, shared, isShared };
  }

  handleCopyAll = () => {
    const { backupDataStr } = this.state;

    clipboard.set(backupDataStr, { copiedMessage: 'Copied all accounts' });
  }

  
  
  render() {
    const { backupData } = this.state;

    if (backupData?.length === 0) {
      return (
        <SimpleInfo
          text='No account to backkup'
          subtext='Your wallet have no account to backup'
        />
      );
    } else if (backupData?.length > 0) {
      return (
        <BackupKeys
          {...this.props}
          onSaveAs={this.handleSaveFile}
          onCopyAll={this.handleCopyAll}
          backupData={backupData}
        />
      );
    }
    
    return <LoadingContainer />;
  }
}

const mapState = state => ({
  accounts: accountSeleclor.listAccount(state),
});

BackupKeysContainer.propTypes = {
  accounts: PropTypes.arrayOf(PropTypes.object),
  navigation: PropTypes.object.isRequired,
};

BackupKeysContainer.defaultProps = {
  accounts: null,
};

export default connect(
  mapState,
)(BackupKeysContainer);
