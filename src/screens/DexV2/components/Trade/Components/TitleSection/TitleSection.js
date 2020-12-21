import React, { memo } from 'react';
import { StyleSheet, Text, View } from 'react-native';
import PropTypes from 'prop-types';
import { COLORS, FONT} from '@src/styles';
import Help from '@components/Help';
import routeNames from '@routers/routeNames';
import { useNavigation } from 'react-navigation-hooks';

const TitleSection = ({ title, style, helpData }) => {
  const navigation  = useNavigation();
  const onHelpPress = () => {
    navigation.navigate(routeNames.Helper, helpData);
  };

  return (
    <View style={[styles.wrapper, style]}>
      <Text style={[styles.style]}>
        {title}
      </Text>
      {!!helpData && (
        <Help onPress={onHelpPress} />
      )}
    </View>
  );
};

TitleSection.propTypes = {
  title: PropTypes.string.isRequired,
  style: PropTypes.any,
  helpData: PropTypes.object
};

TitleSection.defaultProps = {
  style: null,
  helpData: null
};

const styles = StyleSheet.create({
  wrapper: {
    flexDirection: 'row',
    alignItems: 'center'
  },
  style: {
    ...FONT.STYLE.bold,
    color: COLORS.black,
    fontSize: FONT.SIZE.superMedium,
    lineHeight: 24,
  },
});

export default memo(TitleSection);