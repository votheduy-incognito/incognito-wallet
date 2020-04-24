import React, { Component } from 'react';
import {
  Dimensions,
  Modal,
  View, Text,
  TextInput,
} from 'react-native';
import PropTypes from 'prop-types';
import LoadingContainer from '@src/components/LoadingContainer';
import { retryExpiredDeposit } from '@src/services/api/history';
import { ExHandler } from '@src/services/exception';
import { Toast, Button } from '@src/components/core';
import LogManager from '@src/services/LogManager';
import { TouchableWithoutFeedback } from 'react-native-gesture-handler';
import { FONT } from '@src/styles';
import styles from './styles';
import TxHistoryDetail from './TxHistoryDetail';

const { width, height } = Dimensions.get('window');
class TxHistoryDetailContainer extends Component {
  state = {
    data: null,
    shouldShowTxModal: false,
    txOutchain: '',
  };

  componentDidMount() {
    this.loadHistoryData();
  }

  loadHistoryData = () => {
    const { navigation } = this.props;
    const data = navigation?.getParam('data');

    this.setState({ data });
  }

  goBack = () => {
    const { navigation } = this.props;
    navigation.pop();
  }

  retryExpiredDeposit = async (data) => {
    try {
      if (data) {
        const { txOutchain } = this.state;
        const { decentralized } = data;
        if (txOutchain === '') {
          return;
        }
        let newData = { ...data.history, TxOutchain: txOutchain };
        await retryExpiredDeposit(newData);

        const decentralizedMSg = 'Your request has been sent, we will process it soon. The history status will be not changed';
        const centralizedMSg = 'Your request has been sent, we will process it soon. The history status will be updated';

        Toast.showInfo(decentralized ? decentralizedMSg : centralizedMSg);
        this.goBack();
      }
    } catch (e) {
      new ExHandler(e, 'Sorry, we can not process this expired deposit request. Please try again.').showErrorToast();
    }
  }
  renderModalTXOutchain = () => {
    const { shouldShowTxModal } = this.state;
    return (
      <Modal
        transparent
        animationType="none"
        visible={shouldShowTxModal}
        onRequestClose={() => {
          this.setState({ shouldShowTxModal: false });
        }}
      >
        <TouchableWithoutFeedback onPress={() => this.setState({ shouldShowTxModal: false })}>
          <View style={styles.modalContainer}>
            <View style={styles.modalContent}>
              <Text style={styles.titleModal}>{'If you\'ve already sent funds to the deposit address, just enter your transaction ID here. Your balance will update within 24 hours.'}</Text>
              <TextInput onChangeText={text => this.setState({ txOutchain: text })} returnKeyType="done" placeholder="TransactionID" numberOfLines={1} style={styles.txField} />
              <Button
                style={styles.submitBTN}
                title='Submit'
                onPress={() => {
                  const { data } = this.state;
                  this.setState({ shouldShowTxModal: false });
                  this.retryExpiredDeposit(data);
                }}
              />
            </View>
          </View>
        </TouchableWithoutFeedback>
      </Modal>
    );
  }
  render() {
    const { data } = this.state;

    if (!data) {
      return <LoadingContainer />;
    }

    return (
      <View>
        <TxHistoryDetail {...this.props} data={data} onRetryExpiredDeposit={() => this.setState({ shouldShowTxModal: true })} />
        {this.renderModalTXOutchain()}
      </View>
    );
  }
}

TxHistoryDetailContainer.propTypes = {
  navigation: PropTypes.object.isRequired
};

export default TxHistoryDetailContainer;