import React from 'react';
import {selectedPrivacySeleclor} from '@src/redux/selectors';
import {useSelector} from 'react-redux';
import {getMinMaxDepositAmount} from '@services/api/misc';
import {ExHandler} from '@services/exception';
import {compose} from 'recompose';
import LoadingContainer from '@components/LoadingContainer/index';

const enhance = WrappedComp => props => {
  const selectedPrivacy = useSelector(selectedPrivacySeleclor.selectedPrivacy);
  const [state, setState] = React.useState({
    min: null,
    max: null,
    isFetching: true,
    isFetched: false,
  });
  const {min, max, isFetching} = state;

  const getMinMaxAmount = async () => {
    try {
      const [min, max] = await getMinMaxDepositAmount(selectedPrivacy?.tokenId);
      setState({
        ...state,
        isFetching: false,
        isFetched: true,
        min,
        max,
      });
    } catch (e) {
      new ExHandler(
        e,
        'Can not get min/max amount to deposit',
      ).showErrorToast();
      await setState({
        ...state,
        isFetching: false,
        isFetched: false,
      });
    }
  };

  React.useEffect(() => {
    getMinMaxAmount();
  }, [selectedPrivacy?.tokenId]);

  if (isFetching) {
    return <LoadingContainer />;
  }
  return <WrappedComp {...{...props, min, max}} />;
};

export default compose(enhance);
