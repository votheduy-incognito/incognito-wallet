import React, { memo, useCallback } from 'react';
import { Text, View, TextInput } from 'react-native';
import TitleSection from '@screens/DexV2/components/Trade/Components/TitleSection/TitleSection';
import helperConst from '@src/constants/helper';
import { styles } from '@screens/DexV2/components/Trade/Components/Slippage/styles';
import PropTypes from 'prop-types';
import { enhanceSlippage } from '@screens/DexV2/components/Trade/Components/Slippage';
import { compose } from 'recompose';
import enhanceValidate from '@screens/DexV2/components/Trade/Components/Slippage/Slippage.enhanceValidate';
import { COLORS } from '@src/styles';

const Slippage = memo((props) => {

  const {
    slippageText,
    onChangeSlippage,
    error,
  } = props;

  const renderError = useCallback(() => {
    if (!error) return null;
    return (
      <Text style={[styles.errorStyle, error?.error && { color: COLORS.red }]}>
        {error?.error || error?.warning}
      </Text>
    );
  }, [error]);

  return (
    <>
      <TitleSection
        title='Slippage tolerance'
        helpData={helperConst.HELPER_CONSTANT.SLIPPAGE}
      />
      <View style={styles.wrapper}>
        <TextInput
          placeholder='0'
          returnKeyType="done"
          keyboardType="decimal-pad"
          value={slippageText}
          style={[styles.defaultTextStyle, styles.slippageStyle]}
          onChangeText={onChangeSlippage}
        />
        <Text style={[styles.defaultTextStyle, styles.unitSlippageStyle]}>
          %
        </Text>
      </View>
      {renderError()}
    </>
  );
});

Slippage.propTypes = {
  slippageText: PropTypes.string,
  onChangeSlippage: PropTypes.func.isRequired,
  error: PropTypes.string,
};

Slippage.defaultProps = {
  slippageText: '',
  error: '',
};

export default compose(
  enhanceSlippage,
  enhanceValidate
)(Slippage);