import React from 'react';
import PropTypes from 'prop-types';
import OptionMenu from '../OptionMenu';

const WalletDetailOptionMenu = ({ menu, iconColor }) => {
  if (!menu || menu?.length === 0) return null;

  return <OptionMenu data={menu} iconProps={{ color: iconColor }} />;
};

WalletDetailOptionMenu.defaultProps = {
  menu: null,
  iconColor: null,
};

WalletDetailOptionMenu.propTypes = {
  iconColor: PropTypes.string,
  menu: PropTypes.arrayOf(PropTypes.shape({
    id: PropTypes.string,
    label: PropTypes.string.isRequired,
    desc: PropTypes.string,
    icon: PropTypes.element,
    handlePress: PropTypes.func
  }))
};

export default WalletDetailOptionMenu;
