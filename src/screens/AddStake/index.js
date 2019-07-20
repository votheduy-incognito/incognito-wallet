import BaseScreen from '@screens/BaseScreen';
import _ from 'lodash';
import React from 'react';
import { ScrollView, Text, View,TextInput } from 'react-native';
import { connect } from 'react-redux';
import { Button } from 'react-native-elements';
import style from './styles';

export const TAG = 'AddStake';

class AddStake extends BaseScreen {
  constructor(props) {
    super(props);

    this.state = {
      loading: true,
      errorText:''
    };
  }

  static getDerivedStateFromProps(nextProps, prevState) {
    return null;
  }

  componentDidMount = async ()=> {
    super.componentDidMount();
  }

  render() {
    const { loading ,validAmount,errorText} = this.state;

    return (
      <View style={style.container}>
        <View style={style.group}>
          <Text style={style.label}>
            Amount
          </Text>
          <Text style={style.errorText}>{errorText}</Text>
          <TextInput
            underlineColorAndroid="transparent"
            style={style.input}
            placeholder="1.0"
            maxLength={10}
            numberOfLines={1}
            keyboardType="numeric"
          />
          <Button
            titleStyle={style.button_text}
            buttonStyle={style.button}
            title='Stake'
          />
        </View>
      </View>
    );
  }

  set loading(isLoading) {
    this.setState({
      loading: isLoading
    });
  }

}

AddStake.propTypes = {};

AddStake.defaultProps = {};
const mapStateToProps = state => ({});
const mapDispatchToProps = {};
export default connect(
  mapStateToProps,
  mapDispatchToProps
)(AddStake);
