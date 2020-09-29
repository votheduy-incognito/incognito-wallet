import React from 'react';
import { View, Text, RefreshControl } from 'react-native';
import Header from '@src/components/Header';
import { BtnQuestionDefault, ButtonBasic } from '@src/components/Button';
import srcQuestion from '@src/assets/images/icons/question_gray.png';
import { ScrollView } from '@src/components/core';
import LoadingTx from '@src/components/LoadingTx';
import PropTypes from 'prop-types';
import withStreamline from './Streamline.enhance';
import { useStreamLine } from './Streamline.useStreamline';
import { styled } from './Streamline.styled';

const Hook = React.memo((props) => {
  const { title, desc, disabled = false } = props?.data;
  if (disabled) {
    return null;
  }
  return (
    <View style={styled.hook}>
      <Text style={styled.hookTitle}>{title}</Text>
      <Text style={styled.hookDesc}>{desc}</Text>
    </View>
  );
});

const Extra = () => {
  const {
    handleDefragmentNativeCoin,
    hookFactories,
    shouldDisabledForm,
  } = useStreamLine();
  return (
    <>
      <Text style={styled.tooltip}>
        Consolidate your UTXOs to ensure successful transactions of any amount.
      </Text>
      <ButtonBasic
        btnStyle={styled.btnStyle}
        title="Consolidating"
        onPress={handleDefragmentNativeCoin}
        disabled={shouldDisabledForm}
      />
      {hookFactories.map((item, id) => (
        <Hook data={item} key={id} />
      ))}
    </>
  );
};

const Empty = React.memo(() => {
  return (
    <>
      <Text style={styled.emptyText}>
        You’re operating at peak efficiency. Go you!
      </Text>
      <Text style={styled.emptyText}>
        You’ll see a notification on your Assets screen if and when
        consolidation is needed for this keychain.
      </Text>
    </>
  );
});

const Pending = React.memo(() => {
  return (
    <Text style={styled.emptyText}>
      It will update when consolidation is complete.
    </Text>
  );
});

const Streamline = (props) => {
  const {
    hasExceededMaxInputPRV,
    handleNavigateWhyStreamline,
    isFetching,
    isPending,
    totalTimes,
    currentTime,
  } = useStreamLine();
  const { refresh, handleFetchData } = props;
  const renderMain = () => {
    if (!hasExceededMaxInputPRV) {
      return <Empty />;
    }
    if (isPending && !isFetching) {
      return <Pending />;
    }
    return (
      <>
        <Extra {...props} />
        {isFetching && (
          <LoadingTx
            currentTime={currentTime}
            totalTimes={totalTimes}
            descFactories={[
              {
                desc:
                  'The more UTXOs this keychain has, the\nlonger it will take to consolidate.',
              },
              {
                desc:
                  'Please stay on this screen until the\nprocess is complete.',
                styled: { marginTop: 10 },
              },
            ]}
          />
        )}
      </>
    );
  };
  return (
    <View style={styled.container}>
      <Header
        title="Consolidate"
        customHeaderTitle={
          <BtnQuestionDefault
            style={styled.questionIcon}
            icon={srcQuestion}
            onPress={handleNavigateWhyStreamline}
          />
        }
        accountSelectable
      />
      <ScrollView
        refreshControl={
          <RefreshControl refreshing={refresh} onRefresh={handleFetchData} />
        }
        style={styled.scrollview}
      >
        {renderMain()}
      </ScrollView>
    </View>
  );
};

Streamline.propTypes = {
  handleFetchData: PropTypes.func.isRequired,
  refresh: PropTypes.bool.isRequired,
};

export default withStreamline(Streamline);
