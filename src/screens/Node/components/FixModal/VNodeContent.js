import React from 'react';
import PropTypes from 'prop-types';
import {Text} from '@src/components/core';
import styleSheet from './style';


const VNodeContent = ({ name }) =>(
  <>
    <Text style={styleSheet.text}>
      1. Make sure your VPS at IP {name} is running
    </Text>
    <Text style={styleSheet.text}>
      2. SSH into your VPS and run &apos;sudo docker ps&apos; to check if docker is running
    </Text>
  </>
);

VNodeContent.propTypes = {
  name: PropTypes.string.isRequired,
};

export default React.memo(VNodeContent);
