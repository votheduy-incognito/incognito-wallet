import React, { useState } from 'react';
import ErrorBoundary from '@src/components/ErrorBoundary';

const enhanceSwitchSegment = WrappedComp => props => {

  const [segmentIndex, setSegmentIndex] = useState(0);

  const onChangeSegment = (index) => {
    setSegmentIndex(index);
  };

  return (
    <ErrorBoundary>
      <WrappedComp
        {...{
          ...props,

          segmentIndex,
          isSimple: segmentIndex === 0,
          onChangeSegment
        }}
      />
    </ErrorBoundary>
  );
};

export default enhanceSwitchSegment;