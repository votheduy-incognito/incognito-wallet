import React from 'react';
import PropTypes from 'prop-types';
import { FlatList } from '@src/components/core/FlatList';
import { BtnChecked } from '@src/components/Button';
import { Text, StyleSheet } from 'react-native';
import { FONT, COLORS } from '@src/styles';
import { useSelector, useDispatch } from 'react-redux';
import { toggleUnVerifiedTokensSelector } from '@src/redux/selectors/token';
import { actionToggleUnVerifiedToken } from '@src/redux/actions/token';
import { isEmpty, trim, toLower } from 'lodash';
import { searchBoxConfig } from '@src/components/Header';
import { formValueSelector } from 'redux-form';

const styled = StyleSheet.create({
  hook: {
    flexDirection: 'row',
    alignItems: 'center',
    marginTop: 35,
  },
  hookText: {
    fontFamily: FONT.NAME.medium,
    fontSize: FONT.SIZE.regular,
    lineHeight: FONT.SIZE.regular + 5,
    color: COLORS.black,
    marginLeft: 5,
  },
});

const ListToken = (props) => {
  const {
    data,
    isVerifiedTokens,
    visible,
    styledListToken,
    renderItem,
  } = props;
  const toggleUnVerified = useSelector(toggleUnVerifiedTokensSelector);
  const selector = formValueSelector(searchBoxConfig.form);
  const keySearch = trim(
    toLower(
      useSelector((state) => selector(state, searchBoxConfig.searchBox)) || '',
    ),
  );
  const isKeyEmpty = isEmpty(keySearch);
  const dispatch = useDispatch();
  const handleFilterTokensUnVerified = () =>
    dispatch(actionToggleUnVerifiedToken());
  if (!visible || data.length === 0) {
    return null;
  }
  return (
    <FlatList
      showsVerticalScrollIndicator={false}
      style={styledListToken}
      data={data}
      renderItem={renderItem}
      keyExtractor={(token) => token?.tokenId}
      removeClippedSubviews
      initialNumToRender={10}
      ListFooterComponent={
        isVerifiedTokens && !isKeyEmpty ? (
          <BtnChecked
            btnStyle={styled.hook}
            onPress={handleFilterTokensUnVerified}
            checked={toggleUnVerified}
            hook={<Text style={styled.hookText}>Show unverified coins</Text>}
          />
        ) : null
      }
    />
  );
};

ListToken.defaultProps = {
  styledListToken: null,
};

ListToken.propTypes = {
  data: PropTypes.array.isRequired,
  isVerifiedTokens: PropTypes.bool.isRequired,
  visible: PropTypes.bool.isRequired,
  styledListToken: PropTypes.any,
  renderItem: PropTypes.any.isRequired,
};

export default ListToken;
