import BaseScreen from '@screens/BaseScreen';
import _ from 'lodash';
import React from 'react';
import { ScrollView, Text, View } from 'react-native';
import { connect } from 'react-redux';
import styles from './styles';

export const TAG = 'TempToClone';

class TempToClone extends BaseScreen {
  constructor(props) {
    super(props);

    this.state = {
      loading: true,
    };
  }

  static getDerivedStateFromProps(nextProps, prevState) {
    return null;
  }

  componentDidMount = async ()=> {
    super.componentDidMount();
  }

  render() {
    const { loading } = this.state;

    return (
      <View style={styles.container}>
        <Text
          style={{
            color: 'white',
            fontSize: 18,
            marginTop: 80,
            alignSelf: 'center'
          }}
        >
          {TAG}
        </Text>
        
      </View>
    );
  }

  set loading(isLoading) {
    this.setState({
      loading: isLoading
    });
  }

}

TempToClone.propTypes = {};

TempToClone.defaultProps = {};
const mapStateToProps = state => ({});
const mapDispatchToProps = {};
export default connect(
  mapStateToProps,
  mapDispatchToProps
)(TempToClone);
