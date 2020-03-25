import React, { Component } from 'react';
import PropTypes from 'prop-types';
import { View, TextInput } from '@src/components/core';
import { ExHandler, CustomError, ErrorCode } from '@src/services/exception';
import { COLORS } from '@src/styles';
import styles from './style';


class SearchForm extends Component {
  constructor() {
    super();
    this.state = {
      url: '',
    };
  }

  onChangeUrl = url => {
    this.setState({ url }); 
  }

  handleAddProtocol = () => {
    this.setState(({ url }) => {
      return { url: url ? url : 'http://' };
    }); 
  }

  urlValidator = (url) => {
    // eslint-disable-next-line
    if (!(/(http(s)?:\/\/)./g.test(url))) throw new CustomError(ErrorCode.paaps_invalid_daap_url);
    return true;
  }

  setUrl = (url) => {
    this.setState({ url });
  }

  getUrl = () => {
    const { url } = this.state;
    return url;
  }

  onSubmit = () => {
    try {
      const { url } = this.state;
      const { onGo } = this.props;

      if (this.urlValidator(url) && typeof onGo === 'function') {
        onGo({ url });
      }
    } catch (e) {
      new ExHandler(e, 'Sorry, we can not open this Papp.').showErrorToast();
    }
  }

  render() {
    const { url } = this.state;
    const { append } = this.props;
    
    return (
      <View style={styles.form}>
        <TextInput
          autoCapitalize='none'
          placeholder='Search or enter website URL'
          placeholderTextColor={COLORS.lightGrey4}
          style={styles.input}
          inputStyle={{ color: COLORS.black }}
          value={url}
          onChangeText={this.onChangeUrl}
          onFocus={this.handleAddProtocol}
          onSubmitEditing={this.onSubmit}
          returnKeyType='go'
        />
        {
          React.isValidElement(append) && append
        }
      </View>
    );
  }
}

SearchForm.defaultProps = {
  onGo: null,
  append: null
};

SearchForm.propTypes = {
  onGo: PropTypes.func,
  append: PropTypes.node
};

export default SearchForm;