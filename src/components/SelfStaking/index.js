import React, { Component } from 'react';
import PropTypes from 'prop-types';
import { connect } from 'react-redux';
import { selectedPrivacy } from '@src/redux/selectors/selectedPrivacy';
import SelfStaking from './SelfStaking';

export class SelfStakingContainer extends Component {
  static propTypes = {
    selectedPrivacy: PropTypes.object
  }

  static defaultProps = {
    selectedPrivacy: null
  };

  render() {
    const { selectedPrivacy } = this.props;

    if (!selectedPrivacy) return null;

    return (
      <SelfStaking {...this.props} />
    );
  }
}

const mapStateToProps = (state) => ({
  selectedPrivacy: selectedPrivacy(state)
});

const mapDispatchToProps = {
  
};

export default connect(mapStateToProps, mapDispatchToProps)(SelfStakingContainer);
