import React from 'react';
import PropTypes from 'prop-types';
import _ from 'lodash';
import { View, TouchableOpacity, BaseTextInput, FlexView } from '@components/core';
import { compose } from 'recompose';
import BackButton from '@components/BackButtonV2';
import { useNavigation, useNavigationParam } from 'react-navigation-hooks';
import { withLayout_2 } from '@components/Layout/index';
import { VirtualizedList } from 'react-native';
import Item from './Item';
import styles from './style';
import withItemSelectScreen from './enhance';

const ItemSelectScreen = ({
  items,
  onSearch,
}) => {
  const placeholder = useNavigationParam('placeholder') || 'Placeholder';
  const onSelect = useNavigationParam('onSelect') || _.noop();
  const onRenderItem = useNavigationParam('onRenderItem');
  const navigation = useNavigation();
  const selectItem = (data) => {
    onSelect(data);
    navigation.goBack();
  };

  const renderItem = (data) => {
    const item = data.item;

    if (onRenderItem && typeof onRenderItem === 'function') {
      return onRenderItem(item);
    }

    return (
      <TouchableOpacity key={item} onPress={() => selectItem(item)}>
        <Item text={item} />
      </TouchableOpacity>
    );
  };

  return (
    <FlexView style={[styles.container]}>
      <View style={[styles.row]}>
        <BackButton />
        <BaseTextInput
          placeholder={placeholder}
          onChangeText={onSearch}
          style={styles.input}
        />
      </View>
      <VirtualizedList
        contentContainerStyle={styles.content}
        data={items}
        renderItem={renderItem}
        getItem={(data, index) => data[index]}
        getItemCount={data => data.length}
        keyExtractor={(item) => item}
        showsVerticalScrollIndicator={false}
        showsHorizontalScrollIndicator={false}
      />
    </FlexView>
  );
};

ItemSelectScreen.propTypes = {
  items: PropTypes.array,
  onSearch: PropTypes.func.isRequired,
};

ItemSelectScreen.defaultProps = {
  items: [],
};

export default compose(
  withItemSelectScreen,
  withLayout_2,
)(ItemSelectScreen);
