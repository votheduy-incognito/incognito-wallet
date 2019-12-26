import React from 'react';
import PropTypes from 'prop-types';
import { Field, isValid } from 'redux-form';
import { connect } from 'react-redux';
import { debounce } from 'lodash';
import { Container, ScrollView, View, Text, Button, Toast } from '@src/components/core';
import { createForm, InputField, InputAreaField, validator, ImagePickerField } from '@src/components/core/reduxForm';
import { ExHandler } from '@src/services/exception';
import styles from './style';

const formName = 'submitPApp';


const Form = createForm(formName, {
  initialValues: null
});

const appNameValidate = [
  validator.required(),
  validator.maxLength(200),
];

const urlValidate = [
  validator.required(),
  validator.maxLength(200),
];

const shortDescValidate = [
  validator.required(),
  validator.minLength(20),
];

const longDescValidate = [
  validator.required(),
  validator.minLength(20),
];

const logoValidate = [
  validator.required(),
  validator.fileTypes(['image/png'])
];

const imageValidate = [
  validator.fileTypes(['image/png', 'image/jpg', 'image/jpeg'])
];

const imageRequiredValidate = [
  validator.required(),
  validator.fileTypes(['image/png', 'image/jpg', 'image/jpeg'])
];

class PappSubmit extends React.Component {
  constructor() {
    super();

    this.state = {
      isSubmitting: false
    };

    this.handleSubmitApp = debounce(this.handleSubmitApp, 300);
  }
  
  handleSubmitApp = async values => {
    try {
      this.setState({ isSubmitting: true });
      const { onSubmit, navigation } = this.props;
      const { appName, url, shortDesc, longDesc, logo, image1, image2, image3, image4, image5, contactWebsite, contactEmail } = values;
      const imageFiles = [];
      image1 && imageFiles.push(image1);
      image2 && imageFiles.push(image2);
      image3 && imageFiles.push(image3);
      image4 && imageFiles.push(image4);
      image5 && imageFiles.push(image5);
  
      const pappInfo = await onSubmit({
        title: appName,
        link: url,
        shortDescription: shortDesc,
        fullDescription: longDesc,
        logoFile: logo,
        imageFiles,
        contactWebsite: contactWebsite,
        contactEmail: contactEmail,
      });

      if (pappInfo) {
        const onSubmitted = navigation?.getParam('onSubmitted');

        if (typeof onSubmitted === 'function') {
          onSubmitted(pappInfo);
        }

        Toast.showSuccess('Your app was submited successfully');
      }
    } catch (e) {
      new ExHandler(e, 'Submit app failed').showErrorToast();
    } finally {
      this.setState({ isSubmitting: false });
    }
  }

  renderGroup = (name, children) => {
    return (
      <View style={styles.group}>
        <Text style={styles.groupName}>{name}</Text>
        <Container style={styles.groupContent}>
          {children}
        </Container>
      </View>
    );
  }

  render() {
    const { isFormValid } = this.props;
    const { isSubmitting } = this.state;

    return (
      <Form style={styles.container}>
        {({ handleSubmit }) => (
          <View style={styles.form}>
            <View style={styles.content}>
              <ScrollView>
                {
                  this.renderGroup('APP INFO', (
                    <>
                      <Field
                        component={InputField}
                        name='appName'
                        label='App name'
                        placeholder='Enter your app name'
                        style={styles.input}
                        validate={appNameValidate}
                      />
                      <Field
                        component={InputField}
                        name='url'
                        label='URL'
                        placeholder='Enter your app URL'
                        style={styles.input}
                        validate={urlValidate}
                      />
                      <Field
                        component={InputAreaField}
                        componentProps={{ multiline: true, numberOfLines: 10 }}
                        name='shortDesc'
                        placeholder='Short Description'
                        label='Short Description'
                        style={styles.input}
                        validate={shortDescValidate}
                        maxLength={80}
                      />
                      <Field
                        component={InputAreaField}
                        componentProps={{ multiline: true, numberOfLines: 10 }}
                        name='longDesc'
                        placeholder='Long Description'
                        label='Long Description'
                        style={styles.input}
                        maxLength={4000}
                        validate={longDescValidate}
                      />
                    </>
                  ))
                }
                {
                  this.renderGroup('RESOURCES', (
                    <>
                      <Text style={styles.imageSizeDesc}>* Image size should be 240px x 240px (width x height), 1000kb max size</Text>
                      <Field
                        component={ImagePickerField}
                        name='logo'
                        text={'Update your pApp\'s logo'}
                        textButton='Upload'
                        style={styles.input}
                        validate={logoValidate}
                        maxSize={50 * 1024 * 8} // 50kb
                      />
                      <Field
                        component={ImagePickerField}
                        name='image1'
                        text='Screenshot 1'
                        textButton='Upload'
                        style={styles.input}
                        validate={imageRequiredValidate}
                        maxSize={1000 * 1024 * 8} // 1000kb
                      />
                      {
                        [
                          { key: 'image2', label: 'Screenshot 2' },
                          { key: 'image3', label: 'Screenshot 3' },
                          { key: 'image4', label: 'Screenshot 4' },
                          { key: 'image5', label: 'Screenshot 5' }
                        ].map(({ key, label }) => (
                          <Field
                            key={key}
                            component={ImagePickerField}
                            name={key}
                            text={`${label} (optional)`}
                            textButton='Upload'
                            style={styles.input}
                            validate={imageValidate}
                            maxSize={1000 * 1024 * 8} // 1000kb
                          />
                        ))
                      }
                    </>
                  ))
                }
                {
                  this.renderGroup('OTHERS', (
                    <>
                      <Field
                        component={InputField}
                        name='contactName'
                        label='Creator'
                        placeholder='Enter creator name'
                        style={styles.input}
                      />
                      <Field
                        component={InputField}
                        name='contactWebsite'
                        label='Your website'
                        placeholder='Enter your your website'
                        style={styles.input}
                      />
                      <Field
                        component={InputField}
                        name='contactEmail'
                        label='Your Email'
                        placeholder='Enter your your email'
                        style={styles.input}
                      />
                    </>
                  ))
                }
              </ScrollView>
            </View>
            <Button title={isSubmitting ? 'Submitting' : 'Submit your app'} disabled={!isFormValid} style={styles.submitBtn} onPress={handleSubmit(this.handleSubmitApp)} isAsync isLoading={isSubmitting} />
          </View>
        )}
      </Form>
    );
  }
}

PappSubmit.defaultProps = {
  isFormValid: false,
};

PappSubmit.propTypes = {
  isFormValid: PropTypes.bool,
  navigation: PropTypes.object.isRequired,
  onSubmit: PropTypes.func.isRequired
};

const mapState = state => ({
  isFormValid: isValid(formName)(state),
});


export default connect(
  mapState,
)(PappSubmit);
