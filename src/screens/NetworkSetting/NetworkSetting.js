import React, { Component } from 'react';
import PropTypes from 'prop-types';
import { Container, ScrollView } from '@src/components/core';
import NetworkItem, { networkItemShape } from './NetworkItem';

class NetworkSetting extends Component {
  constructor() {
    super();
    this.state = {
      activeServerId: null,
      expandedServerId: null
    };
  }

  handleActive = serverId => {
    this.setState({ activeServerId: serverId });
  }

  handleExpand = serverId => {
    this.setState(({ expandedServerId }) => ({
      // operating like a toggle
      expandedServerId: serverId === expandedServerId ? null : serverId
    }));
  }

  render() {
    const { activeServerId, expandedServerId } = this.state;
    const { networks } = this.props;

    return (
      <ScrollView>
        <Container>
          {
            networks && networks.map(network => (
              <NetworkItem
                key={network?.id}
                network={network} 
                active={network?.id === activeServerId}
                expanded={network?.id === expandedServerId}
                onActive={() => this.handleActive(network?.id)}
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
  networks: [
    {
      id: 'local',
      name: 'Local',
      rpcServerAddress: 'http://localhost',
      username: null,
      password: null
    },
    {
      id: 'local2',
      name: 'Local2',
      rpcServerAddress: 'http://localhost2',
      username: null,
      password: null
    }
  ]
};


NetworkSetting.propTypes = {
  networks: PropTypes.arrayOf(networkItemShape)
};

export default NetworkSetting;