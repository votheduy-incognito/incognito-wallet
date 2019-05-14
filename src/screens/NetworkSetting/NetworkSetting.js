import React, { Component } from 'react';
import PropTypes from 'prop-types';
import { Container, ScrollView } from '@src/components/core';
import NetworkItem, { networkItemShape } from './NetworkItem';

class NetworkSetting extends Component {
  constructor() {
    super();
    this.state = {
      activeNetworkId: null,
      expandedNetworkId: null
    };
  }

  componentDidMount() {
    const { networks } = this.props;
    this.findDefaultNetwork(networks);
  }

  findDefaultNetwork = (networks) => {
    const found = networks?.find(_ => _.default);
    this.setState({ activeNetworkId: found?.id });
  }

  handleActive = network => {
    const { setDefaultNetwork } = this.props;
    setDefaultNetwork(network);
    this.setState({ activeNetworkId: network?.id });
  }

  handleExpand = networkId => {
    this.setState(({ expandedNetworkId }) => ({
      // operating like a toggle
      expandedNetworkId: networkId === expandedNetworkId ? null : networkId
    }));
  }

  render() {
    const { activeNetworkId, expandedNetworkId } = this.state;
    const { networks } = this.props;

    return (
      <ScrollView>
        <Container>
          {
            networks && networks.map(network => (
              <NetworkItem
                key={network?.id}
                network={network} 
                active={network?.id === activeNetworkId}
                expanded={network?.id === expandedNetworkId}
                onActive={() => this.handleActive(network)}
                onExpand={() => this.handleExpand(network?.id)}
              />
            ))
          }
        </Container>
      </ScrollView>
    );
  }
}

NetworkSetting.defaultProps = {
  networks: []
};


NetworkSetting.propTypes = {
  setDefaultNetwork: PropTypes.func,
  networks: PropTypes.arrayOf(networkItemShape)
};

export default NetworkSetting;