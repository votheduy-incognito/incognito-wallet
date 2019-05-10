import React from 'react';
import { connect } from 'formik';

type Props = {
  onChange: Function,
  formik: Object,
};

class Effect extends React.Component<Props> {
  componentDidUpdate(prevProps) {
    const { values, touched, errors, isSubmitting } = prevProps.formik;
    const {
      values: nextValues,
      touched: nextTouched,
      errors: nextErrors,
      isSubmitting: nextIsSubmitting,
    } = this.props.formik;
    if (this.props.formik !== prevProps.formik) {
      if (typeof this.props.onChange === 'function') {
        this.props.onChange(
          {
            values,
            touched,
            errors,
            isSubmitting,
          },
          {
            values: nextValues,
            touched: nextTouched,
            errors: nextErrors,
            isSubmitting: nextIsSubmitting,
          },
        );
      }
    }
  }

  // eslint-disable-next-line
  render() {
    return null;
  }
}

export default connect(Effect);