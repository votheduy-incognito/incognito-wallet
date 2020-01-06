import PropTypes from 'prop-types';
import React from 'react';
import fixItIcon from '@src/assets/images/icons/fix_it.png';
import {Text, TouchableOpacity, View, Image} from '@src/components/core';
import VNodeContent from './VNodeContent';
import PNodeContent from './PNodeContent';
import styleSheet from './style';


const Content = ({ item, onClose }) =>(
  <TouchableOpacity
    onPress={onClose}
    style={styleSheet.contentContainer}
  >
    <View style={styleSheet.content}>
      <Text style={styleSheet.closeText}>Close</Text>
      <View style={styleSheet.row}>
        <View style={styleSheet.iconContainer}>
          <Image source={fixItIcon} />
        </View>
        <View style={styleSheet.menuItem}>
          <Text style={styleSheet.title}>
            We can&apos;t reach your node. Let’s fix it!
          </Text>
          {item.IsVNode ? <VNodeContent name={item.Name} /> : <PNodeContent />}
        </View>
      </View>
    </View>
  </TouchableOpacity>
);

Content.propTypes = {
  onClose: PropTypes.func.isRequired,
  item: PropTypes.object.isRequired,
};

export default React.memo(Content);
