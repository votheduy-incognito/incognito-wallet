/* eslint-disable import/no-cycle */
import React from 'react';
import ErrorBoundary from '@src/components/ErrorBoundary';
import { useDispatch } from 'react-redux';
import { change, focus } from 'redux-form';
import { formName } from './Form';

const enhance = (WrappedComp) => (props) => {
  const dispatch = useDispatch();
  const onChangeField = (value, field) => {
    dispatch(change(formName, field, String(value)));
    dispatch(focus(formName, field));
  };
  return (
    <ErrorBoundary>
      <WrappedComp {...{ ...props, onChangeField }} />
    </ErrorBoundary>
  );
};

export default enhance;
