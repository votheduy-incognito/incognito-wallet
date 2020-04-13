import React from 'react';
import {View, StyleSheet, Text, Image, TouchableOpacity} from 'react-native';
import PropTypes from 'prop-types';
import {COLORS, FONT} from '@src/styles';

const styled = StyleSheet.create({
  container: {
    justifyContent: 'flex-end',
    flex: 1,
    zIndex: 1,
  },
  menu: {
    backgroundColor: COLORS.white,
    borderRadius: 8,
    padding: 30,
  },
  item: {
    flexDirection: 'row',
    alignItems: 'center',
    padding: 20,
    borderBottomColor: COLORS.lightGrey1,
    borderBottomWidth: 0.5,
  },
  icon: {
    flex: 1,
    padding: 2,
  },
  hook: {
    flex: 5,
  },
  title: {
    fontFamily: FONT.NAME.medium,
    fontSize: FONT.SIZE.regular,
    lineHeight: FONT.SIZE.regular + 6,
    color: COLORS.black,
  },
  desc: {
    fontFamily: FONT.NAME.regular,
    fontSize: FONT.SIZE.regular,
    lineHeight: FONT.SIZE.regular + 6,
    color: COLORS.lightGrey1,
  },
  lastChild: {
    borderBottomWidth: 0,
  },
  btnClose: {
    fontFamily: FONT.NAME.regular,
    fontSize: FONT.SIZE.regular,
    lineHeight: FONT.SIZE.regular + 6,
    color: COLORS.black,
  },
});

const MenuItem = ({data, lastChild}) => {
  const {title, desc, icon, onPressItem} = data;
  return (
    <TouchableOpacity onPress={onPressItem}>
      <View style={[styled.item, lastChild ? styled.lastChild : null]}>
        <View style={styled.icon}>{icon}</View>
        <View style={styled.hook}>
          <Text style={styled.title}>{title}</Text>
          <Text style={styled.desc}>{desc}</Text>
        </View>
      </View>
    </TouchableOpacity>
  );
};

const Menu = ({data, onCloseMenu}) => {
  return (
    <View style={styled.container}>
      <View style={styled.menu}>
        <TouchableOpacity onPress={onCloseMenu}>
          <Text style={styled.btnClose}>Close</Text>
        </TouchableOpacity>
        {data.map((item, index) => (
          <MenuItem
            data={item}
            lastChild={data.length - 1 === index}
            key={item?.id || index}
          />
        ))}
      </View>
    </View>
  );
};

Menu.propTypes = {
  data: PropTypes.array.isRequired,
  onCloseMenu: PropTypes.func.isRequired,
};

MenuItem.propTypes = {
  data: PropTypes.shape({
    title: PropTypes.string.isRequired,
    desc: PropTypes.string.isRequired,
    icon: PropTypes.element.isRequired,
    onPressItem: PropTypes.func.isRequired,
  }).isRequired,
  lastChild: PropTypes.bool.isRequired,
};

export default Menu;
