import React from 'react';
import {
  Modal,
  StyleSheet,
  TouchableWithoutFeedback,
  SafeAreaView,
} from 'react-native';
import {useSelector, useDispatch} from 'react-redux';
import {COLORS} from '@src/styles';
import {modalSelector, modalLoadingSelector} from './modal.selector';
import {actionToggleModal} from './modal.actions';
import LoadingModal from './features/LoadingModal';

const styled = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: COLORS.overlayBlackDark,
    width: '100%',
  },
});
const ModalComponent = () => {
  const {visible, data, shouldCloseModalWhenTapOverlay} = useSelector(
    modalSelector,
  );
  const {toggle: toggleLoading, title: titleLoading} = useSelector(
    modalLoadingSelector,
  );
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
        <SafeAreaView style={styled.container}>
          {data}
          {toggleLoading && <LoadingModal title={titleLoading} />}
        </SafeAreaView>
      </TouchableWithoutFeedback>
    </Modal>
  );
};

ModalComponent.defaultProps = {};

ModalComponent.propTypes = {};

export default ModalComponent;
