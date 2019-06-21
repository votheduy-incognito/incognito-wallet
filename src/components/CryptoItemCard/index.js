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
    const { tokenSymbol } = this.props;

    if (tokenSymbol) {
      this.getData(tokenSymbol);
    }
  }

  componentDidUpdate(prevProps) {
    const { tokenSymbol: oldTokenSymbol } = prevProps;
    const { tokenSymbol } = this.props;

    if (oldTokenSymbol !== tokenSymbol) {
      this.getData(tokenSymbol);
    }
  }

  getData = (tokenSymbol) => {
    const data = tokenData.DATA[tokenSymbol];
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

    if (!data) return null;

    const cryptoItemProps = {
      ...this.props,
      fullName: data.fullName,
      typeName: data.typeName,
      amount: data.amount,
      icon: data.icon,
      symbol: data.symbol,
      onPress: this.handlePress
    };

    return (
      <CryptoItem
        {...cryptoItemProps}
      />
    );
  }
}

CryptoItemContainer.defaultProps = {
  amount: 0,
  onPress: null,
  tokenSymbol: null,
  style: null,
  isGettingBalance: false
};

CryptoItemContainer.propTypes = {
  amount: PropTypes.number,
  onPress: PropTypes.func,
  tokenSymbol: PropTypes.string,
  isGettingBalance: PropTypes.bool,
  style: PropTypes.object
};

export default CryptoItemContainer;