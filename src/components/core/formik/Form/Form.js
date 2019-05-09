import React from 'react';
import PropTypes from 'prop-types';
import { Formik } from 'formik';
import { View, FormSubmitButton, FormTextField, CheckBoxField, PickerField } from '@src/components/core';

const isFormField = (com = throw new Error('Must be a React component')) => [
  FormTextField,
  CheckBoxField,
  PickerField
].includes(com.type);

const injectFieldToChildren = ({ handleChange, handleSubmit, handleBlur, values, errors, children }) => {
  const childrens = children?.constructor === Array ? [...children] : [children];
  const injectChildren = (field, children) => React.cloneElement(field, {
    children: injectFieldToChildren({ handleChange, handleSubmit, handleBlur, values, errors, children })
  });

  return  React.Children.map(childrens, field => {
    if (field?.type === FormSubmitButton) {
      return (
        React.cloneElement(field, {
          handleSubmit
        })
      );
    }

    if (isFormField(field)) {
      return (
        React.cloneElement(field, {
          handleChange,
          handleBlur,
          value: field?.props?.name && values[field.props.name],
          error: field?.props?.name && errors[field?.props?.name],
        })
      );
    }

    if (field?.props?.children) {
      return injectChildren(field, field.props.children);
    }
    return field;
  });
};

const Form = (props) => {
  const { initialValues, onSubmit, children, viewProps, formRef,  ...formikProps } = props;
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
                injectFieldToChildren({ handleChange, handleSubmit, handleBlur, values, errors, children })
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