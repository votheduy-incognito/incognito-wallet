import React from 'react';
import {selectedPrivacySeleclor, tokenSeleclor} from '@src/redux/selectors';
import {useDispatch, useSelector} from 'react-redux';
import {getMinMaxDepositAmount} from '@services/api/misc';
import {ExHandler} from '@services/exception';
import {compose} from 'recompose';
import LoadingContainer from '@components/LoadingContainer/index';
import {setSelectedPrivacy} from '@src/redux/actions/selectedPrivacy';

const enhance = WrappedComp => props => {
  const selectedPrivacy = useSelector(selectedPrivacySeleclor.selectedPrivacy);
  const pTokens = useSelector(tokenSeleclor.pTokens);
  const followedToken = useSelector(tokenSeleclor.followed);
  const dispatch = useDispatch();
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

  React.useEffect(() => {
    if (!selectedPrivacy || !selectedPrivacy.isPToken) {
      const firstFollowPToken = followedToken.find(item => pTokens.find(token => token.tokenId === item.id));

      if (firstFollowPToken) {
        dispatch(setSelectedPrivacy(firstFollowPToken.id));
      } else {
        dispatch(setSelectedPrivacy(pTokens[0].tokenId));
      }
    }
  }, []);

  if (isFetching) {
    return <LoadingContainer />;
  }
  return <WrappedComp {...{...props, min, max}} />;
};

export default compose(enhance);
