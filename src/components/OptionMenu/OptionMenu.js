import { Text, TouchableOpacity, View, Modal } from '@src/components/core';
import PropTypes from 'prop-types';
import React, { Component } from 'react';
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
      icon,
      iconProps: { style: iconStyle, ...iconOtherProps },
      title,
      data,
      style,
    } = this.props;
    const { open } = this.state;

    return (
      <View style={[styleSheet.container, style]}>
        <TouchableOpacity onPress={() => this.handleToggle()} style={styleSheet.toggleBtn}>
          {icon || (
            <EntypoIcons
              size={24}
              style={[styleSheet.iconBtn, iconStyle]}
              {...iconOtherProps}
              name="dots-three-vertical"
            />
          )}
        </TouchableOpacity>
        <Modal animationType="slide" transparent visible={open}>
          <TouchableOpacity
            onPress={() => this.handleToggle(false)}
            style={styleSheet.contentContainer}
          >
            <View style={styleSheet.content}>
              <View style={styleSheet.barIcon} />
              {title && <Text style={styleSheet.title}>{title}</Text>}
              {data.map((item, index) => {
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
                    style={[
                      styleSheet.menuItem,
                      index < (data.length - 1) && styleSheet.itemDivider
                    ]}
                  >
                    <View style={styleSheet.icon}>{item?.icon}</View>
                    <View style={styleSheet.textContainer}>
                      <Text style={styleSheet.itemText}>{item?.label}</Text>
                      <Text style={styleSheet.itemDescText}>{item?.desc}</Text>
                    </View>
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
  title: null,
  icon: null,
  iconProps: {},
  style: null,
  data: []
};

OptionMenu.propTypes = {
  title: PropTypes.string,
  iconProps: PropTypes.object,
  icon: PropTypes.element,
  style: PropTypes.oneOfType([ PropTypes.object, PropTypes.arrayOf(PropTypes.object) ]),
  data: PropTypes.arrayOf(
    PropTypes.shape({
      id: PropTypes.string,
      label: PropTypes.string.isRequired,
      desc: PropTypes.string,
      icon: PropTypes.element,
      handlePress: PropTypes.func
    })
  )
};

export default OptionMenu;
