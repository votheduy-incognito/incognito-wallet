import React, { Component } from 'react';
import { View, Text, TouchableOpacity, Container } from '@src/components/core';
import AddToken from '@src/components/AddToken';
import SearchPToken from '@src/components/SearchPToken';
import styles from './style';

const VIEWS = {
  SEARCH: 'SEARCH',
  ADD: 'ADD',
};

const viewData = {
  [VIEWS.SEARCH]: {
    id: VIEWS.SEARCH,
    label: 'Search',
  },
  [VIEWS.ADD]: {
    id: VIEWS.ADD,
    label: 'Add'
  }
};

class FollowTokenContainer extends Component {
  constructor(props) {
    super(props);
    this.state = {
      view: VIEWS.SEARCH,
    };
  }

  handleChangeView = viewId => {
    viewId && this.setState({ view: viewId });
  }

  render() {
    const { view } = this.state;
    return (
      <View style={styles.container}>
        <View style={styles.tabContainer}>
          {
            Object.values(viewData).map(v => {
              const isActived = view === v.id;
              return v ? (
                <TouchableOpacity
                  key={v.id}
                  onPress={() => this.handleChangeView(v.id)}
                  style={[
                    styles.tabItem,
                    isActived && styles.tabItemActive
                  ]}
                >
                  <Text
                    style={[
                      styles.tabItemText,
                      isActived && styles.tabItemTextActive
                    ]}
                  >
                    {v.label}
                  </Text>
                </TouchableOpacity>
              ) : null;
            })
          }
        </View>
        <Container style={styles.tabContent}>
          {
            view === VIEWS.SEARCH && <SearchPToken />
          }
          {
            view === VIEWS.ADD && <AddToken />
          }
        </Container>
      </View>
    );
  }
}

export default FollowTokenContainer;
