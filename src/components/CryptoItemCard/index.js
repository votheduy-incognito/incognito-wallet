import React, { Component } from 'react';
import PropTypes from 'prop-types';
import tokenData from '@src/constants/tokenData';
import CryptoItem from './CryptoItem';

class CryptoItemContainer extends Component {
  constructor() {
    super();

    this.state = { data: null };
  }

  componentDidMount() {
    const { token } = this.props;

    if (token) {
      this.getData(token);
    }
  }

  componentDidUpdate(prevProps) {
    const { token: oldToken } = prevProps;
    const { token } = this.props;

    if (oldToken?.symbol !== token?.symbol) {
      this.getData(token);
    }
  }

  getData = (token) => {
    const additionData = tokenData.DATA[token?.symbol] || tokenData.parse(token);
    const { metaData, ...othertokenData } = token;
    const data = {
      ...additionData,
      ...metaData,
      ...othertokenData
    };
    this.setState({ data });
  }

  handlePress = () => {
    const { onPress } = this.props;
    const { data } = this.state;
    if (typeof onPress === 'function') {
      onPress(data);
    }
  }

  render() {
    const { data } = this.state;
    const { token } = this.props;

    if (!data) return null;

    const cryptoItemProps = {
      ...this.props,
      fullName: data.fullName,
      name: data.name,
      amount: token?.amount,
      icon: data.icon,
      symbol: data.symbol,
      decimals: data.decimals,
      onPress: this.handlePress,
    };

    return (
      <CryptoItem
        {...cryptoItemProps}
      />
    );
  }
}

CryptoItemContainer.defaultProps = {
  onPress: null,
  token: null,
  style: null,
  isGettingBalance: false
};

CryptoItemContainer.propTypes = {
  onPress: PropTypes.func,
  token: PropTypes.object,
  isGettingBalance: PropTypes.bool,
  style: PropTypes.object
};

export default CryptoItemContainer;