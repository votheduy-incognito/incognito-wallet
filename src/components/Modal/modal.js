import React from 'react';
import {
  Modal,
  StyleSheet,
  TouchableWithoutFeedback,
  SafeAreaView,
} from 'react-native';
import {useSelector, useDispatch} from 'react-redux';
import {COLORS} from '@src/styles';
import PropTypes from 'prop-types';
import {modalSelector} from './modal.selector';
import {actionToggleModal} from './modal.actions';

const styled = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: COLORS.overlayBlackDark,
    width: '100%',
  },
});
const ModalComponent = props => {
  const {shouldCloseModalWhenTapOverlay} = props;
  const {visible, data} = useSelector(modalSelector);
  const dispatch = useDispatch();
  const handleToggle = async () =>
    shouldCloseModalWhenTapOverlay ? await dispatch(actionToggleModal()) : null;
  return (
    <Modal
      presentationStyle="overFullScreen"
      animationType="slide"
      visible={visible}
      transparent
    >
      <TouchableWithoutFeedback onPress={handleToggle}>
        <SafeAreaView style={styled.container}>{data}</SafeAreaView>
      </TouchableWithoutFeedback>
    </Modal>
  );
};

ModalComponent.defaultProps = {
  shouldCloseModalWhenTapOverlay: true,
};

ModalComponent.propTypes = {
  shouldCloseModalWhenTapOverlay: PropTypes.bool,
};

export default ModalComponent;
