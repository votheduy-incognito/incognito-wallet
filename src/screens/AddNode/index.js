import routeNames from '@routers/routeNames';
import React from 'react';
import { TouchableOpacity, View, Text } from 'react-native';
import Header from '@src/components/Header';
import { withLayout_2 } from '@components/Layout';
import { useNavigation } from 'react-navigation-hooks';
import styles from './styles';

export const TAG = 'AddNode';
const listItems = [
  {
    title: 'Node Device',
    subTitle: 'Plug in and connect',
    routeName: routeNames.GetStaredAddNode
  },
  {
    title: 'Node Virtual',
    subTitle: 'Run a virtual node',
    routeName: routeNames.AddSelfNode
  },
];

const AddNode = () => {
  const navigation = useNavigation();
  return (
    <View style={styles.container}>
      <Header title="Add a Node" />
      <View style={styles.content}>
        {listItems?.map(item => (
          <TouchableOpacity
            key={item.routeName}
            onPress={() => navigation.navigate(item?.routeName)}
            style={styles.contentItem}
          >
            <Text style={styles.title}>
              {item?.title}
            </Text>
            <Text style={styles.subTitle}>
              {item?.subTitle}
            </Text>
          </TouchableOpacity>
        ))}
      </View>
    </View>
  );
};

export default withLayout_2(AddNode);
