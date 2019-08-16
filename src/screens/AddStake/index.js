import BaseScreen from '@screens/BaseScreen';
import _ from 'lodash';
import React from 'react';
import { ScrollView, Text, View,TextInput } from 'react-native';
import { connect } from 'react-redux';
import { Button,ButtonGroup } from 'react-native-elements';
import { scaleInApp } from '@src/styles/TextStyle';
import StakeValidatorTypeSelector from '@src/components/StakeValidatorTypeSelector/StakeValidatorTypeSelector';
import style, { tab_border_radius } from './styles';

const buttons = ['Stake', 'Borrow & Stake'];
export const TAG = 'AddStake';

class AddStake extends BaseScreen {
  constructor(props) {
    super(props);

    this.state = {
      loading: true,
      errorText:'',
      selectedIndex:0
    };
  }

  static getDerivedStateFromProps(nextProps, prevState) {
    return null;
  }

  componentDidMount = async ()=> {
    super.componentDidMount();
  }
  updateIndex=(selectedIndex)=> {
    this.setState({selectedIndex});
  }
  renderTabs=()=>{
    const { selectedIndex } = this.state;
    return(
      <ButtonGroup
        onPress={this.updateIndex}
        selectedIndex={selectedIndex}
        buttons={buttons}
        textStyle={style.tab_text}
        buttonStyle={style.tab_button}
        selectedTextStyle={style.tab_text_selected}
        selectedButtonStyle={style.tab_button_selected}
        containerStyle={style.tab_container}
      />
    );
  }

  render() {
    const { loading ,validAmount,errorText,selectedIndex} = this.state;

    return (
      <View style={style.container}>
        {this.renderTabs()}
        <View style={style.group}>
          {selectedIndex ==1 &&(
            <Text style={style.label}>
          Borrow & Stake program is a special program designed for Node Device’s Owner
            </Text>
          )}
          <StakeValidatorTypeSelector />
          
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
