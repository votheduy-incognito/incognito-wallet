import React from 'react';
import PropTypes from 'prop-types';
import _ from 'lodash';
import { useSelector, shallowEqual } from 'react-redux';
import { View } from '@components/core';
import OptionMenu from '@components/OptionMenu';
import {tokenSeleclor} from '@src/redux/selectors';
import {Icon} from 'react-native-elements';
import CryptoIcon from '@components/CryptoIcon';
import CurrentBalance from '@components/CurrentBalance/';
import styles from './style';

const generateMenu = (tokens, onSelect) => {
  const newMenu = [];
  tokens.forEach(token => {
    newMenu.push({
      id: token.id,
      icon: <View style={{ marginTop: 8 }}><CryptoIcon tokenId={token.id} size={30} /></View>,
      label: token.symbol,
      desc: token.name,
      handlePress: onSelect,
    });
  });

  return newMenu;
};

const TokenSelect = ({ onSelect, onlyPToken }) => {
  const [menu, setMenu] = React.useState([]);
  const [allTokens, setAllTokens] = React.useState([]);
  const { followedTokens, pTokens, internalTokens } = useSelector(state => ({
    followedTokens: tokenSeleclor.followed(state),
    pTokens: tokenSeleclor.pTokens(state),
    internalTokens: tokenSeleclor.internalTokens(state),
  }), shallowEqual);

  React.useEffect(() => {
    const newMenu = generateMenu(followedTokens, onSelect);
    setMenu(newMenu);
  }, [followedTokens]);

  React.useEffect(() => {
    if (onlyPToken) {
      const allTokens = pTokens.map(item => ({
        ...item,
        id: item.tokenId,
        symbol: item.pSymbol,
      }));
      return setAllTokens(allTokens);
    }

    const allTokens = internalTokens
      .filter(token => token.name && token.symbol)
      .concat(pTokens.map(item => ({
        ...item,
        id: item.tokenId,
        symbol: item.pSymbol,
      })));
    setAllTokens(allTokens);
  }, [internalTokens, pTokens]);

  const handleSearch = (text) => {
    if (text) {
      const searchText = _.toLower(_.trim(text));
      const tokens = _.uniqBy(allTokens)
        .filter(item =>
          _.toLower(item.name).includes(searchText) ||
          _.toLower(item.symbol).includes(searchText)
        )
        .slice(0, 10);

      const newMenu = generateMenu(tokens, onSelect);
      setMenu(newMenu);
    } else {
      setMenu(generateMenu(followedTokens, onSelect));
    }
  };

  return (
    <View styles={styles.container}>
      <CurrentBalance select={(
        <OptionMenu
          data={menu}
          title="SELECT TOKEN"
          placeholder="Name, Symbol, or Address"
          onSearch={handleSearch}
          style={styles.select}
          icon={(
            <View style={styles.iconContainer}>
              <Icon name="chevron-down" size={30} type="material-community" />
            </View>
          )}
        />
      )}
      />
    </View>
  );
};

TokenSelect.propTypes = {
  onSelect: PropTypes.func.isRequired,
  onlyPToken: PropTypes.bool,
};

TokenSelect.defaultProps = {
  onlyPToken: false,
};

export default TokenSelect;
