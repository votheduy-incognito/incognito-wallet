import {
  Container,
  Text,
  Button,
  View,
  ScrollView
} from '@src/components/core';
import PropTypes from 'prop-types';
import React, { Component } from 'react';
import Icons from 'react-native-vector-icons/Ionicons';
import CopiableText from '@src/components/CopiableText';
import style from './style';

class BackupKeys extends Component {
  renderAccountItem = (name, key) => {
    return (
      <CopiableText key={name} text={`${name}: ${key}`} copiedMessage={`"${name}" private key was copied`} style={style.accountItemContainer}>
        <View style={style.accountItemHeader}>
          <Text style={style.accountItemNameText}>{name}</Text>
          <Icons name='md-copy' style={style.copyIcon} />
        </View>
        <View style={style.accountItemKey}>
          <Text style={style.accountItemKeyText}>{key}</Text>
        </View>
      </CopiableText>
    );
  }

  render() {
    const { onSaveAs, onCopyAll, backupData, getNameKey } = this.props;

    return (
      <View style={style.container}>
        <ScrollView>
          <Container style={style.topGroup}>
            {
              backupData?.map(pair => {
                const [name, key] = getNameKey(pair);
                return this.renderAccountItem(name, key);
              })
            }
          </Container>
        </ScrollView>
        <View style={style.bottomGroup}>
          <Text style={style.bottomGroupText}>Back up all keys</Text>
          <Button style={style.saveAsBtn} titleStyle={style.saveAsBtnText} title='Choose back up option' onPress={onSaveAs} isAsync />
          <Button style={style.copyAllButton} title='Copy all keys' onPress={onCopyAll} />
        </View>
      </View>
    );
  }
}

BackupKeys.defaultProps = {
  backupData: [],
};

BackupKeys.propTypes = {
  backupData: PropTypes.arrayOf(PropTypes.object),
  onSaveAs: PropTypes.func.isRequired,
  onCopyAll: PropTypes.func.isRequired,
  getNameKey: PropTypes.func.isRequired,
};

export default BackupKeys;
