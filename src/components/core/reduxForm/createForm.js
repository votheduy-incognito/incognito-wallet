import React from 'react';
import PropTypes from 'prop-types';
import { reduxForm } from 'redux-form';
import View from '../View';


const Form = ({ children, style, ...props }) => (
  <View style={style}>
    {typeof children === 'function' ? children(props) : children}
  </View>
);

const createForm = (formName, config = {}) => {
  return reduxForm({
    form: formName,
    ...config // https://redux-form.com/6.6.3/docs/api/reduxform.md/
  })(Form);
};

Form.propTypes = {
  children: PropTypes.oneOfType([PropTypes.func, PropTypes.node]).isRequired,
};

export default createForm;

/**
 * 
const submit = values => console.log(values);

const SimpleForm = (props) => {
  return (
    <Form>
      {({ handleSubmit }) => {
        return (
          <>
            <Field name="firstName" component={inputField} />
            <Button title='Submit' onPress={handleSubmit(submit)} />
          </>
        );
      }}
    </Form>
  );
};
 */