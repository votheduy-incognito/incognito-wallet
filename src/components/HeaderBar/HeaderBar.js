import React from 'react';
import PropTypes from 'prop-types';
import { View, Text } from '@src/components/core';
import BackButton from '../BackButton';
import styles from './style';

const HeaderBar = (props) => {
  const { navigation, scene, index } = props;
  const { theme, headerSubTitleStyle, headerTitleStyle, headerBackground, subTitle, headerRight, title, customHeader } = scene?.descriptor?.options || {};
  const { backgroundColor, textColor } = theme || {};
  const back = () => navigation.pop();

  return (
    <View style={[
      styles.container, { backgroundColor: backgroundColor || headerBackground }]}
    >
      <View style={styles.left}>
        { index > 0 && <BackButton onPress={back} />}
      </View>
      {
        customHeader ? 
          (
            <View style={styles.customHeader}>{customHeader}</View>
          )
          : (
            <>
              <View style={styles.center}>
                <View style={styles.titleGroup}>
                  {
                    React.isValidElement(title)
                      ? title
                      : <Text style={[styles.title, headerTitleStyle, textColor && { color: textColor }]} numberOfLines={1} ellipsizeMode='tail'>{title}</Text>
                  }
                  { subTitle && <Text style={[styles.subTitle, headerSubTitleStyle]} numberOfLines={1} ellipsizeMode='tail'>{subTitle}</Text>}
                </View>
              </View>
              <View style={styles.right}>
                { headerRight }
              </View>
            </>
          )
      }
    </View>
  );
};

HeaderBar.propTypes = {
  navigation: PropTypes.object.isRequired,
  scene: PropTypes.object.isRequired,
  index: PropTypes.number.isRequired,
};

export default HeaderBar;
