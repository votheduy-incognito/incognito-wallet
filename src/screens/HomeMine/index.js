import { Container, Text } from '@src/components/core';
import FlatList from '@src/components/core/FlatList';
import routeNames from '@src/router/routeNames';
import BaseScreen from '@src/screens/BaseScreen';
import LocalDatabase from '@src/utils/LocalDatabase';
import React from 'react';
import { ButtonGroup, Header, Icon } from 'react-native-elements';
import style from './style';

export const TAG = 'HomeMine';
const buttonsTab = ['My Device', 'Chain Store'];
class HomeMine extends BaseScreen {
  constructor(props) {
    super(props);
    this.state = {
      selectedIndex: 0,
      listDevice :[],
      isFetching:false,
      isLoadMore:false
    };
   
  }

  componentWillUpdate(nextProps) {
    console.log(
      `${TAG} - componentWillUpdate - nextProps = ${JSON.stringify(nextProps)} `
    );
  }
  updateIndex = (selectedIndex)=> {
    this.setState({
      selectedIndex :selectedIndex
    });
  }
  handleLoadMore=()=>{

  }
  handleRefresh = async ()=>{
    const list:[] = await this.getListLocalDevice();
    this.setState({
      listDevice,
      isFetching:false
    });
  }
  getListLocalDevice = async ()=>{
    const listDevice = await LocalDatabase.getListDevices();
    return listDevice;
  };
  renderHeader = ()=>{
    return (<Header containerStyle={{backgroundColor:'transparent'}} leftComponent={<Text>My Minex</Text>} rightComponent={<Icon
      name='sc-telegram'
      type='evilicon'
      color='#517fa4'
      onPress={()=>{
        this.goToScreen(routeNames.AddDevice);
      }}
    />}></Header>);
  }
  render() {
    const {selectedIndex,listDevice,isFetching,isLoadMore} = this.state;
    return (<Container style={style.container} >
      {this.renderHeader()}
      <ButtonGroup
        onPress={this.updateIndex}
        selectedIndex={selectedIndex}
        buttons={buttonsTab}
        containerStyle={{height: 40}}
      />
      <FlatList 
        data={listDevice}
        keyExtractor={item => String(item.id)}
        onEndReachedThreshold={0.7}
        onRefresh={this.handleRefresh}
        refreshing={isFetching && !isLoadMore}
        onEndReached={this.handleLoadMore}
      />
    </Container>);
  }
}

HomeMine.propTypes = {};

HomeMine.defaultProps = {};
export default HomeMine;
