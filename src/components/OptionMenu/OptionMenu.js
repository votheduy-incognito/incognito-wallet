import {
  Text,
  TouchableOpacity,
  View,
  Modal,
  ScrollView,
  BaseTextInput as TextInput,
} from '@src/components/core';
import PropTypes from 'prop-types';
import React, { Component } from 'react';
import EntypoIcons from 'react-native-vector-icons/Entypo';
import { COLORS } from '@src/styles';
import { KeyboardAvoidingView } from 'react-native';
import { Icon } from 'react-native-elements';
import { generateTestId } from '@utils/misc';
import { GENERAL, TOKEN } from '@src/constants/elements';
import { isAndroid } from '@utils/platform';
import styleSheet from './style';

class OptionMenu extends Component {
  constructor(props) {
    super(props);
    this.state = {
      open: false
    };
  }

  handleToggle = isOpen => {
    const { onClose } = this.props;

    this.setState(({ open }) => ({ open: isOpen ?? !open }));

    if (onClose) {
      onClose();
    }
  };

  render() {
    const {
      icon,
      iconProps: { style: iconStyle, ...iconOtherProps },
      title,
      data,
      style,
      toggleStyle,
      placeholder,
      onSearch,
      maxHeight,
      itemStyle,
      isDropDown,
    } = this.props;
    const { open } = this.state;

    return (
      <View style={[styleSheet.container, style]}>
        <TouchableOpacity accessible={false} onPress={() => this.handleToggle()} style={[styleSheet.toggleBtn, isDropDown ? { width: 150 } : {}, toggleStyle]}>
          {icon || (
            <EntypoIcons
              {...generateTestId(TOKEN.TOKEN_CHECK)}
              size={24}
              style={[styleSheet.iconBtn, iconStyle]}
              color={COLORS.white}
              {...iconOtherProps}
              name="dots-three-vertical"
            />
          )}
        </TouchableOpacity>
        <Modal animationType="slide" transparent visible={open} close={this.handleToggle} isShowHeader={false}>
          <TouchableOpacity
            accessible={false}
            onPress={() => this.handleToggle(false)}
            style={styleSheet.contentContainer}
          >
            <KeyboardAvoidingView
              behavior={isAndroid() ? undefined : 'position'}
              enabled
            >
              <View style={styleSheet.content}>
                <View style={styleSheet.barIcon} />
                {title && <Text style={styleSheet.title}>{title}</Text>}
                {onSearch ? (
                  <View style={styleSheet.search}>
                    <Icon name="search" />
                    <TextInput
                      {...generateTestId(TOKEN.TOKEN_SEARCH)}
                      style={styleSheet.input}
                      placeholderTextColor={COLORS.lightGrey1}
                      placeholder={placeholder}
                      onChangeText={onSearch}
                      autoCorrect={false}
                      autoCapitalize={false}
                    />
                  </View>
                ) : null}
                <ScrollView style={{ maxHeight }}>
                  {data.map((item, index) => {
                    const handleItemPress = () => {
                      if (typeof item?.handlePress === 'function') {
                        item.handlePress(item.id);
                      }

                      this.handleToggle(false);
                    };
                    return (
                      <TouchableOpacity
                        accessible={false}
                        key={item?.id}
                        onPress={handleItemPress}
                        style={[
                          styleSheet.menuItem,
                          index < (data.length - 1) && styleSheet.itemDivider,
                          itemStyle,
                        ]}
                      >
                        <View style={styleSheet.icon}>{item?.icon}</View>
                        <View style={styleSheet.textContainer}>
                          {
                            item?.label && typeof item.label === 'string' ?
                              <Text {...generateTestId(TOKEN.TOKEN_CODE)} style={styleSheet.itemText}>{item?.label}</Text>
                              : item.label
                          }
                          {item?.desc ? <Text {...generateTestId(TOKEN.TOKEN_NAME)} style={styleSheet.itemDescText}>{item?.desc}</Text> : null}
                        </View>
                      </TouchableOpacity>
                    );
                  })}
                </ScrollView>
              </View>
            </KeyboardAvoidingView>

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
  toggleStyle: null,
  data: [],
  onSearch: undefined,
  onClose: undefined,
  placeholder: '',
  maxHeight: 250,
  itemStyle: null,
  isDropDown: false,
};

OptionMenu.propTypes = {
  title: PropTypes.string,
  iconProps: PropTypes.object,
  icon: PropTypes.element,
  style: PropTypes.oneOfType([PropTypes.object, PropTypes.arrayOf(PropTypes.object)]),
  itemStyle: PropTypes.object,
  isDropDown: PropTypes.bool,
  toggleStyle: PropTypes.object,
  data: PropTypes.arrayOf(
    PropTypes.shape({
      id: PropTypes.string,
      label: PropTypes.string.isRequired,
      desc: PropTypes.string,
      icon: PropTypes.element,
      handlePress: PropTypes.func
    })
  ),
  onSearch: PropTypes.func,
  onClose: PropTypes.func,
  placeholder: PropTypes.string,
  maxHeight: PropTypes.number,
};

export default OptionMenu;
