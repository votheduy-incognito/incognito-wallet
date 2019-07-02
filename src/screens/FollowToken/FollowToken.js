import React, { Component } from 'react';
import PropTypes from 'prop-types';
import { TextInput, Container, ScrollView, Button, Toast } from '@src/components/core';
import _ from 'lodash';
import ListToken, { tokenShape } from './ListToken';
import { followTokenStyle } from './style';

class FollowToken extends Component {
  constructor(props) {
    super(props);
    this.state = {
      filteredTokens: null,
      followed: []
    };
  }

  setTokenList = tokenList => {
    this.setState({ filteredTokens: tokenList });
  }

  handleAddFollow = token => {
    if (!token?.id) return;

    const { followed } = this.state;
    const result = [...followed];
    const removed = _.remove(result, _token => _token?.id === token?.id);
    if (removed?.length === 0) {
      result.push(token);
    } 
    this.setState({ followed: result });
  }

  handleChangeText = text => {
    const { tokenList } = this.props;
    let filteredTokens = [];
    
    if (!text) {
      filteredTokens = tokenList;
    }
    
    filteredTokens = tokenList?.filter(token => [token?.name, token?.id].join(' ')?.toUpperCase()?.includes(String(text).toUpperCase()));

    this.setState({ filteredTokens });
  }

  handleSaveFollow = () => {
    const { handleAddFollowToken } = this.props;
    const { followed } = this.state;

    if (followed?.length === 0) {
      Toast.showWarning('Please select at least one token to follow');
      return;
    }

    handleAddFollowToken(followed);
  }

  render() {
    const { filteredTokens, followed } = this.state;
    const { tokenList } = this.props;

    return (
      <Container style={followTokenStyle.container}>
        <TextInput onChangeText={this.handleChangeText} style={followTokenStyle.input} placeholder='Token name, token ID' />
        <ScrollView style={followTokenStyle.tokenList}>
          <ListToken
            tokenList={filteredTokens || tokenList}
            onFollow={this.handleAddFollow}
            followedList={followed}
          />
        </ScrollView>
        <Button title='FOLLOW' onPress={this.handleSaveFollow} style={followTokenStyle.followBtn} />
      </Container>
    );
  }
}

FollowToken.propTypes = {
  tokenList: PropTypes.arrayOf(tokenShape),
  handleAddFollowToken: PropTypes.func
};

export default FollowToken;