import React from 'react';
import PropTypes from 'prop-types';
import { Button } from '@core';

const FormSubmitButton = (props) => {
  const { handleSubmit, ...btnProps } = props;
  return (
    <Button
      {...btnProps}
      onPress={handleSubmit}
    />
  );
};

FormSubmitButton.propTypes = {
  handleSubmit: PropTypes.func
};

export default FormSubmitButton;