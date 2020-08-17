import React from 'react';
import PropTypes from 'prop-types';
import _ from 'lodash';
import { View, TouchableOpacity, BaseTextInput } from '@components/core';
import { compose } from 'recompose';
import BackButton from '@components/BackButtonV2';
import { useNavigation, useNavigationParam } from 'react-navigation-hooks';
import { withLayout_2 } from '@components/Layout/index';
import { VirtualizedList } from 'react-native';
import TokenItem from './TokenItem';
import styles from './style';
import withTokenSelect from './enhance';

const TokenSelect = ({
  tokens,
  onSearch,
}) => {
  const placeholder = useNavigationParam('placeholder') || 'Placeholder';
  const onSelectToken = useNavigationParam('onSelectToken') || _.noop();
  const navigation = useNavigation();
  const selectToken = (token) => {
    onSelectToken(token);
    navigation.goBack();
  };

  const renderTokenItem = (data) => {
    const token = data.item;
    return (
      <TouchableOpacity key={token.id} onPress={() => selectToken(token)}>
        <TokenItem
          symbol={token.symbol || token.displaySymbol}
          id={token.id}
          verified={token.verified || token.isVerified}
          name={token.name}
        />
      </TouchableOpacity>
    );
  };

  return (
    <View style={[styles.container]}>
      <View style={[styles.row]}>
        <BackButton />
        <BaseTextInput
          placeholder={placeholder}
          onChangeText={onSearch}
          style={styles.input}
        />
      </View>
      <VirtualizedList
        data={tokens}
        renderItem={renderTokenItem}
        getItem={(data, index) => data[index]}
        getItemCount={data => data.length}
        keyExtractor={(item) => item.id}
        showsVerticalScrollIndicator={false}
        showsHorizontalScrollIndicator={false}
      />
    </View>
  );
};

TokenSelect.propTypes = {
  tokens: PropTypes.array,
  onSearch: PropTypes.func.isRequired,
};

TokenSelect.defaultProps = {
  tokens: [],
};

export default compose(
  withTokenSelect,
  withLayout_2,
)(TokenSelect);
