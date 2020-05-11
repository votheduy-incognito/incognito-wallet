import React from 'react';
import ErrorBoundary from '@src/components/ErrorBoundary';
import { compose } from 'recompose';
import { withLayout_2 } from '@src/components/Layout';
import withTokenSelect from '@src/components/TokenSelect/TokenSelect.enhance';
import { formValueSelector } from 'redux-form';
import { searchBoxConfig } from '@src/components/Header/Header.searchBox';
import { useSelector, useDispatch } from 'react-redux';
import isEmpty from 'lodash/isEmpty';
import { useNavigation } from 'react-navigation-hooks';
import routeNames from '@src/router/routeNames';
import uniqBy from 'lodash/uniqBy';
import { ExHandler } from '@src/services/exception';
import PropTypes from 'prop-types';
import { actionFetch as fetchDataShield } from './Shield.actions';

const enhance = WrappedComp => props => {
  const navigation = useNavigation();
  const dispatch = useDispatch();
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
    return await setState({ ...state, data: allTokens });
  };
  const handleWhyShield = () => navigation.navigate(routeNames.WhyShield);
  const handleShield = async tokenId => {
    try {
      navigation.navigate(routeNames.ShieldGenQRCode);
      await dispatch(fetchDataShield({ tokenId }));
    } catch (error) {
      new ExHandler(error).showErrorToast();
    }
  };
  React.useEffect(() => {
    handleSetData();
  }, [keySearch, allTokens]);
  return (
    <ErrorBoundary>
      <WrappedComp
        {...{
          ...props,
          data: uniqBy(data, 'id'),
          handleWhyShield,
          handleShield,
        }}
      />
    </ErrorBoundary>
  );
};

enhance.propTypes = {
  allTokens: PropTypes.array.isRequired,
  handleSearch: PropTypes.func.isRequired,
  menu: PropTypes.array.isRequired,
};
export default compose(
  withLayout_2,
  Comp => props => <Comp {...{ ...props, onlyPToken: true }} />,
  withTokenSelect,
  enhance,
);
