import React, { Component } from 'react';
import PropTypes from 'prop-types';
import { Container, ScrollView, Text, View } from '@src/components/core';
import Icons from 'react-native-vector-icons/AntDesign';
import { COLORS } from '@src/styles';
import style from './style';

const getColor = type => {
  switch(type) {
  case 'warning':
    return COLORS.orange;
  case 'success':
    return COLORS.green;
  case 'info':
    return COLORS.blue;
  case 'error':
    return COLORS.red;
  default: // info as default
    return COLORS.blue;
  }
};

class SimpleInfo extends Component {
  constructor(props) {
    super(props);
    this.state = {
      icon: props.icon
    };
  }

  static getDerivedStateFromProps(nextProps) {
    const { icon, type } = nextProps;

    if (icon) {
      const newIcon = React.cloneElement(icon, { color: getColor(type), size: 60 });
      return { icon: newIcon };
    }

    return null;
  }

  

  render() {
    const { text, subText, button } = this.props;
    const { icon } = this.state;

    return (
      <ScrollView style={style.container}>
        <Container style={style.mainContainer}>
          <View style={style.iconContainer}>
            {icon}
          </View>
          {text && <Text style={style.text}>{text}</Text>}
          {subText && <Text style={style.subText}>{subText}</Text>}
          {
            button && (
              <View style={style.buttonContainer}>
                {button}
              </View>
            )
          }
        </Container>
      </ScrollView>
    );
  }
}

SimpleInfo.defaultProps = {
  text: null,
  subText: null,
  type: 'info',
  icon: <Icons name='exclamationcircleo' style={style.icon} color={COLORS.blue} />
};

SimpleInfo.propTypes = {
  text: PropTypes.string,
  subText: PropTypes.string,
  type: PropTypes.oneOf(['warning', 'info', 'success', 'error']),
  icon: PropTypes.node
};

export default SimpleInfo;