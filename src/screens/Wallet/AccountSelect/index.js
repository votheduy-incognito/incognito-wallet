import React from 'react';
import PropTypes from 'prop-types';
import { useDispatch, useSelector, shallowEqual } from 'react-redux';
import {Image, Text, View} from '@src/components/core';
import OptionMenu from '@components/OptionMenu';
import { switchAccount } from '@src/redux/actions/account';
import accountActive from '@src/assets/images/icons/account_active.png';
import accountDeactive from '@src/assets/images/icons/account_deactive.png';
import {accountSeleclor} from '@src/redux/selectors';
import {Icon} from 'react-native-elements';
import {COLORS} from '@src/styles';
import styles from './style';

const AccountSelect = ({ name }) => {
  const [menu, setMenu] = React.useState([]);
  const { listAccount } = useSelector(state => ({
    listAccount: accountSeleclor.listAccount(state)
  }), shallowEqual);
  const dispatch = useDispatch();

  React.useEffect(() => {
    const newMenu = [];
    listAccount.forEach(account => {
      const accountName = account.name || account.AccountName;
      const isCurrentAccount = name === accountName;

      newMenu.push({
        id: accountName,
        icon: <Image source={isCurrentAccount ? accountActive : accountDeactive} style={{ width: 50, height: 50, resizeMode: 'contain' }} />,
        label: (
          <Text style={{
            marginLeft: 20,
            opacity: isCurrentAccount ? 1 : 0.4,
          }}
          >{accountName}
          </Text>
        ),
        handlePress: () => handleSwitchAccount(accountName),
      });
    });

    setMenu(newMenu);
  }, [listAccount]);

  const handleSwitchAccount = (name) => {
    dispatch(switchAccount(name));
  };

  return (
    <OptionMenu
      data={menu}
      style={styles.container}
      icon={(
        <View style={styles.textContainer}>
          <Text numberOfLines={1} style={styles.title}>{name}</Text>
          <Icon name="chevron-down" color={COLORS.primary} type="material-community" />
        </View>
      )}
    />
  );
};

AccountSelect.propTypes = {
  name: PropTypes.string.isRequired,
};

export default AccountSelect;
