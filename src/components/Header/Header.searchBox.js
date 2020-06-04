import { TextInput } from '@src/components/Input';
import React from 'react';
import { StyleSheet } from 'react-native';
import PropTypes from 'prop-types';
import { ScreenWidth } from '@src/utils/devices';

const styled = StyleSheet.create({
  searchBox: {
    marginRight: 20,
    width: ScreenWidth * 0.62,
    height: 30,
    backgroundColor: 'red'
  },
});

export const searchBoxConfig = {
  form: 'searchFormHeader',
  searchBox: 'search',
};

const SearchBox = (props) => {
  return (
    <TextInput
      style={styled.searchBox}
      containerInputStyle={styled.searchBox}
      onChangeText={props?.onChange}
      onBlur={props?.onSubmit}
      onSubmitEditting={props?.onSubmit}
    />
  );
};

SearchBox.propTypes = {
  onChange: PropTypes.func.isRequired,
  onSubmit: PropTypes.func.isRequired,
};

export default React.memo(SearchBox);
