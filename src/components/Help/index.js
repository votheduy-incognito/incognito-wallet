import React from 'react';
import PropTypes from 'prop-types';
import _ from 'lodash';
import { Overlay } from 'react-native-elements';
import {
  ScrollView,
  Text,
  View,
  Image,
  TouchableOpacity,
} from '@src/components/core';
import helpInline from '@src/assets/images/icons/help-inline.png';
import stylesheet from './style';

const Help = ({ title, content, onPress }) => {
  const [ visible, setVisible ] = React.useState(false);

  const onBtnPress = () => {
    if (onPress) {
      onPress();
      return;
    }
    setVisible(true);
  };

  return (
    <TouchableOpacity
      onPress={onBtnPress}
      style={stylesheet.wrapperButton}
    >
      <Image source={helpInline} style={stylesheet.icon} />
      <Overlay isVisible={visible} overlayStyle={stylesheet.dialog} onBackdropPress={() => setVisible(false)}>
        <View>
          <View style={stylesheet.header}>
            {
              React.isValidElement(title)
                ? title
                : <Text style={stylesheet.title}>{title}</Text>
            }
          </View>
          <ScrollView style={stylesheet.content}>
            {_.isString(content) ? <Text>{content}</Text> : content}
          </ScrollView>
        </View>
      </Overlay>
    </TouchableOpacity>
  );
};

Help.defaultProps = {
  title: '',
  onPress: null,
  content: ''
};

Help.propTypes = {
  title: PropTypes.string,
  content: PropTypes.oneOfType([
    PropTypes.string,
    PropTypes.element,
  ]),
  onPress: PropTypes.func
};

export default React.memo(Help);
