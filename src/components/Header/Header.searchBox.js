import { TextInput } from '@src/components/Input';
import React from 'react';
import { StyleSheet } from 'react-native';
import { createForm } from '@components/core/reduxForm';
import { Field } from 'redux-form';
import PropTypes from 'prop-types';

const styled = StyleSheet.create({
  searchBox: {
    marginRight: 30,
    flex: 1,
  },
});

export const searchBoxConfig = {
  form: 'searchFormHeader',
  searchBox: 'search',
};

const Form = createForm(searchBoxConfig.form);

const SearchBox = (props) => {
  return (
    <Form style={styled.searchBox}>
      <Field
        name={searchBoxConfig.searchBox}
        component={componentProps => {
          const { input, ...rest } = componentProps;
          return (
            <TextInput
              onChangeText={input?.onChange}
              onBlur={input?.onBlur}
              onFocus={input?.onFocus}
              value={input?.value}
              autoFocus
              placeholder={props?.title || ''}
              {...rest}
            />
          );
        }}
      />
    </Form>
  );
};

SearchBox.propTypes = {
  title: PropTypes.string.isRequired
};

export default React.memo(SearchBox);
