import React from 'react';
import { View, Text, TouchableOpacity } from 'react-native';
import { BtnCircleBack } from '@src/components/Button';
import PropTypes from 'prop-types';
import { useNavigation } from 'react-navigation-hooks';
import { BtnSelectAccount } from '@screens/SelectAccount';
import debounce from 'lodash/debounce';
import { styled, styledHeaderTitle } from './Header.styled';
import SearchBox from './Header.searchBox';
import withHeader from './Header.enhance';

export const HeaderContext = React.createContext({});

const HeaderTitle = () => {
  const { headerProps } = React.useContext(HeaderContext);
  const { onHandleSearch, title, titleStyled, canSearch } = headerProps;
  const Title = () => (
    <Text
      style={[
        styledHeaderTitle.title,
        canSearch && styledHeaderTitle.searchStyled,
        titleStyled,
      ]}
    >
      {title}
    </Text>
  );
  if (!canSearch) {
    return <Title />;
  }
  return (
    <TouchableOpacity
      style={styledHeaderTitle.container}
      onPress={onHandleSearch}
    >
      <Title />
    </TouchableOpacity>
  );
};

const Header = ({
  title,
  rightHeader,
  titleStyled,
  canSearch,
  dataSearch,
  toggleSearch,
  accountSelectable,
  onGoBack,
  onHandleSearch,
  style,
}) => {
  const { goBack } = useNavigation();
  const handleGoBack = () =>
    typeof onGoBack === 'function' ? onGoBack() : goBack();
  const _handleGoBack = debounce(handleGoBack, 100);
  return (
    <HeaderContext.Provider
      value={{
        headerProps: {
          title,
          rightHeader,
          titleStyled,
          canSearch,
          dataSearch,
          toggleSearch,
          onHandleSearch,
        },
      }}
    >
      <View style={[styled.container, style]}>
        <BtnCircleBack onPress={_handleGoBack} />
        {toggleSearch ? <SearchBox /> : <HeaderTitle />}
        {!!rightHeader && rightHeader}
        {accountSelectable && (
          <View>
            <BtnSelectAccount />
          </View>
        )}
      </View>
    </HeaderContext.Provider>
  );
};

Header.defaultProps = {
  rightHeader: null,
  titleStyled: null,
  canSearch: false,
  dataSearch: [],
  accountSelectable: false,
  onGoBack: null,
  style: null,
};

Header.propTypes = {
  title: PropTypes.string.isRequired,
  rightHeader: PropTypes.element,
  titleStyled: PropTypes.any,
  canSearch: PropTypes.bool,
  dataSearch: PropTypes.array,
  toggleSearch: PropTypes.bool.isRequired,
  accountSelectable: PropTypes.bool,
  onGoBack: PropTypes.func,
  onHandleSearch: PropTypes.func.isRequired,
  style: PropTypes.any,
};

export default withHeader(React.memo(Header));
