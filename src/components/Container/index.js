import images from '@src/assets';
import PropTypes from 'prop-types';
import React from 'react';
import { Image, ScrollView, View } from 'react-native';
import _ from 'lodash';
import styles from './style';
/**
* @augments {Component<{  headerBarStyle:object,  isShowHeader:boolean,  onPressLeft:Function,  onPressRight:Function,  styleContainScreen:object,  styleRoot:object,  backgroundTop:object>}
*/
class Container extends React.Component {
  constructor(props) {
    super(props);
    this.state = {
      isShowHeader: true
    };
  }

  static getDerivedStateFromProps(nextProps, prevState) {
    if (nextProps?.isShowHeader !== prevState.isShowHeader) {
      return {
        isShowHeader: nextProps?.isShowHeader
      };
    }
    return null;
  }

  componentDidMount() {}

  render() {
    const { isShowHeader } = this.state;
    const {
      children,
      styleRoot,
      styleContainScreen,
      headerBarStyle = {},
      backgroundTop
    } = this.props;

    const bgSource = backgroundTop?.source ?? images.bgTop;

    return (
      <ScrollView
        scrollEnabled={false}
        contentContainerStyle={[styles.root, styleRoot]}
        keyboardShouldPersistTaps="handled"
      >
        <Image
          resizeMode="cover"
          style={[styles.bgTop,backgroundTop.style]}
          source={_.isInteger(bgSource) && bgSource == 0 ?undefined:bgSource}
        />
        <View style={styles.container}>
          {/* {isShowHeader && (
            <HeaderBar
              ref={(headerBar: HeaderBar) => {
                this.headerBarView = headerBar;
              }}
              title={headerBarStyle ? headerBarStyle.title : ''}
              onPressLeft={headerBarStyle.onPressLeft}
              onPressRight={headerBarStyle.onPressRight}
              style={{
                position: 'absolute'
              }}
            />
          )} */}
          <View style={[styles.mainContent, styleContainScreen]}>
            {children}
          </View>
        </View>
      </ScrollView>
    );
  }
}
Container.defaultProps = {
  isShowHeader: true,
  headerBarStyle: {
    title: '',
    onPressLeft: undefined,
    onPressRight: undefined
  },
  backgroundTop:{
    source:images.bgTop,
    style:undefined
  },
  styleRoot: {},
  styleContainScreen: {}
};
Container.propTypes = {
  headerBarStyle: PropTypes.object,
  isShowHeader: PropTypes.bool,
  onPressLeft: PropTypes.func,
  onPressRight: PropTypes.func,
  styleContainScreen: PropTypes.object,
  styleRoot: PropTypes.object,
  backgroundTop:PropTypes.object
};
export default Container;
