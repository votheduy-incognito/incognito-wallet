import React from 'react';
import PropTypes from 'prop-types';
import { Formik } from 'formik';
import { View, FormSubmitButton } from '@core';

const Form = (props) => {
  const { initialValues, onSubmit, children, viewProps, ...formikProps } = props;
  const childrens = children?.constructor === Array ? [...children] : [children];
  return (
    <Formik
      initialValues={initialValues}
      onSubmit={onSubmit}
      {...formikProps}
    >
      {
        ({ handleChange, handleBlur, handleSubmit, values, errors }) => (
          <View {...viewProps}>
            {
              React.Children.map(childrens, field => {
                if (field?.type === FormSubmitButton) {
                  return (
                    React.cloneElement(field, {
                      handleSubmit
                    })
                  );
                }
                return (
                  React.cloneElement(field, {
                    handleChange,
                    handleBlur,
                    value: field?.props?.name && values[field.props.name],
                    error: field?.props?.name && errors[field?.props?.name]
                  })
                );
              })
            }
          </View>
        )
      }
    </Formik>
  );
};

Form.propTypes = {
  initialValues: PropTypes.object,
  onSubmit: PropTypes.func,
  children: PropTypes.oneOf(PropTypes.arrayOf(PropTypes.node), PropTypes.node),
  viewProps: PropTypes.object
};

export default Form;