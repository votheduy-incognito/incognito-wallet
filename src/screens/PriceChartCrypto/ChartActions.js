import React from 'react';
import PropTypes from 'prop-types';
import {
  View, Text, StyleSheet, TouchableOpacity, Dimensions
} from 'react-native';
import { BY_HOUR, BY_DAY, BY_WEEK, BY_MONTH, BY_YEAR } from './util';

const btnWidth = Math.round(Dimensions.get('window').width/7);

const ChartActions = ({ onPress, value }) => (
  <View style={styles.container}>
    <TouchableOpacity onPress={() => onPress(BY_HOUR)} style={value == BY_HOUR ? styles.btnActive : styles.btn}><Text style={value == BY_HOUR ? styles.btnText : styles.btnTextActive}>1H</Text></TouchableOpacity>
    <TouchableOpacity onPress={() => onPress(BY_DAY)} style={value == BY_DAY ? styles.btnActive : styles.btn}><Text style={value == BY_DAY ? styles.btnText : styles.btnTextActive}>24H</Text></TouchableOpacity>
    <TouchableOpacity onPress={() => onPress(BY_WEEK)} style={value == BY_WEEK ? styles.btnActive : styles.btn}><Text style={value == BY_WEEK ? styles.btnText : styles.btnTextActive}>Week</Text></TouchableOpacity>
    <TouchableOpacity onPress={() => onPress(BY_MONTH)} style={value == BY_MONTH ? styles.btnActive : styles.btn}><Text style={value == BY_MONTH ? styles.btnText : styles.btnTextActive}>Month</Text></TouchableOpacity>
    <TouchableOpacity onPress={() => onPress(BY_YEAR)} style={value == BY_YEAR ? styles.btnActive : styles.btn}><Text style={value == BY_YEAR ? styles.btnText : styles.btnTextActive}>Year</Text></TouchableOpacity>
    <TouchableOpacity style={styles.btn}><Text style={styles.btnTextActive}>Alltime</Text></TouchableOpacity>
  </View>
);

const styles = StyleSheet.create({
  container: {
    flexDirection: 'row',
    justifyContent: 'space-evenly',
    paddingTop: 10,
    paddingBottom: 20
  },
  btn: {
    width: btnWidth,
    backgroundcolor: '#FAFAFA',
    borderColor: '#F1F1F1',
    borderWidth: 1,
    borderRadius: 5,
    alignContent: 'center',
    paddingTop: 5,
    paddingBottom: 5,
    color: 'white',
    alignItems: 'center'
  },
  btnActive: {
    width: btnWidth,
    backgroundColor: '#121111',
    borderRadius: 5,
    alignContent: 'center',
    paddingTop: 5,
    paddingBottom: 5,
    color: 'white',
    textAlign: 'center',
    alignItems: 'center'
  },  
  btnText: {
    color: 'white',
    fontSize: 12
  },
  btnTextActive: {
    color: '#121111',
    fontSize: 12
  }
});

ChartActions.propTypes = {
  onPress: PropTypes.func.isRequired,
  value: PropTypes.number.isRequired
};

export default ChartActions;