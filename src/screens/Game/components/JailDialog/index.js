import React from 'react';
import PropTypes from 'prop-types';
import { View, Text, StyleSheet } from 'react-native';
import Dialog, { DialogContent } from 'react-native-popup-dialog';
import { Button } from '@src/components/core';
import {MOVE_TIME_PER_CELL} from '../../constants';

function JailDialog(props) {
  const { isInJail, onPay, onRoll, remaining, isPaying } = props;
  const [visible, setVisible] = React.useState(false);

  React.useEffect(() => {
    if (isInJail) {
      setVisible(true);
    } else {
      setVisible(false);
    }
  }, [isInJail]);

  const onRollClick = async () => {
    setVisible(false);
    await onRoll();
    setTimeout(() => {
      setVisible(true);
    }, MOVE_TIME_PER_CELL * 50);
  };

  return (
    <Dialog visible={isInJail && visible} style={styles.dialog}>
      <DialogContent style={styles.content}>
        <Text style={[styles.tokenName, styles.center]}>
          {remaining > 0 ?
            `You're in jail. Roll a double or pay 50 PRV to get out. You have ${remaining} tries.` :
            'Tough luck. Pay 50 PRV to get out of jail.'}
        </Text>
        <View style={[styles.actions, styles.center]}>
          <Button
            type="secondary"
            style={[styles.center, styles.button]}
            onPress={onPay}
            title="Pay the fine"
            titleStyle={styles.buttonText}
          />
          <Button
            style={[styles.center, styles.button]}
            type="primary"
            disabled={isPaying || remaining === 0}
            onPress={onRollClick}
            title="Roll"
            titleStyle={styles.buttonText}
          />
        </View>
      </DialogContent>
    </Dialog>
  );
}

const styles = StyleSheet.create({
  center: {
    alignItems: 'center',
    justifyContent: 'center',
    textAlign: 'center',
  },
  tokenName: {
    fontWeight: 'bold',
    fontSize: 14,
    marginBottom: 10,
    width: 250,
  },
  content: {
    padding: 10,
  },
  actions: {
    flex: 1,
    flexDirection: 'row',
    maxHeight: 42,
    minHeight: 42,
    height: 42,
  },
  button: {
    width: 120,
    height: 32,
    margin: 5,
  },
  buttonText: {
    fontSize: 14,
    color: 'white',
  }
});

JailDialog.propTypes = {
  isPaying: PropTypes.bool,
  isInJail: PropTypes.bool,
  onRoll: PropTypes.func.isRequired,
  onPay: PropTypes.func.isRequired,
  remaining: PropTypes.number,
};

JailDialog.defaultProps = {
  isPaying: false,
  isInJail: false,
  remaining: null,
};

export default React.memo(JailDialog);
