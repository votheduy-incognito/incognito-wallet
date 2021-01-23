import React, { memo } from 'react';
import { StyleSheet, Text } from 'react-native';
import PropTypes from 'prop-types';
import { COLORS, FONT } from '@src/styles';
import { textType } from '@screens/Node/components/NodeFullDisk/constants';
import linkingService from '@services/linking';

const styles = StyleSheet.create({
  wrapper: {
    marginTop: 32,
  },
  textStyle: {
    fontSize: FONT.SIZE.regular,
    lineHeight: FONT.SIZE.regular + 5,
  },
  normalText: {
    fontFamily: FONT.NAME.medium,
    color: COLORS.manateeGrey,
  },
  boldText: {
    fontFamily: FONT.NAME.bold,
    color: COLORS.black,
  },
  linkText: {
    fontFamily: FONT.NAME.bold,
    color: COLORS.black,
    textDecorationLine: 'underline',
  }
});

const RowText = React.memo((props) => {
  const { data } = props;
  const { text, type, link } = data;
  const onPressText = () => {
    if (!link) return;
    linkingService.openUrl(link);
  };
  return (
    <Text 
      style={[
        styles.textStyle,
        type === textType.normal && styles.normalText,
        type === textType.bold && styles.boldText,
        type === textType.link && styles.linkText,
      ]}
      onPress={onPressText}
    >
      {text}
    </Text>
  );
});

const Section = (props) => {
  const { data } = props;
  const renderContent = (content) => {
    return <RowText key={content.text} data={content} />;
  };
  return (
    <Text style={styles.wrapper}>
      {data.map(renderContent)}
    </Text>
  );
};

Section.propTypes = {
  data: PropTypes.array.isRequired
};

RowText.propTypes = {
  data: PropTypes.shape({
    text: PropTypes.string.isRequired,
    type: PropTypes.number.isRequired,
    link: PropTypes.string,
  }).isRequired,
};

export default memo(Section);