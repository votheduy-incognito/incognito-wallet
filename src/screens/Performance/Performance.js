import React, { memo } from 'react';
import { View, Text, TouchableOpacity, Clipboard } from 'react-native';
import { ScrollView } from '@src/components/core';
import { useSelector, useDispatch } from 'react-redux';
import { BtnClose } from '@src/components/Button';
import { devSelector } from '@screens/Dev';
import {CONSTANT_KEYS} from '@src/constants';
import { actionLogTradeData } from '@screens/DexV2/components/Trade/TradeV2/Trade.actions';
import { performanceSelector } from './Performance.selector';
import { styled } from './Performance.styled';
import { actionClearPerformance, actionToggle } from './Performance.actions';

const NormalText = ({ text }) => {
  return <Text style={styled.text}>{text}</Text>;
};

const Item = memo(({ title, desc, time, id }) => {

  const renderDesc = () => {
    if (typeof desc === 'object') {
      return (Object.keys(desc).map((key) => <NormalText text={`${key}: ${desc[key]}`}/>));
    } else {
      return <NormalText text={`Desc: ${desc}`} />;
    }
  };

  return (
    <View style={styled.item}>
      <NormalText text={`\nid: ${id}`} />
      <NormalText text={title} />
      <TouchableOpacity onPress={() => Clipboard.setString(JSON.stringify(desc))}>
        {renderDesc()}
      </TouchableOpacity>
      <NormalText text={time} />
    </View>
  );
});

const Performance = () => {
  const isDev = global.isDebug();
  const { data, toggle } = useSelector(performanceSelector);
  const dev = useSelector(devSelector);

  const dispatch = useDispatch();

  const renderButtonClear = () => {
    return(
      <TouchableOpacity
        onPress={() => dispatch(actionClearPerformance())}
        activeOpacity={0.7}
        style={styled.btnClear}
      >
        <Text>Clear</Text>
      </TouchableOpacity>
    );
  };

  const renderButtonCopyAll = () => {
    return(
      <TouchableOpacity
        onPress={() => Clipboard.setString(JSON.stringify(data))}
        activeOpacity={0.7}
        style={styled.btnClear}
      >
        <Text>Copy</Text>
      </TouchableOpacity>
    );
  };

  const renderButtonTradeLog = () => (
    <TouchableOpacity
      onPress={() => dispatch(actionLogTradeData())}
      activeOpacity={0.7}
      style={styled.btnClear}
    >
      <Text>Log Trade</Text>
    </TouchableOpacity>
  );

  if (!isDev) {
    return null;
  }
  if (!toggle) {
    return (
      <View style={[styled.btn, styled.abs]}>
        <BtnClose onPress={() => dispatch(actionToggle())} />
      </View>
    );
  }
  return (
    <View style={styled.wrapper}>
      <View style={styled.btn}>
        {!!dev[CONSTANT_KEYS.DEV_TEST_TOGGLE_TRADE] && renderButtonTradeLog()}
        {renderButtonCopyAll()}
        {renderButtonClear()}
        <BtnClose onPress={() => dispatch(actionToggle())} />
      </View>
      <View style={styled.wrapContent}>
        <ScrollView style={{ backgroundColor: 'transparent', marginHorizontal: 4 }}>
          <View>
            {data.map((item, index) => (
              <Item {...{ ...item, id: index }} key={item?.id || index} />
            ))}
          </View>
        </ScrollView>
      </View>
    </View>
  );
};

Performance.propTypes = {};

export default Performance;
