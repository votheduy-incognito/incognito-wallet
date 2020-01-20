import React, { PureComponent } from 'react';
import PropTypes from 'prop-types';
import { StyleSheet } from 'react-native';
import { SafeAreaView } from 'react-navigation';
import { THEME } from '@src/styles';

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: THEME.header.backgroundColor,
    // paddingTop: (Platform.OS === 'android' && StatusBar.currentHeight > 24) ? StatusBar.currentHeight : 0
  }
});

class AppScreen extends PureComponent {
  render() {
    const { children } = this.props;
    return (
      <SafeAreaView style={styles.container} forceInset={{ top: 'never', bottom: 'never' }}>
        {children}
      </SafeAreaView>
    );
  }
}

AppScreen.propTypes = {
  children: PropTypes.oneOfType([ PropTypes.element, PropTypes.arrayOf(PropTypes.element) ]).isRequired
};

export default AppScreen;
