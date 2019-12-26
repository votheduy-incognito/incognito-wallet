import React, { Component } from 'react';
import PropTypes from 'prop-types';
import { addTokenInfo } from '@src/services/api/token';
import { ExHandler } from '@src/services/exception';
import { debounce } from 'lodash';
import TokenInfoUpdate from './TokenInfoUpdate';
import { Toast } from '../core';
import SimpleInfo from '../SimpleInfo';

function isNotEmpty(value) {
  return ![null, undefined].includes(value);
}

class TokenInfoUpdateContainer extends Component {
  constructor(props) {
    super(props);
    this.state = {
      isUpdating: false
    };

    this.handleUpdateInfo = debounce(this.handleUpdateInfo, 300);
  }

  handleUpdateInfo = async ({ description, showOwnerAddress, logo } = {}) => {
    try {
      this.setState({ isUpdating: true });
      const { incognitoInfo, onUpdated, onClose } = this.props;
      const newInfo = await addTokenInfo({
        tokenId: incognitoInfo?.tokenID,
        symbol: incognitoInfo?.symbol,
        name: incognitoInfo?.name,
        txId: incognitoInfo?.txId,
        ...isNotEmpty(description) ? { description } : {},
        ...isNotEmpty(showOwnerAddress) ? { showOwnerAddress } : {},
        ...isNotEmpty(logo) ? { logoFile: logo } : {}
      });

      if (typeof onUpdated === 'function') {
        onUpdated(newInfo);
      }

      Toast.showSuccess('Updated successfully');

      if (typeof onClose === 'function') {
        onClose();
      }
    } catch (e) {
      new ExHandler(e, 'Can not update token information right now, please try later.').showWarningToast();
    } finally {
      this.setState({ isUpdating: false });
    }
  }

  render() {
    const { isUpdating } = this.state;
    const { incognitoInfo } = this.props;

    if (!incognitoInfo || (!incognitoInfo?.isOwner)) {
      return (
        <SimpleInfo
          text="Sorry, we didn't find the information that you're looking for."
        />
      );
    }

    return (
      <TokenInfoUpdate {...this.props} onUpdate={this.handleUpdateInfo} isUpdating={isUpdating} />
    );
  }
}

TokenInfoUpdateContainer.propTypes = {
  incognitoInfo: PropTypes.object.isRequired,
  onUpdated: PropTypes.func.isRequired,
  onClose: PropTypes.func.isRequired,
};

export default TokenInfoUpdateContainer;