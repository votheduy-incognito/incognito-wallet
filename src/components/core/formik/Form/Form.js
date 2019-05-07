import React from 'react';
import PropTypes from 'prop-types';
import { Formik } from 'formik';
import { View, FormSubmitButton } from '@src/components/core';

const Form = (props) => {
  const { initialValues, onSubmit, children, viewProps, formRef,  ...formikProps } = props;
  const childrens = children?.constructor === Array ? [...children] : [children];
  return (
    <Formik
      initialValues={initialValues}
      onSubmit={onSubmit}
      enableReinitialize
      {...formikProps}
    >
      {
        (form) => {
          if (typeof formRef === 'function') {
            formRef(form);
          }

          const { handleChange, handleBlur, handleSubmit, values, errors } = form;
          return (
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
          );
        }
      }
    </Formik>
  );
};

Form.propTypes = {
  initialValues: PropTypes.object,
  onSubmit: PropTypes.func,
  children: PropTypes.oneOf(PropTypes.arrayOf(PropTypes.node), PropTypes.node),
  viewProps: PropTypes.object,
  formRef: PropTypes.func
};

export default Form;