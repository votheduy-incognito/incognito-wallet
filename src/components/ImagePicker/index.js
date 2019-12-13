import React, { Component } from 'react';
import PropTypes from 'prop-types';
import picker from 'react-native-document-picker';
import rnfs from 'react-native-fs';
import { ExHandler } from '@src/services/exception';
import ImagePicker from './ImagePicker';

class ImagePickerContainer extends Component {

  getRealPath = (file) => {
    return rnfs.DocumentDirectoryPath + `/${file.name}`;
  }

  handlePick = async () => {
    try {
      const { onPick } = this.props;
      const file = await picker.pick({
        type: 'image/png',
      });
      const realPath = this.getRealPath(file);

      file.realPath = realPath;

      if (typeof onPick === 'function') {
        onPick(file);
      }
    } catch (e) {
      if (picker.isCancel(e)) {
        return null;
      }
      new ExHandler(e).showErrorToast();
    } 
  }

  render() {
    const { file } = this.props;
    return (
      <ImagePicker {...this.props} onPick={this.handlePick} file={file} />
    );
  }
}

ImagePickerContainer.defaultProps = {
  file: null
};

ImagePickerContainer.propTypes = {
  onPick: PropTypes.func.isRequired,
  file: PropTypes.shape({
    name: PropTypes.string,
    type: PropTypes.string,
    size: PropTypes.number,
    uri: PropTypes.string,
  })
};

export default ImagePickerContainer;
