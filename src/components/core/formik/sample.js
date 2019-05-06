import React from 'react';
import Form from './Form';
import FormTextField from './TextField';
import FormSubmitButton from './SubmitButton';
import { object, string } from 'yup';

const formValidate = object().shape({
  password: string()
    .required('Required!')
});

const styleSheet = {
  // style 
};

const Sample = () => (
  <Form onSubmit={(formValues) => console.log(formValues)} viewProps={{ style: styleSheet.form }} validationSchema={formValidate}>
    <FormTextField name='password' placeholder='Enter your password' textContentType='password' secureTextEntry />
    <FormSubmitButton title='Submit' style={styleSheet.submitBtn} />
  </Form>
);

export default Sample;