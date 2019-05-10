import React from 'react';
import { connect } from 'formik';
import _ from 'lodash';

type Props = {
  onChange: Function,
  formik: Object,
};

class Effect extends React.Component<Props> {
  constructor(props) {
    super(props);

    this.onChange = props.onChange && _.debounce(::props.onChange, 300);
  }
  componentDidUpdate(prevProps) {
    const { values, touched, errors, isSubmitting } = prevProps.formik;
    const {
      values: nextValues,
      touched: nextTouched,
      errors: nextErrors,
      isSubmitting: nextIsSubmitting,
    } = this.props.formik;
    if (this.props.formik !== prevProps.formik) {
      if (typeof this.onChange === 'function') {
        this.onChange(
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