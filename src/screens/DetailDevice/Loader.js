// import DialogLoader from '@src/components/DialogLoader';
import React, { Component } from 'react';
import ContentLoader, { Facebook, Rect } from 'react-content-loader/native';
import { StyleSheet, View } from 'react-native';

const MyLoader = () => (
  <ContentLoader
    height="100%" 
    width="100%"
    viewBox="0 0 150 70"
    speed={1}
    primaryColor="#f3f3f3"
    secondaryColor="#ecebeb"
  >
    <Rect x="0" y="0" rx="3" ry="3" width="70" height="10" />
    <Rect x="80" y="0" rx="3" ry="3" width="100" height="10" />
    <Rect x="190" y="0" rx="3" ry="3" width="10" height="10" />

    <Rect x="15" y="20" rx="3" ry="3" width="130" height="10" />
    <Rect x="155" y="20" rx="3" ry="3" width="130" height="10" />

    <Rect x="15" y="40" rx="3" ry="3" width="90" height="10" />
    <Rect x="115" y="40" rx="3" ry="3" width="60" height="10" />
    <Rect x="185" y="40" rx="3" ry="3" width="60" height="10" />

    <Rect x="0" y="60" rx="3" ry="3" width="30" height="10" />
  </ContentLoader>
  
);
const MyFacebookLoader = () => <Facebook />;
const style = StyleSheet.create({
  container: {
    height:60,
    justifyContent:'center'
  }
});

// export const FullLoader =(loading:false)=> <DialogLoader loading={loading} />;

class Loader extends Component {
  constructor(props){
    super(props);
    this.state={
      
    };
    
  }
  render(){
    return (
      <View style={style.container}>
        <MyLoader />
      </View>
    );
  }


  renderContent = ()=>{
    
    return (
      <>
        
      </>
    );
  }
}

Loader.propTypes = {
 
};
export default Loader;