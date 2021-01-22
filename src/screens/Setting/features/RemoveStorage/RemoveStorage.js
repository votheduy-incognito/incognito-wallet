import React from 'react';
import { SectionItem as Section } from '@screens/Setting/features/Section';
import PropTypes from 'prop-types';
import DialogLoader from '@components/DialogLoader';
import enhance from './RemoveStorage.enhance';

const RemoveStorage = (props) => {
  const { onPressRemove, loading } = props;
  return (
    <>
      <Section
        data={{
          title: 'Clear history',
          desc: 'Remove locally stored data',
          handlePress: onPressRemove,
        }}
      />
      <DialogLoader loading={loading} />
    </>
  );
};

RemoveStorage.propTypes = {
  onPressRemove: PropTypes.func.isRequired,
  loading: PropTypes.bool.isRequired
};

export default enhance(React.memo(RemoveStorage));
