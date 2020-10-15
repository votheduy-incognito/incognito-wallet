import React from 'react';
import { View, Text } from 'react-native';
import { ScrollView } from '@src/components/core';
import { useSelector, useDispatch } from 'react-redux';
import { BtnClose } from '@src/components/Button';
import { performanceSelector } from './Performance.selector';
import { styled } from './Performance.styled';
import { actionToggle } from './Performance.actions';

const NormalText = ({ text }) => {
  return <Text style={styled.text}>{text}</Text>;
};

const Item = ({ title, desc, time, id }) => (
  <View style={styled.item}>
    <NormalText text={`\nid: ${id}`} />
    <NormalText text={title} />
    <NormalText text={desc} />
    <NormalText text={time} />
  </View>
);

const Performance = () => {
  const isDev = global.isDebug();
  const { data, toggle } = useSelector(performanceSelector);
  const dispatch = useDispatch();
  if (!isDev) {
    return null;
  }
  if (!toggle) {
    return (
      <View style={styled.abs}>
        <BtnClose onPress={() => dispatch(actionToggle())} />
      </View>
    );
  }
  return (
    <View style={styled.container}>
      <ScrollView style={styled.scrollview}>
        <View style={{ flex: 1 }}>
          {data.map((item, index) => (
            <Item {...{ ...item, id: index }} key={item?.id || index} />
          ))}
        </View>
      </ScrollView>
      <View style={styled.btn}>
        <BtnClose onPress={() => dispatch(actionToggle())} />
      </View>
    </View>
  );
};

Performance.propTypes = {};

export default Performance;
