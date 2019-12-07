import React, { PureComponent } from 'react';
import PropTypes from 'prop-types';
import { connect } from 'react-redux';
import { View } from '@src/components/core';
import { accountSeleclor, tokenSeleclor, selectedPrivacySeleclor } from '@src/redux/selectors';
import { getBalance } from '@src/redux/actions/account';
import { getBalance as getTokenBalance } from '@src/redux/actions/token';
import LoadingTx from '@src/components/LoadingTx';
import SimpleInfo from '@src/components/SimpleInfo';
import SelectToken from '@src/components/HeaderRight/SelectToken';
import { CONSTANT_COMMONS } from '@src/constants';
import LoadingContainer from '@src/components/LoadingContainer';
import { COLORS } from '@src/styles';
import styles from './style';
import PappView from './PappView';

class PappViewContainer extends PureComponent {
  constructor(props) {
    super(props);

    this.state = {
      selectedPrivacy: null,
      listSupportedToken: null,
      url: props.navigation.getParam('url')
    };

    this.reloadBalanceTimeout = null;
  }

  static navigationOptions = ({ navigation }) => {
    const { title, onSelectToken, selectedPrivacy } = navigation.state.params || {};

    return {
      title: title ?? 'Get crypto rich',
      theme: {
        textColor: COLORS.white,
        backgroundColor: COLORS.black
      },
      headerRight: (
        <View style={styles.headerRight}>
          <View style={styles.chooseTokenIcon}>
            <SelectToken onSelect={onSelectToken} selectedPrivacy={selectedPrivacy} />
          </View>
        </View>
        
      )
    };
  }

  componentDidMount() {
    this.handleSelectPrivacyToken(CONSTANT_COMMONS.PRV_TOKEN_ID);
    this.listSupportedToken();
    this.setHeaderTitle();
    this.setHeaderData({ onSelectToken: this.handleSelectPrivacyToken });
  }

  componentWillUnmount() {
    if (this.reloadBalanceTimeout) {
      clearInterval(this.reloadBalanceTimeout);
      this.reloadBalanceTimeout = undefined;
    }
  }

  setHeaderTitle = () => {
    const { navigation } = this.props;
    let title = navigation.getParam('appName');

    this.setHeaderData({ title });
  }

  setHeaderData = (data = {}) => {
    const { navigation } = this.props;
    navigation.setParams(data);
  }

  /**
   * duration in ms
   */
  reloadBalance = (tokenID, duration = 30 * 1000) => {
    // clear prev task
    if (this.reloadBalanceTimeout) {
      clearInterval(this.reloadBalanceTimeout);
    }

    this.reloadBalanceTimeout = setInterval(async () => {
      // account balance (PRV)
      if (tokenID === CONSTANT_COMMONS.PRV_TOKEN_ID) {
        const { getAccountBalanceBound, account } = this.props;
        await getAccountBalanceBound(account);
      } else if (tokenID) {
        const { getTokenBalanceBound, tokens } = this.props;
        const token = tokens?.find(t => t.id === tokenID);
        
        token && await getTokenBalanceBound(token);
      }
      this.getPrivacyToken(tokenID);
    }, duration);
  }

  handleSelectPrivacyToken = tokenID => {
    if (typeof tokenID === 'string') {
      const selectedPrivacy = this.getPrivacyToken(tokenID);
      this.reloadBalance(tokenID);

      this.setHeaderData({ selectedPrivacy });
    } else {
      throw new Error('handleSelectPrivacyToken tokenID must be a tring');
    }
  }

  getPrivacyToken = tokenID => {
    const { selectPrivacyByTokenID } = this.props;
    const selectedPrivacy = selectPrivacyByTokenID(tokenID);
    
    if (selectedPrivacy) {
      this.setState({ selectedPrivacy });
    }

    return selectedPrivacy;
  }

  listSupportedToken = () => {
    const { tokens } = this.props;

    const list = [{
      id: CONSTANT_COMMONS.PRV_TOKEN_ID,
      symbol: CONSTANT_COMMONS.CRYPTO_SYMBOL.PRV,
      name: CONSTANT_COMMONS.CRYPTO_SYMBOL.PRV
    }];

    tokens?.forEach(token => {
      token?.id && list.push({ id: token?.id, symbol: token?.symbol, name: token?.name });
    });

    this.setState({ listSupportedToken: list });
    return list;
  }

  render() {
    const { isSending, selectedPrivacy, listSupportedToken, url } = this.state;
    if (!url) {
      return (
        <SimpleInfo
          text='Can not open pApp without a URL'
          type='warning'
        />
      );
    }

    if (!selectedPrivacy || !listSupportedToken) {
      return <LoadingContainer />;
    }

    return (
      <>
        <PappView
          {...this.props}
          url={url}
          selectedPrivacy={selectedPrivacy}
          listSupportedToken={listSupportedToken}
          onSelectPrivacyToken={this.handleSelectPrivacyToken}
        />
        { isSending && <LoadingTx /> }
      </>
    );
  }
}

const mapState = state => ({
  account: accountSeleclor.defaultAccount(state),
  wallet: state.wallet,
  tokens: tokenSeleclor.followed(state),
  selectPrivacyByTokenID: selectedPrivacySeleclor.getPrivacyDataByTokenID(state),
});

const mapDispatch = {
  getAccountBalanceBound: getBalance,
  getTokenBalanceBound: getTokenBalance
};

PappViewContainer.defaultProps = {
  tokens: []
};

PappViewContainer.propTypes = {
  navigation: PropTypes.object.isRequired,
  getAccountBalanceBound: PropTypes.func.isRequired,
  getTokenBalanceBound: PropTypes.func.isRequired,
  selectPrivacyByTokenID: PropTypes.func.isRequired,
  tokens: PropTypes.array,
  account: PropTypes.object.isRequired,
};

export default connect(mapState, mapDispatch)(PappViewContainer);