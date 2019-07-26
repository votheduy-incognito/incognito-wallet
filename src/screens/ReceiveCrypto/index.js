import React, { Component } from 'react';
import PropTypes from 'prop-types';
import LoadingContainer from '@src/components/LoadingContainer';
import { connect } from 'react-redux';
import { selectedPrivacySeleclor } from '@src/redux/selectors';
import ReceiveCrypto from './ReceiveCrypto';

class ReceiveCryptoContainer extends Component {
  render() {
    const { selectedPrivacy } = this.props;

    if (!selectedPrivacy) return <LoadingContainer />;

    return (
      <ReceiveCrypto {...this.props} />
    );
  }
}

const mapState = state => ({
  selectedPrivacy: selectedPrivacySeleclor.selectedPrivacy(state)
});

const mapDispatch = {  };

ReceiveCryptoContainer.defaultProps = {
  selectedPrivacy: null
};

ReceiveCryptoContainer.propTypes = {
  navigation: PropTypes.object.isRequired,
  selectedPrivacy: PropTypes.object,
};

export default connect(
  mapState,
  mapDispatch
)(ReceiveCryptoContainer);
