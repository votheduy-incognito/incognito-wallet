import React, { useState } from 'react';
import PropTypes from 'prop-types';
import { Formik } from 'formik';
import Effect from './Effect';
import { View, FormSubmitButton, FormTextField, CheckBoxField, PickerField } from '@src/components/core';

const isFormField = (com = throw new Error('Must be a React component')) => [
  FormTextField,
  CheckBoxField,
  PickerField
].includes(com.type);

const injectFieldToChildren = ({ handleChange, handleSubmit, handleBlur, values, errors, children, isLoading }) => {
  const childrens = children?.constructor === Array ? [...children] : [children];
  const injectChildren = (field, children) => React.cloneElement(field, {
    children: injectFieldToChildren({ handleChange, handleSubmit, handleBlur, values, errors, children })
  });

  return  React.Children.map(childrens, field => {
    if (field?.type === FormSubmitButton) {
      return (
        React.cloneElement(field, {
          handleSubmit,
          isLoading
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

const CustomForm = (props) => {
  const { initialValues, onSubmit, children, viewProps, formRef, onFormChange, ...formikProps } = props;
  const [ isLoading, setLoading ] = useState(false);

  const handleOnSubmit = (...args) => {
    if (typeof onSubmit === 'function') {
      const submitted = onSubmit(...args);
      if (submitted instanceof Promise) {
        setLoading(true);
        submitted.finally(() => setLoading(false));
      }

      return submitted;
    }
  };

  return (
    <Formik
      initialValues={initialValues}
      onSubmit={handleOnSubmit}
      enableReinitialize
      {...formikProps}
      render={(form) => {
        if (typeof formRef === 'function') {
          formRef(form);
        }

        const { handleChange, handleBlur, handleSubmit, values, errors } = form;
        return (
          <View {...viewProps}>
            <Effect onChange={onFormChange} />
            {
              injectFieldToChildren({ handleChange, handleSubmit, handleBlur, values, errors, children, isLoading })
            }
          </View>
        );
      }}
    >
    </Formik>
  );
};

CustomForm.propTypes = {
  initialValues: PropTypes.object,
  onSubmit: PropTypes.func,
  children: PropTypes.oneOf(PropTypes.arrayOf(PropTypes.node), PropTypes.node),
  viewProps: PropTypes.object,
  formRef: PropTypes.func,
  onFormChange: PropTypes.func
};

export default CustomForm;