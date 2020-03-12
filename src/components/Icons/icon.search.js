import React from 'react';
import {Image} from 'react-native';
import srcSearchIcon from '@src/assets/images/icons/search.png';

const SearchIcon = () => {
  return (
    <Image
      source={srcSearchIcon}
      style={{
        width: 18,
        height: 18,
      }}
    />
  );
};

export default SearchIcon;
