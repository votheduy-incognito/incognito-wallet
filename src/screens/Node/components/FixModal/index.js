import PropTypes from 'prop-types';
import React from 'react';
import {View, Modal, Button} from '@src/components/core';
import Content from '@screens/Node/components/FixModal/Content';
import styleSheet from './style';

const FixModal = ({ item }) => {
  const [open, setOpen] = React.useState(false);
  const handleToggle = () => {
    setOpen(!open);
  };

  return (
    <View>
      <Button
        onPress={handleToggle}
        style={styleSheet.toggleBtn}
        title="Fix it"
      />
      <Modal animationType="slide" transparent visible={open} close={handleToggle}>
        <Content
          item={item}
          onClose={handleToggle}
        />
      </Modal>
    </View>
  );
};

FixModal.propTypes = {
  item: PropTypes.object.isRequired,
};

export default React.memo(FixModal);
