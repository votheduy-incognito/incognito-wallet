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
    const { tokens, account, supportTokenIds } = this.props;

    const supportTokens = tokens?.filter(token => supportTokenIds?.includes(token.id));

    if ((!supportTokens || supportTokens.length === 0) && !account) {
      return <SimpleInfo text='There has no token to display' />;
    }

    return (
      <Container>
        <FollowingTokenList
          account={account}
          tokens={supportTokens}
          onSelectToken={this.handleSelectToken}
          excludeTokenIds={[]}
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
  tokens: [],
  supportTokenIds: []
};

TokenInfo.propTypes = {
  selectedPrivacy: PropTypes.object.isRequired,
  onSelect: PropTypes.func.isRequired,
  tokens: PropTypes.arrayOf(PropTypes.object),
  supportTokenIds: PropTypes.arrayOf(PropTypes.string),
  account: PropTypes.object.isRequired
};

const mapState = state => ({
  tokens: tokenSeleclor.followed(state),
  account: accountSeleclor.defaultAccount(state)
});

export default connect(
  mapState,
)(TokenInfo);
