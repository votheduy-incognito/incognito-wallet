import React from 'react';
import {
  View,
  StyleSheet,
  Text,
  SectionList,
  TouchableWithoutFeedback,
} from 'react-native';
import PropTypes from 'prop-types';
import Icon from 'react-native-vector-icons/Entypo';
import { COLORS, FONT } from '@src/styles';

const styled = StyleSheet.create({
  container: {
    flex: 1,
  },
  labelContainer: {
    flexDirection: 'row',
    justifyContent: 'space-between',
  },
  label: {
    fontFamily: FONT.NAME.bold,
    fontSize: FONT.SIZE.superMedium,
    lineHeight: FONT.SIZE.superMedium + 4,
    color: COLORS.BLACK,
  },
});

const DropdownMenu = (props) => {
  const { defaultToggle, sections, customStyle, ...rest } = props;
  const [toggle, setToggle] = React.useState(defaultToggle);
  const sectionsData = sections.map((section) => ({
    ...section,
    data: toggle ? section?.data : [],
  }));
  return (
    <SectionList
      style={[styled.container, customStyle]}
      sections={sectionsData}
      keyExtractor={(item, index) => item + index}
      renderSectionHeader={({ section: { label } }) => (
        <TouchableWithoutFeedback
          onPress={() => {
            setToggle(!toggle);
          }}
        >
          <View
            style={[
              styled.labelContainer,
              toggle ? { marginBottom: 15 } : null,
            ]}
          >
            <Text style={styled.label}>{label}</Text>
            <Icon
              name={`chevron-thin-${toggle ? 'up' : 'down'}`}
              size={20}
              color={COLORS.colorGreyBold}
            />
          </View>
        </TouchableWithoutFeedback>
      )}
      showsVerticalScrollIndicator={false}
      showsHorizontalScrollIndicator={false}
      {...rest}
    />
  );
};

DropdownMenu.defaultProps = {
  defaultToggle: false,
  customStyle: null,
};

DropdownMenu.propTypes = {
  defaultToggle: PropTypes.bool,
  customStyle: PropTypes.any,
  sections: PropTypes.array.isRequired,
};

export default DropdownMenu;
