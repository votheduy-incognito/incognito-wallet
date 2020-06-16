import React from 'react';
import ErrorBoundary from '@src/components/ErrorBoundary';
import { getTokenInfo } from '@src/services/api/token';
import { useSelector } from 'react-redux';
import { selectedPrivacySeleclor } from '@src/redux/selectors';
import { compose } from 'recompose';
import { withLayout_2 } from '@src/components/Layout';

const enhance = (WrappedComp) => (props) => {
  const [state, setState] = React.useState({
    info: null,
  });
  const { info } = state;
  const { tokenId } = useSelector(selectedPrivacySeleclor.selectedPrivacy);
  const handleGetIncognitoTokenInfo = async () => {
    if (!tokenId) return;
    try {
      const infoData = await getTokenInfo({ tokenId });
      await setState({ ...state, info: infoData });
    } catch (e) {
      console.log(e);
    }
  };
  React.useEffect(() => {
    handleGetIncognitoTokenInfo();
  }, [tokenId]);
  return (
    <ErrorBoundary>
      <WrappedComp {...{ ...props, info }} />
    </ErrorBoundary>
  );
};

export default compose(
  withLayout_2,
  enhance,
);
