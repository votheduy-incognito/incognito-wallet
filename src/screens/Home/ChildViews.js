import React from 'react';
import { StyleSheet, View } from 'react-native';
import Dialog, { DialogContent } from 'react-native-popup-dialog';
import { Text, ButtonExtension, Image, ScrollView } from '@src/components/core';
import { scaleInApp } from '@src/styles/TextStyle';
import Icons from 'react-native-vector-icons/Feather';
import airdropImg from '@src/assets/images/airdrop.png';
import { COLORS, FONT } from '@src/styles';

const style = StyleSheet.create({
  container: {
    paddingLeft: 0,
    paddingRight: 0
  },
  content: {
    padding: scaleInApp(31),
    paddingBottom: 150,
  },
  titleText: {
    fontSize: scaleInApp(18),
    color: COLORS.black,
    letterSpacing: 0,
    lineHeight: scaleInApp(25),
    marginBottom: scaleInApp(20),
    ...FONT.STYLE.medium
  },
  items: {
    marginBottom: scaleInApp(23),
  },
  item: {
    flexDirection: 'row',
    alignItems: 'center',
    marginVertical: 8
  },
  itemIcon: {
    marginRight: scaleInApp(15)
  },
  itemText: {
    fontSize: scaleInApp(16),
    color: COLORS.black,
    letterSpacing: 0,
    lineHeight: scaleInApp(23),
  },
  descText: {
    fontSize: scaleInApp(16),
    color: COLORS.lightGrey9,
    letterSpacing: 0,
    lineHeight: scaleInApp(23),
    marginBottom: scaleInApp(40)
  },
  buttonText: {
    fontSize: scaleInApp(16),
    color: COLORS.white
  },
  button: {
    backgroundColor: COLORS.primary,
    height: scaleInApp(44)
  },
  image: {
    width: '100%',
  }
});
const DialogUpgradeToMainnet = React.memo(({ isVisible = true ,onButtonClick })=>{
  return (
    <Dialog
      width={0.9}
      height={0.65}
      visible={isVisible}
      onTouchOutside={() => {
      }}
    > 
      <DialogContent style={style.container}>
        <Image style={style.image} resizeMode="cover" source={airdropImg} />
        <ScrollView>
          <View style={style.content}>
            <Text style={style.titleText}>Welcome to Incognito! Here’s a little something to get you started.</Text>
            <View style={style.items}>
              {
                ['1 PRV is on its way to your default account (Account 0).', '1.1 PRV is on its way to your trading account (pDEX) ']
                  .map((text) => (
                    <View key={text} style={style.item}>
                      <Icons name='check' color={COLORS.green} style={style.itemIcon} size={28} />
                      <Text style={style.itemText}>{text}</Text>
                    </View>
                  ))
              }
            </View>

            <Text style={style.descText}>This will cover fees for thousands of transactions. We hope you enjoy Incognito!</Text>
            <ButtonExtension
              titleStyle={style.buttonText}
              buttonStyle={style.button}
              onPress={onButtonClick}
              title='Go incognito'
            />
          </View>
        </ScrollView>
      </DialogContent>

    </Dialog>
  );
});
export {
  DialogUpgradeToMainnet
};