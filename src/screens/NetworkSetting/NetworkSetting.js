import { Container, ScrollView } from '@src/components/core';
import DialogLoader from '@src/components/DialogLoader';
import { onClickView } from '@src/utils/ViewUtil';
import PropTypes from 'prop-types';
import React, { Component } from 'react';
import RNRestart from 'react-native-restart';
import NetworkItem, { networkItemShape } from './NetworkItem';

class NetworkSetting extends Component {
  constructor() {
    super();
    this.state = {
      activeNetworkId: null,
      expandedNetworkId: null,
      loading:false
    };
  }

  componentDidMount() {
    const { networks } = this.props;
    this.findDefaultNetwork(networks);
  }

  findDefaultNetwork = networks => {
    const found = networks?.find(_ => _.default);
    this.setState({ activeNetworkId: found?.id });
  };

  handleActive = async network => {
    const { setDefaultNetwork } = this.props;
    this.setState({loading:true});
    await setDefaultNetwork(network);
    this.setState({ loading:false },()=>{
      RNRestart.Restart();  
    });
    
    // clone data
    // this.setState({ activeNetworkId: network?.id,loading:false },()=>{
      
    // });
  };

  handleExpand = networkId => {
    
    // this.setState(({ expandedNetworkId }) => ({
    //   // operating like a toggle
    //   expandedNetworkId: networkId === expandedNetworkId ? null : networkId
    // }));
  };

  render() {
    const { activeNetworkId, expandedNetworkId,loading } = this.state;
    const { networks, reloadNetworks } = this.props;

    return (
      <ScrollView>
        <Container>
          {networks &&
            networks.map(network => network && (
              <NetworkItem
                key={network?.id}
                network={network}
                active={network?.id === activeNetworkId}
                expanded={network?.id === expandedNetworkId}
                onActive={onClickView(()=>this.handleActive(network))}
                onExpand={() => this.handleExpand(network?.id)}
                reloadNetworks={reloadNetworks}
              />
            ))}
        </Container>
        <DialogLoader loading={loading} />
      </ScrollView>
    );
  }
}

NetworkSetting.defaultProps = {
  networks: []
};
NetworkSetting.defaultProps = {
  setDefaultNetwork: undefined,
  networks: undefined
};
NetworkSetting.propTypes = {
  setDefaultNetwork: PropTypes.func,
  networks: PropTypes.arrayOf(networkItemShape)
};

export default NetworkSetting;
