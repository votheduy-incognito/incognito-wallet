import React from 'react';
import PropTypes from 'prop-types';
import OptionMenu from '../OptionMenu';

const WalletDetailOptionMenu = ({ menu }) => {
  if (!menu || menu?.length === 0) return null;

  return <OptionMenu data={menu} />;
};

WalletDetailOptionMenu.defaultProps = {
  menu: null
};

WalletDetailOptionMenu.propTypes = {
  menu: PropTypes.arrayOf(PropTypes.shape({
    id: PropTypes.string,
    label: PropTypes.string.isRequired,
    desc: PropTypes.string,
    icon: PropTypes.element,
    handlePress: PropTypes.func
  }))
};

export default WalletDetailOptionMenu;
