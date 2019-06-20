import { Text, TouchableOpacity, View } from '@src/components/core';
import PropTypes from 'prop-types';
import React, { Component } from 'react';
import { Modal } from 'react-native';
import EntypoIcons from 'react-native-vector-icons/Entypo';
import styleSheet from './style';

class OptionMenu extends Component {
  constructor(props) {
    super(props);
    this.state = {
      open: false
    };
  }

  handleToggle = isOpen => {
    this.setState(({ open }) => ({ open: isOpen ?? !open }));
  };

  render() {
    const {
      iconProps: { style: iconStyle, ...iconOtherProps },
      title,
      data
    } = this.props;
    const { open } = this.state;
    return (
      <View style={styleSheet.container}>
        <TouchableOpacity onPress={() => this.handleToggle()}>
          <EntypoIcons
            size={24}
            style={[styleSheet.iconBtn, iconStyle]}
            {...iconOtherProps}
            name="dots-three-horizontal"
          />
        </TouchableOpacity>
        <Modal animationType="slide" transparent visible={open}>
          <TouchableOpacity
            onPress={() => this.handleToggle(false)}
            style={styleSheet.contentContainer}
          >
            <View style={styleSheet.content}>
              {title && <Text style={styleSheet.title}>{title}</Text>}
              {data.map(item => {
                const handleItemPress = () => {
                  if (typeof item?.handlePress === 'function') {
                    item.handlePress();
                  }

                  this.handleToggle(false);
                };
                return (
                  <TouchableOpacity
                    key={item?.id}
                    onPress={handleItemPress}
                    style={styleSheet.menuItem}
                  >
                    <View style={styleSheet.icon}>{item?.icon}</View>
                    <Text style={styleSheet.itemText}>{item?.label}</Text>
                  </TouchableOpacity>
                );
              })}
            </View>
          </TouchableOpacity>
        </Modal>
      </View>
    );
  }
}

OptionMenu.defaultProps = {
  iconProps: {},
  data: []
};

OptionMenu.propTypes = {
  title: PropTypes.string,
  iconProps: PropTypes.objectOf(PropTypes.object),
  data: PropTypes.arrayOf(
    PropTypes.shape({
      id: PropTypes.string,
      label: PropTypes.string.isRequired,
      icon: PropTypes.element,
      handlePress: PropTypes.func
    })
  )
};

export default OptionMenu;
