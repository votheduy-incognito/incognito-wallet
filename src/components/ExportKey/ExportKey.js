import React from 'react';
import { View, StyleSheet, Text } from 'react-native';
import PropTypes from 'prop-types';
import QrCodeGenerate from '@src/components/QrCodeGenerate';
import CopiableText from '@src/components/CopiableText';
import { FONT, COLORS, UTILS } from '@src/styles';

const styled = StyleSheet.create({
  container: {
    flex: 1,
    alignItems: 'center',
    justifyContent: 'center',
    width: UTILS.screenWidth(),
    height: UTILS.screenHeight(),
  },
  wrapper: {
    height: UTILS.screenWidth() * 0.8,
    width: UTILS.screenWidth() * 0.8,
    backgroundColor: COLORS.white,
    borderRadius: 12,
    justifyContent: 'center',
    alignItems: 'center',
  },
  title: {
    fontFamily: FONT.NAME.regular,
    fontSize: FONT.SIZE.medium,
    lineHeight: FONT.SIZE.medium + 6,
    color: COLORS.black,
  },
  copiableText: {
    alignItems: 'center',
    flexDirection: 'row',
    padding: 10,
    marginTop: 10,
  },
});

const ExportKey = props => {
  const { title, keyExported, onPressExportKey } = props;
  return (
    <View style={styled.container}>
      <View style={styled.wrapper}>
        <Text style={styled.title}>{title}</Text>
        <QrCodeGenerate value={keyExported} size={100} />
        <CopiableText
          oneLine
          showCopyIcon
          containerProps={{
            style: styled.copiableText,
          }}
          textProps={{
            numberOfLines: 1,
            ellipsizeMode: 'middle',
          }}
          text={keyExported}
          onPress={onPressExportKey}
        />
      </View>
    </View>
  );
};

ExportKey.propTypes = {
  title: PropTypes.string.isRequired,
  keyExported: PropTypes.string.isRequired,
  onPressExportKey: PropTypes.func.isRequired,
};

export default ExportKey;
