
/**
 * @providesModule DialogLoader
 */
import React, { Component } from 'react';
import {
  StyleSheet,
  View,
  Modal,
  ActivityIndicator,
  Text
} from 'react-native';
import PropTypes from 'prop-types';


/**
* @augments {Component<{  content:string,  loading:boolean>}
*/
class DialogLoader extends Component {
  constructor(props) {
    super(props);
  }
  render() {
    const {
      loading,
      content,
      ...attributes
    } = this.props;
    var isDisplayContent = false;
    if (content){
      isDisplayContent = true;
    }
    const height = isDisplayContent > 0 ? 150 : 50;
    const width = isDisplayContent > 0 ? (height + 30) : 50;
    return (
      <Modal
        transparent
        animationType="none"
        visible={loading}
        onRequestClose={() => {console.log('close modal');}}
      >
        <View style={styles.modalBackground}>
          <View style={[styles.activityIndicatorWrapper, {height: height, width: width, marginLeft: 5, marginRight: 5, marginTop: 5}]}>
            {isDisplayContent > 0 && <Text style={{textAlign: 'center',fontWeight:'600', marginLeft: 5, marginRight:5 }}>{content}</Text>}
            <ActivityIndicator
              animating={loading}
            />
          </View>
        </View>
      </Modal>
    );
  }
}

DialogLoader.propTypes = {
  content: PropTypes.string,
  loading: PropTypes.bool
};
DialogLoader.defaultProps = {
  loading: true,
  content: ''
};


const styles = StyleSheet.create({
  modalBackground: {
    flex: 1,
    alignItems: 'center',
    flexDirection: 'column',
    justifyContent: 'space-around',
    backgroundColor: '#00000040'
  },
  activityIndicatorWrapper: {
    backgroundColor: '#FFFFFF',
    // height: 50,
    // width: 50,
    borderRadius: 10,
    display: 'flex',
    alignItems: 'center',
    justifyContent: 'space-around'
  }
});

export default DialogLoader;
