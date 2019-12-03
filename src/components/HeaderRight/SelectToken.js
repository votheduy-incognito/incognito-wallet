import React, { Component } from 'react';
import PropTypes from 'prop-types';
import { connect } from 'react-redux';
import { tokenSeleclor, accountSeleclor } from '@src/redux/selectors';
import { COLORS } from '@src/styles';
import { View, Container, Modal, TouchableOpacity } from '../core';
import CryptoIcon from '../CryptoIcon';
import { tokenInfoStyle } from './style';
import SimpleInfo from '../SimpleInfo';
import FollowingTokenList from '../FollowingTokenList';


class TokenInfo extends Component {
  constructor() {
    super();

    this.state = {
      isShowInfo: false,
    };
  }

  renderListToken = () => {
    const { tokens, account, selectedPrivacy } = this.props;

    if (!tokens || tokens.length === 0) {
      return <SimpleInfo text='There has no token to display' />;
    }

    return (
      <Container>
        <FollowingTokenList
          account={account}
          tokens={tokens}
          onSelectToken={this.handleSelectToken}
          excludeTokenIds={[selectedPrivacy?.tokenId]}
        />
      </Container>
    );
  };

  handleToggle = () => {
    this.setState(({ isShowInfo }) => ({ isShowInfo: !isShowInfo }));
  }

  handleSelectToken = (tokenId) => {
    const { onSelect } = this.props;
    if (typeof onSelect === 'function') {
      onSelect(tokenId);
      this.handleToggle();
    }
  }

  render() {
    const { isShowInfo } = this.state;
    const { selectedPrivacy } = this.props;

    return (
      <View style={tokenInfoStyle.container}>
        <TouchableOpacity onPress={this.handleToggle}>
          <CryptoIcon tokenId={selectedPrivacy?.tokenId} />
        </TouchableOpacity>
        <Modal visible={isShowInfo} close={this.handleToggle} containerStyle={tokenInfoStyle.modalContainer} closeBtnColor={COLORS.primary} headerText='Choose token'>
          {this.renderListToken()}
        </Modal>
      </View>
    );
  }
}

TokenInfo.defaultProps = {
  tokens: []
};

TokenInfo.propTypes = {
  selectedPrivacy: PropTypes.object.isRequired,
  onSelect: PropTypes.func.isRequired,
  tokens: PropTypes.arrayOf(PropTypes.object),
  account: PropTypes.object.isRequired
};

const mapState = state => ({
  tokens: tokenSeleclor.followed(state),
  account: accountSeleclor.defaultAccount(state)
});

export default connect(
  mapState,
)(TokenInfo);
