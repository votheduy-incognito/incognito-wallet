import React, { memo } from 'react';
import { View } from 'react-native';
import PropTypes from 'prop-types';
import TitleSection from '@screens/DexV2/components/Trade/Components/TitleSection/TitleSection';
import enhancePriority from '@screens/DexV2/components/Trade/Components/Priority/Priority.enhance';
import helperConst from '@src/constants/helper';
import PriorityItem from './PriorityItem';
import styles from './styles';

const Priority = ({
  priority,
  priorityList,
  handleChoosePriority
}) => {


  const onSelectedItem = (priority) => {
    handleChoosePriority && handleChoosePriority(priority);
  };

  const renderItem = (key) => {
    const item = priorityList[key];
    return(
      <PriorityItem
        data={item}
        selected={item?.key === priority}
        onSelected={onSelectedItem}
      />
    );
  };

  return (
    <View>
      <TitleSection
        title='Priority'
        style={{ marginTop: 30, marginBottom: 17 }}
        helpData={helperConst.HELPER_CONSTANT.PRIORITY}
      />
      <View style={styles.wrapper}>
        {Object.keys(priorityList).map(renderItem)}
      </View>
    </View>
  );
};

Priority.propTypes = {
  priority: PropTypes.string.isRequired,
  priorityList: PropTypes.array.isRequired,
  handleChoosePriority: PropTypes.func.isRequired
};


export default enhancePriority(memo(Priority));