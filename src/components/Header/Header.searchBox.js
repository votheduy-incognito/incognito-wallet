import { TextInput } from '@src/components/Input';
import React from 'react';
import { StyleSheet } from 'react-native';
import { createForm } from '@components/core/reduxForm';
import { Field } from 'redux-form';

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
              autoFocus
              {...rest}
            />
          );
        }}
      />
    </Form>
  );
};

SearchBox.propTypes = {};

export default React.memo(SearchBox);
