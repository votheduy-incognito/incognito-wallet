import { useState, useCallback, useMemo } from 'react';
import Toast from '@components/core/Toast/Toast';
import { useFocusEffect } from 'react-navigation-hooks';
import { getFunctionConfigs } from '@services/api/misc';

function useFeatureConfig(featureName, onPress) {
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

  const getFeature = async () => {
    try {
      const features = await getFunctionConfigs();
      if (features && features.length) {
        const feature = features.find(featureItem => featureItem.name === featureName);
        setFeature(feature);
      } else {
        setFeature({});
      }
    } catch (e) {
      console.debug('CAN NOT GET FEATURE', featureName, e);
    }
  };

  useFocusEffect(useCallback(() => {
    getFeature();
  }, [featureName]));

  return [handlePress, isDisabled, feature?.message];
}

export default useFeatureConfig;
