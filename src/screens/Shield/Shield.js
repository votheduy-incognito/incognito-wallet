import React from 'react';
import { View, ScrollView } from 'react-native';
import Header from '@src/components/Header';
import { BtnQuestionDefault } from '@src/components/Button';
import { useNavigation } from 'react-navigation-hooks';
import routeNames from '@src/router/routeNames';
import PropTypes from 'prop-types';
import Token from '@src/components/Token';
import { formValueSelector } from 'redux-form';
import { searchBoxConfig } from '@src/components/Header/Header.searchBox';
import { useSelector } from 'react-redux';
import isEmpty from 'lodash/isEmpty';
import { styled } from './Shield.styled';
import withShield from './Shield.enhance';

const Shield = props => {
  const navigation = useNavigation();
  const handleWhyShield = () => navigation.navigate(routeNames.WhyShield);
  const { allTokens, menu, handleSearch } = props;
  const selector = formValueSelector(searchBoxConfig.form);
  const keySearch = (
    useSelector(state => selector(state, searchBoxConfig.searchBox)) || ''
  ).trim();
  const [state, setState] = React.useState({
    data: [],
  });
  const { data } = state;
  const handleSetData = async () => {
    if (!isEmpty(keySearch)) {
      await handleSearch(keySearch);
      return await setState({ ...state, data: menu });
    }
    return await setState({ ...state, data: [...allTokens] });
  };
  React.useEffect(() => {
    handleSetData();
  }, [keySearch, allTokens]);
  return (
    <View style={styled.container}>
      <Header
        title="Select a coin to shield"
        canSearch
        rightHeader={<BtnQuestionDefault onPress={handleWhyShield} />}
      />
      <ScrollView style={styled.scrollview}>
        {data.map(item => (
          <Token key={item?.id} tokenId={item?.id} />
        ))}
      </ScrollView>
    </View>
  );
};

Shield.propTypes = {
  allTokens: PropTypes.array.isRequired,
  handleSearch: PropTypes.func.isRequired,
};

export default withShield(Shield);
