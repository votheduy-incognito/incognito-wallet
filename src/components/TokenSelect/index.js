import React from 'react';
import PropTypes from 'prop-types';
import _ from 'lodash';
import { useSelector, shallowEqual } from 'react-redux';
import { View } from '@components/core';
import OptionMenu from '@components/OptionMenu';
import {tokenSeleclor} from '@src/redux/selectors';
import {Icon} from 'react-native-elements';
import CryptoIcon from '@components/CryptoIcon';
import VerifiedText from '@components/VerifiedText/index';
import TokenNetworkName from '@components/TokenNetworkName/index';
import styles from './style';

const generateMenu = (tokens, onSelect) => {
  const newMenu = [];

  if (!tokens) {
    return newMenu;
  }

  tokens
    .slice(0, 10)
    .forEach(token => {
      newMenu.push({
        id: token.id,
        icon: (
          <View style={{ marginTop: 8 }}>
            <CryptoIcon tokenId={token.id} size={30} />
          </View>
        ),
        label: <VerifiedText text={token.displaySymbol} isVerified={token.verified} />,
        desc: <TokenNetworkName id={token.id} />,
        handlePress: onSelect,
      });
    });

  return newMenu;
};

const TokenSelect = ({ onSelect, onlyPToken, size, style, iconStyle, showOriginalSymbol }) => {
  const [menu, setMenu] = React.useState([]);
  const [allTokens, setAllTokens] = React.useState([]);
  const { followedTokens, pTokens, internalTokens } = useSelector(state => ({
    followedTokens: tokenSeleclor.followed(state),
    pTokens: tokenSeleclor.pTokens(state),
    internalTokens: tokenSeleclor.internalTokens(state),
  }), shallowEqual);

  const getFullDataOfFollowTokens = () => {
    const tokens = followedTokens.map(item => {
      let token = pTokens.find(token => token.tokenId === item.id);

      if (!token) {
        if (!onlyPToken) {
          token = internalTokens.find(token => token.id === item.id);
          token.displaySymbol = token.symbol;
        }
      } else {
        token.id = token.tokenId;
        token.displaySymbol = showOriginalSymbol ? token.symbol : token.pSymbol;
      }

      return token;
    }).filter(item => item);

    if (!tokens || !tokens.length) {
      return allTokens;
    }

    return tokens;
  };

  React.useEffect(() => {
    const newMenu = generateMenu(getFullDataOfFollowTokens(), onSelect);

    setMenu(newMenu);
  }, [followedTokens]);

  React.useEffect(() => {
    if (onlyPToken) {
      const allTokens = pTokens.map(item => ({
        ...item,
        id: item.tokenId,
        displaySymbol: showOriginalSymbol ? item.symbol : item.pSymbol,
      }));
      return setAllTokens(allTokens);
    }

    const allTokens = internalTokens
      .filter(token => token.name && token.symbol)
      .concat(pTokens.map(item => ({
        ...item,
        id: item.tokenId,
      })))
      .concat([{
        id: '0000000000000000000000000000000000000000000000000000000000000004',
        name: 'Incognito',
        displayName: 'Privacy',
        symbol: 'PRV',
        pDecimals: 9,
        originalSymbol: 'PRV',
        verified: true,
      }])
      .map(item => ({
        ...item,
        displaySymbol: showOriginalSymbol ? item.symbol : (item.pSymbol || item.symbol),
      }));
    setAllTokens(allTokens);
  }, [internalTokens, pTokens]);

  const handleSearch = (text) => {
    if (text) {
      const searchText = _.toLower(_.trim(text));
      const tokens = _.uniqBy(allTokens)
        .filter(item =>
          _.toLower(item.name).includes(searchText) ||
          _.toLower(item.symbol).includes(searchText)
        );

      const newMenu = generateMenu(tokens, onSelect);
      setMenu(newMenu);
    } else {
      setMenu(generateMenu(getFullDataOfFollowTokens(), onSelect));
    }
  };

  const handleClearSearch = () => {
    handleSearch('');
  };

  return (
    <View styles={styles.container}>
      <OptionMenu
        data={menu}
        title="SELECT TOKEN"
        placeholder="Name, Symbol, or Address"
        onSearch={handleSearch}
        onClose={handleClearSearch}
        style={[styles.select, style]}
        icon={(
          <View style={[styles.iconContainer, iconStyle]}>
            <Icon name="chevron-down" size={size} type="material-community" />
          </View>
        )}
      />
    </View>
  );
};

TokenSelect.propTypes = {
  onSelect: PropTypes.func.isRequired,
  onlyPToken: PropTypes.bool,
  showOriginalSymbol: PropTypes.bool,
  size: PropTypes.number,
  style: PropTypes.object,
  iconStyle: PropTypes.object,
};

TokenSelect.defaultProps = {
  onlyPToken: false,
  showOriginalSymbol: false,
  size: 30,
  style: null,
  iconStyle: null,
};

export default TokenSelect;
