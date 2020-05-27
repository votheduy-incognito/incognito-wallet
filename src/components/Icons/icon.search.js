import React from 'react';
import { Image } from 'react-native';
import srcSearchIcon from '@src/assets/images/icons/search.png';
import PropTypes from 'prop-types';

const SearchIcon = ({ source = srcSearchIcon, style = null }) => {
  return (
    <Image
      source={source}
      style={[
        {
          width: 18,
          height: 18,
        },
        style,
      ]}
    />
  );
};

SearchIcon.propTypes = {
  source: PropTypes.string,
  style: PropTypes.any,
};

export default SearchIcon;
