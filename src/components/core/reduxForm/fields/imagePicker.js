import React from 'react';
import ImagePicker from '@src/components/ImagePicker';
import createField from './createField';

const renderCustomField = ({ input, meta, ...props }) => {
  const { onChange, onBlur, onFocus, value } = input;
  return <ImagePicker {...props} onPick={(imgFile) => onChange(imgFile)} onBlur={onBlur} onFocus={onFocus} file={value} />;
};

const ImagePickerField = createField({
  fieldName: 'ImagePickerField',
  render: renderCustomField
});


export default ImagePickerField;
