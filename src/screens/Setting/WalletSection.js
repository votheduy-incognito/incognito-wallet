import React from 'react';
import PropTypes from 'prop-types';
import { connect } from 'react-redux';
import { accountSeleclor } from '@src/redux/selectors';
import FIcons from 'react-native-vector-icons/FontAwesome';
import ROUTE_NAMES from '@src/router/routeNames';
import Section from './Section';

const WalletSection = ({ navigation, defaultAccount }) => {
  const items = [
    {
      title: 'Account Management',
      desc: `Current account: ${defaultAccount?.name ?? 'N/A'}`,
      icon: <FIcons name='user-circle' size={24} />,
      handlePress: () => {
        navigation.navigate(ROUTE_NAMES.UserHeaderBoard);
      }
    }
  ];
  return (
    <Section
      label='Wallet'
      items={items}
    />
  );
};

WalletSection.propTypes = {
  navigation: PropTypes.object.isRequired,
  defaultAccount: PropTypes.object.isRequired,
};

const mapState = state => ({
  defaultAccount: accountSeleclor.defaultAccount(state),
});

export default connect(mapState)(WalletSection);