import React from 'react';
import PropTypes from 'prop-types';
import OptionMenu from '@components/OptionMenu';
import { View } from '@components/core';
import { Icon } from 'react-native-elements';
import COLORS from '@src/styles/colors';
import styles from './style';
import withTokenSelect from './TokenSelect.enhance';

const TokenSelect = props => {
  const {
    size,
    style,
    iconStyle,
    toggleStyle,
    menu,
    handleClearSearch,
    handleSearch,
  } = props;
  return (
    <View styles={styles.container}>
      <OptionMenu
        data={menu}
        title="SELECT TOKEN"
        placeholder="Name or Symbol"
        onSearch={handleSearch}
        onClose={handleClearSearch}
        isDropDown
        toggleStyle={toggleStyle}
        style={[styles.select, style]}
        icon={(
          <View style={[styles.iconContainer, iconStyle]}>
            <Icon
              name="chevron-down"
              size={size}
              type="material-community"
              color={COLORS.primary}
            />
          </View>
        )}
      />
    </View>
  );
};

TokenSelect.propTypes = {
  size: PropTypes.number,
  style: PropTypes.object,
  iconStyle: PropTypes.object,
  toggleStyle: PropTypes.object,
  menu: PropTypes.array.isRequired,
  handleClearSearch: PropTypes.func.isRequired,
  handleSearch: PropTypes.func.isRequired,
};

TokenSelect.defaultProps = {
  size: 30,
  style: null,
  iconStyle: null,
  toggleStyle: null,
};

export default withTokenSelect(TokenSelect);
