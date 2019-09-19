import React from 'react';
import PropTypes from 'prop-types';
import { Text, StyleSheet } from 'react-native';
import Dialog, { DialogContent } from 'react-native-popup-dialog';
import {AUTO_CLOSE_POPUP_TIMEOUT} from '../../constants';

function CardDetail(props) {
  const { card } = props;
  const [visible, setVisible] = React.useState(false);
  let timeout;
  React.useEffect(() => {
    if (card) {
      setVisible(true);
      timeout = setTimeout(() => {
        setVisible(false);
      }, AUTO_CLOSE_POPUP_TIMEOUT);
    } else {
      setVisible(false);
      clearTimeout(timeout);
    }

    return () => {
      clearTimeout(timeout);
    };
  },[card]);

  return (
    <Dialog visible={visible} style={styles.dialog}>
      <DialogContent style={[styles.content, styles.center]}>
        <Text style={styles.card}>{card?.name}</Text>
      </DialogContent>
    </Dialog>
  );
}

const styles = StyleSheet.create({
  content: {
    padding: 20,
  },
  card: {
    fontSize: 16,
    fontWeight: 'bold',
    textAlign: 'center',
  },
  center: {
    justifyContent: 'center',
    alignItems: 'center',
  },
});

CardDetail.propTypes = {
  card: PropTypes.shape({}),
};

CardDetail.defaultProps = {
  card: null,
};

export default React.memo(CardDetail);
