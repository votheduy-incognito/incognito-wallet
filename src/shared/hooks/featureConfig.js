import { useState, useEffect, useCallback, useMemo } from 'react';
import { useSelector } from 'react-redux';
import { featuresSelector } from '@screens/Home/Home.selector';
import Toast from '@components/core/Toast/Toast';

function useFeatureConfig(featureName, onPress) {
  const features = useSelector(featuresSelector);
  const [feature, setFeature] = useState(null);

  const handlePress = useCallback((...params) => {
    if (feature && feature.disabled) {
      const duration = Math.max(Math.floor(feature.message.length / 15) * 1000, 2000);
      return Toast.showInfo(feature.message, {
        duration
      });
    }

    if (typeof onPress === 'function') {
      return onPress(...params);
    }
  }, [onPress, feature]);

  const isDisabled = useMemo(() => {
    if (feature && feature.disabled) {
      return feature.disabled;
    }

    return false;
  }, [feature]);

  useEffect(() => {
    if (features && features.length) {
      const feature = features.find(featureItem => featureItem.name === featureName);
      setFeature(feature);
    }
  }, [features, featureName]);

  return [handlePress, isDisabled, feature?.message];
}

export default useFeatureConfig;
