import React from 'react';
import { View, Text } from 'react-native';
import Header from '@src/components/Header';
import { BtnQuestionDefault, ButtonBasic } from '@src/components/Button';
import srcQuestion from '@src/assets/images/icons/question_gray.png';
import { LoadingContainer, ScrollView } from '@src/components/core';
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

const Extra = React.memo(() => {
  const {
    handleDefragmentNativeCoin,
    handleNavigateWhyStreamline,
    hookFactories,
    shouldDisabledForm,
  } = useStreamLine();
  return (
    <>
      <View style={styled.tooltipContainer}>
        <Text style={styled.tooltip}>
          Consolidate your UTXOs to ensure successful transactions of any
          amount.
        </Text>
        <BtnQuestionDefault
          style={styled.questionIcon}
          icon={srcQuestion}
          onPress={handleNavigateWhyStreamline}
        />
      </View>
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
});

const Empty = React.memo(() => {
  return (
    <Text style={styled.emptyText}>
      You’re operating at peak efficiency. Go you!
    </Text>
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
  const { hasExceededMaxInputPRV, isFetching: isLoadingTx } = useStreamLine();
  const { showPending, isFetching } = props;
  const renderMain = () => {
    if (isFetching) {
      return <LoadingContainer />;
    }
    if (showPending) {
      return <Pending />;
    }
    if (!hasExceededMaxInputPRV) {
      return <Empty />;
    }
    return (
      <ScrollView style={styled.scrollview}>
        <Extra />
        {isLoadingTx && <LoadingTx />}
      </ScrollView>
    );
  };
  return (
    <View style={styled.container}>
      <Header title="Streamline" accountSelectable />
      {renderMain()}
    </View>
  );
};

Streamline.propTypes = {
  showPending: PropTypes.bool.isRequired,
  isFetching: PropTypes.bool.isRequired,
};

export default withStreamline(Streamline);
