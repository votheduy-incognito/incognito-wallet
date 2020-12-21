import React, { memo } from 'react';
import { Text, View } from 'react-native';
import PropTypes from 'prop-types';
import TitleSection from '@screens/DexV2/components/Trade/Components/TitleSection/TitleSection';
import { styles } from '@screens/DexV2/components/Trade/Components/Slippage/styles';
import ButtonToken from '@screens/DexV2/components/Trade/Components/FeeEdited/ButtonToken';
import enhanceFeeEdited from '@screens/DexV2/components/Trade/Components/FeeEdited/FeeEdited.enhance';
import helperConst from '@src/constants/helper';

const FeeEdited = (props) => {

  const {
    isPRV,
    totalFee,
    canChooseFee,
    originalFeeToken,

    onTokenPress,
    onPrvPress,
  } = props;

  return (
    <View>
      <TitleSection
        title='Fee'
        style={{ marginTop: 30 }}
        helpData={helperConst.HELPER_CONSTANT.FEE}
      />
      <View style={styles.wrapper}>
        <Text style={[styles.defaultTextStyle, styles.slippageStyle]}>
          {totalFee}
        </Text>
        { canChooseFee && (
          <ButtonToken
            title={originalFeeToken?.symbol}
            isSelected={!isPRV}
            onPress={onTokenPress}
          />
        )}

        <ButtonToken
          title='PRV'
          isSelected={isPRV}
          onPress={onPrvPress}
        />
      </View>
    </View>
  );
};

FeeEdited.propTypes = {
  isPRV: PropTypes.bool.isRequired,
  totalFee: PropTypes.string.isRequired,
  canChooseFee: PropTypes.object.isRequired,
  originalFeeToken: PropTypes.object.isRequired,

  onTokenPress: PropTypes.func.isRequired,
  onPrvPress: PropTypes.func.isRequired,
};


export default enhanceFeeEdited(memo(FeeEdited));