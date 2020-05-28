import { TextInput } from '@src/components/Input';
import React from 'react';
import { StyleSheet } from 'react-native';
import { FONT, COLORS } from '@src/styles';
import { createForm } from '@components/core/reduxForm';
import { Field } from 'redux-form';
import PropTypes from 'prop-types';

const styled = StyleSheet.create({
  searchBox: {
    marginRight: 30,
    flex: 1,
  },
  containerInputStyle: {
    borderBottomWidth: 0,
    maxWidth: '100%',
    width: '100%',
  },
  input: {
    fontFamily: FONT.NAME.medium,
    fontSize: FONT.SIZE.medium,
    color: COLORS.black,
    textAlignVertical: 'top',
    paddingBottom: 0,
  },
});

export const searchBoxConfig = {
  form: 'searchFormHeader',
  searchBox: 'search',
};

const Form = createForm(searchBoxConfig.form);

const SearchInput = props => {
  const { input, ...rest } = props;
  return (
    <TextInput
      onChangeText={input?.onChange}
      onBlur={input?.onBlur}
      onFocus={input?.onFocus}
      value={input?.value}
      style={styled.input}
      autoFocus
      containerInputStyle={styled.containerInputStyle}
      {...rest}
    />
  );
};

const SearchBox = () => {
  return (
    <Form style={styled.searchBox}>
      <Field
        name={searchBoxConfig.searchBox}
        component={props => {
          const { input, ...rest } = props;
          return (
            <TextInput
              onChangeText={input?.onChange}
              onBlur={input?.onBlur}
              onFocus={input?.onFocus}
              value={input?.value}
              style={styled.input}
              autoFocus
              containerInputStyle={styled.containerInputStyle}
              {...rest}
            />
          );
        }}
      />
    </Form>
  );
};

SearchInput.props = {
  input: PropTypes.any.isRequired,
};

SearchBox.propTypes = {};

export default React.memo(SearchBox);
