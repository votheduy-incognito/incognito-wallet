import React from 'react';
import PropTypes from 'prop-types';
import {
  Image,
  Text,
  View,
  TouchableOpacity,
} from '@src/components/core';
import { ScrollView } from 'react-native';
import {Icon, Overlay} from 'react-native-elements';
import accountIcon from '@src/assets/images/icons/account_icon.png';
import {accountSeleclor} from '@src/redux/selectors';
import {removeAccount, switchAccount} from '@src/redux/actions/account';
import {connect} from 'react-redux';
import {COLORS} from '@src/styles';
import dexUtil from '@utils/dex';
import { mainStyle } from '../../style';
import stylesheet from './style';

class AccountModal extends React.PureComponent {
  render() {
    const { listAccount, isVisible, switchAccount, defaultAccount, onClose } = this.props;

    const selectAccount = (account) => {
      if (account.PaymentAddress !== defaultAccount.PaymentAddress) {
        switchAccount(account.name);
        onClose(account);
      }
    };

    return (
      <Overlay isVisible={isVisible} overlayStyle={mainStyle.modal}>
        <View>
          <View style={mainStyle.modalHeader}>
            <Text style={mainStyle.modalHeaderText}>
              Select account
            </Text>
            <TouchableOpacity onPress={onClose}>
              <Icon name="close" color={COLORS.white} />
            </TouchableOpacity>
          </View>
          <ScrollView style={mainStyle.modalContent}>
            {listAccount?.filter(item => !dexUtil.isDEXAccount(item.name)).map((item, index) => (
              <TouchableOpacity
                key={item.name}
                onPress={selectAccount.bind(this, item)}
                style={[
                  mainStyle.modalItem,
                  index === listAccount.length - 1 && mainStyle.lastItem,
                ]}
                activeOpacity={0.5}
              >
                <Image source={accountIcon} style={mainStyle.accountIcon} />
                <Text
                  numberOfLines={1}
                  style={[
                    stylesheet.accountName,
                    defaultAccount.PaymentAddress === item.PaymentAddress && stylesheet.active,
                  ]}
                >{item.name}
                </Text>
              </TouchableOpacity>
            ))}
          </ScrollView>
        </View>
      </Overlay>
    );
  }
}

AccountModal.propTypes = {
  isVisible: PropTypes.bool.isRequired,
  defaultAccount: PropTypes.object.isRequired,
  listAccount: PropTypes.arrayOf(PropTypes.object).isRequired,
  onClose: PropTypes.func.isRequired,
  switchAccount: PropTypes.func.isRequired,
};

const mapState = state => ({
  defaultAccount: accountSeleclor.defaultAccount(state),
  listAccount: accountSeleclor.listAccount(state)
});

const mapDispatch = { removeAccount, switchAccount };

export default connect(mapState, mapDispatch)(AccountModal);
