import images from '@assets/images';
import PropTypes from 'prop-types';
import React from 'react';
import { Image, Text, TouchableOpacity, View } from 'react-native';
import { Header } from 'react-native-elements';
import { connect } from 'react-redux';
import styles from './style';

class HeaderBar extends React.Component {
  constructor(props) {
    super(props);
  }

  get leftView() {
    return this.leftView;
  }

  render() {
    const { title, onPressLeft, onPressRight } = this.props;
    return (
      <Header
        statusBarProps={{ barStyle: 'light-content', hidden: true }}
        barStyle="light-content"
        leftContainerStyle={{ flex: 0 }}
        rightContainerStyle={{ flex: 0 }}
        centerContainerStyle={{ flex: 1 }}
        backgroundColor="transparent"
        containerStyle={styles.container}
      >
        <TouchableOpacity
          style={{ opacity: onPressLeft ? 100 : 0 }}
          onPress={onPressLeft}
        >
          <Image
            style={styles.bt_left_right}
            ref={leftView => {
              this.leftView = leftView;
            }}
            source={images.ic_back}
          />
        </TouchableOpacity>
        <View style={styles.containerText}>
          <Text numberOfLines={2} style={styles.text}>
            {title}
          </Text>
        </View>
        {onPressRight && (
          <TouchableOpacity onPress={onPressRight}>
            <Image
              style={styles.bt_left_right}
              source={images.ic_next}
              ref={rightView => {
                this.rightView = rightView;
              }}
            />
          </TouchableOpacity>
        )}
      </Header>
    );
  }
}

HeaderBar.defaultProps = {
  title: '',
  onPressLeft: () => {},
  onPressRight: undefined
};
HeaderBar.propTypes = {
  title: PropTypes.string,
  onPressLeft: PropTypes.func,
  onPressRight: PropTypes.func
};

const mapStateToProps = state => ({});
const mapDispatchToProps = {};

export default connect(
  mapStateToProps,
  mapDispatchToProps
)(HeaderBar);
