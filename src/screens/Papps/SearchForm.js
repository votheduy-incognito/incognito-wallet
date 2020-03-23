import React, { Component } from 'react';
import PropTypes from 'prop-types';
import { Button, View, TextInput } from '@src/components/core';
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

  render() {
    const { url } = this.state;
    const { onGo } = this.props;
    
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
          returnKeyType='go'
        />
        <Button title='GO' style={styles.submitBtn} onPress={() => onGo && onGo({ url })} />
      </View>
    );
  }
}

SearchForm.defaultProps = {
  onGo: null
};

SearchForm.propTypes = {
  onGo: PropTypes.func
};

export default SearchForm;