import React from 'react';
import {View} from 'react-native';
import {Button, TextInput, Text, TouchableOpacity} from '@components/core/index';
import {useDispatch, useSelector} from 'react-redux';
import {selectedPrivacySeleclor} from '@src/redux/selectors';
import PropTypes from 'prop-types';
import {useNavigation} from 'react-navigation-hooks';
import {ExHandler} from '@services/exception';
import routeNames from '@routers/routeNames';
import formatUtil from '@utils/format';
import TokenSelect from '@components/TokenSelect/index';
import {setSelectedPrivacy} from '@src/redux/actions/selectedPrivacy';
import CryptoIcon from '@components/CryptoIcon/index';
import VerifiedText from '@components/VerifiedText/index';
import {Icon} from 'react-native-elements';
import withDepositAmount from './DepositAmount.enhance';
import {styled} from './DepositAmount.styled';
import {validateForm} from './DepositAmount.utils';

const DepositAmount = props => {
  const selectedPrivacy = useSelector(selectedPrivacySeleclor.selectedPrivacy);
  const dispatch = useDispatch();
  const {symbol, tokenId, isVerified} = selectedPrivacy;
  const {min, max, onComplete} = props;
  const [state, setState] = React.useState({
    value,
    validated: {
      error: false,
      message: '',
    },
    error: '',
  });

  const {value, validated} = state;
  const {message} = validated;
  const originalSymbol = symbol.substring(1);
  const navigation = useNavigation();

  const handleShield = async () => {
    try {
      const validatedForm = validateForm({ amount: value, min, max });
      if (validatedForm.error) {
        return await setState({
          ...state,
          validated: {...validatedForm},
        });
      }

      onComplete(value);
    } catch (error) {
      new ExHandler(error).showErrorToast();
    }
  };

  const handleSelectToken = (tokenId) => {
    dispatch(setSelectedPrivacy(tokenId));
  };

  return (
    <View style={styled.container}>
      <View style={styled.textContainer}>
        <View>
          <TextInput
            label="How much do you want to shield?"
            value={value}
            onChangeText={value =>
              setState({...state, value, validated: {error: false, message: ''}, error: ''})
            }
            autoFocus
            placeholder="0"
            keyboardType="numeric"
            maxLength={15}
            validated={validated}
            onSubmitEditing={handleShield}
          />
          <View style={styled.token}>
            <CryptoIcon key={tokenId} tokenId={tokenId} size={20}  />
            <VerifiedText text={originalSymbol} isVerified={isVerified} style={styled.tokenText} />
            <TokenSelect
              onSelect={handleSelectToken}
              onlyPToken
              showOriginalSymbol
              size={25}
              style={{
                height: 40,
                right: -25,
              }}
              iconStyle={{
                width: 150,
                paddingLeft: 125,
              }}
            />
          </View>
        </View>
        <Text style={styled.error}>{message}</Text>
        <Button
          title={`Shield ${value ? formatUtil.amountFull(value) : ''} ${originalSymbol}`}
          style={styled.btnStyle}
          onPress={handleShield}
        />

      </View>
      <TouchableOpacity
        style={styled.floatBtn}
        onPress={() => navigation.navigate(routeNames.WhyShield)}
      >
        <View style={styled.btnIcon}>
          <Icon name="chevron-right" />
        </View>
        <Text style={styled.text}>Find out why</Text>
      </TouchableOpacity>
    </View>
  );
};

DepositAmount.propTypes = {
  min: PropTypes.number.isRequired,
  max: PropTypes.number.isRequired,
  onComplete: PropTypes.func.isRequired,
};

export default withDepositAmount(DepositAmount);
