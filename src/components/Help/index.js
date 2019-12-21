import React from 'react';
import PropTypes from 'prop-types';
import _ from 'lodash';
import { Overlay, Icon } from 'react-native-elements';
import {
  ScrollView,
  Text,
  View,
} from '@src/components/core';
import stylesheet from './style';

const Help = ({ title, content, marginLeft }) => {
  const [ visible, setVisible ] = React.useState(false);
  return (
    <View>
      <Icon name="help-outline" size={14} containerStyle={{ marginLeft }} onPress={() => setVisible(true)} />
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
    </View>
  );
};

Help.defaultProps = {
  title: '',
  marginLeft: 10,
};

Help.propTypes = {
  title: PropTypes.string,
  content: PropTypes.oneOfType([
    PropTypes.string,
    PropTypes.element,
  ]).isRequired,
  marginLeft: PropTypes.number,
};

export default React.memo(Help);
