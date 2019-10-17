import React, { createContext } from 'react';

const DetailDeviceContext = createContext({

});

export class DetailDeviceProvider extends React.Component{
  state = {
    device:null
  }

  render(){
    const {children} = this.props;
    return (
      <DetailDeviceContext.Provider>
        {children}
      </DetailDeviceContext.Provider>
    );
  }
}

export const DetailDeviceConsumer = DetailDeviceContext.Consumer;