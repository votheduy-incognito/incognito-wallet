import React from 'react';
import PropTypes from 'prop-types';
import { Dimensions } from 'react-native';
import { TabView as Tab, SceneMap } from 'react-native-tab-view';

class TabView extends Tab {
  constructor(props) {
    super(props);
    this.state = {
      index: undefined
    };
  }

  getNavigationState = (data =  throw new Error('Missing data'), defaultIndex = 0) => {
    const routes = data.map((_data = {}) => ({
      key: _data.key,
      title: _data.title
    }));

    return {
      index: defaultIndex,
      routes
    };
  }

  getRenderScene = (data =  throw new Error('Missing data')) => {
    const screens = {};
    data.forEach((_data = {}) => {
      screens[_data.key] = _data.screen;
    });

    return SceneMap(screens);
  }

  handleIndexChange = index => this.setState({ index });

  render() {
    const { data, defaultIndex, ...otherProps } = this.props;
    const { index } = this.state;
    const navigationState = this.getNavigationState(data, index ?? defaultIndex);
    const renderScene = this.getRenderScene(data);

    return (
      <Tab
        initialLayout={{ width: Dimensions.get('window').width }}
        {...otherProps}
        navigationState={navigationState}
        renderScene={renderScene}
        onIndexChange={this.handleIndexChange}
      />
    );
  }
}

TabView.defaultProps = {
  defaultIndex: 0
};

TabView.propTypes = {
  data: PropTypes.arrayOf(PropTypes.shape({
    key: PropTypes.string.isRequired,
    title: PropTypes.string.isRequired,
    screen: PropTypes.oneOfType([
      PropTypes.node,
      PropTypes.object,
      PropTypes.func
    ]).isRequired
  })),
  defaultIndex: PropTypes.number
};

export default TabView;