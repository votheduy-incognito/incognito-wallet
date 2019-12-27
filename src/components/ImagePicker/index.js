import React, { Component } from 'react';
import PropTypes from 'prop-types';
import picker from 'react-native-image-picker';
import fileType from 'react-native-file-type';
import rnfs from 'react-native-fs';
import { ExHandler, CustomError, ErrorCode } from '@src/services/exception';
import { debounce } from 'lodash';
import ImagePicker from './ImagePicker';

class ImagePickerContainer extends Component {
  constructor() {
    super();
    this.handlePick = debounce(this.handlePick.bind(this), 300);
  }

  getRealPath = (file) => {
    return rnfs.DocumentDirectoryPath + `/${file.name}`;
  }

  handlePick = async () => {
    try {
      return await new Promise((resolve, reject) => {
        const { onPick, maxSize } = this.props;
        const options = {
          title: 'Select Image',
          takePhotoButtonTitle: null,
          mediaType: 'photo',
        };

        picker.showImagePicker(options, async (response) => {
          try {
            if (response.didCancel) {
              // console.log('User cancelled image picker');
            } else if (response.error) {
              return reject(response.error);
            } else {
              // You can also display the image using data:
              // const source = { uri: 'data:image/jpeg;base64,' + response.data };
              if (!response.uri) {
                return reject(new Error('File is not selected'));
              }
  
              if (!response.type) {
                const typeInfo = await fileType(response.path);
                response.type = typeInfo?.mime;
              }
  
              const file = {
                name: response.fileName,
                type: response.type,
                size: response.fileSize,
                uri: response.uri,
              };
  
              const realPath = this.getRealPath(file);
    
              file.realPath = realPath;
  
              if (maxSize && file.size > maxSize) {
                return reject(new CustomError(ErrorCode.document_picker_oversize));
              }
        
              if (typeof onPick === 'function') {
                onPick(file);
              }
             
              resolve(file);
            }
          } catch (e) {
            reject(e);
          }
        });
  
  
        
      });
    } catch (e) {
      new ExHandler(e, 'Sorry, we can not use this file.').showErrorToast();
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
  file: null,
  maxSize: null // in bit
};

ImagePickerContainer.propTypes = {
  onPick: PropTypes.func.isRequired,
  maxSize: PropTypes.number,
  file: PropTypes.shape({
    name: PropTypes.string,
    type: PropTypes.string,
    size: PropTypes.number,
    uri: PropTypes.string,
  })
};

export default ImagePickerContainer;
