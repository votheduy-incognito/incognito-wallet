import React from 'react';
import PropTypes from 'prop-types';
import { TouchableOpacity, Text, StyleSheet, TextInput } from 'react-native';
import Dialog, { DialogContent } from 'react-native-popup-dialog';

function Welcome(props) {
  const { onCreate, visible } = props;
  const [name, setName] = React.useState('');

  const onCreatePlayer = () => {
    onCreate(name);
  };

  return (
    <Dialog visible={visible} style={styles.dialog}>
      <DialogContent style={styles.content}>
        <TextInput
          style={{height: 40, borderColor: 'gray', borderWidth: 1}}
          onChangeText={setName}
          defaultValue=""
        />
        <TouchableOpacity onPress={onCreatePlayer}>
          <Text>Create</Text>
        </TouchableOpacity>
      </DialogContent>
    </Dialog>
  );
}

const styles = StyleSheet.create({
  content: {
    padding: 30,
  },
});

Welcome.propTypes = {
  visible: PropTypes.bool.isRequired,
  onCreate: PropTypes.func.isRequired,
};

export default React.memo(Welcome);
