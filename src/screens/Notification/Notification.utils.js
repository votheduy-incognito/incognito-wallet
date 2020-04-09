import {CONSTANT_COMMONS} from '@src/constants';

export const normalizedData = item => {
  return {
    id: item?.ID ? item?.ID : '',
    title: item?.Title ? item?.Title : '',
    desc: item?.Content ? item?.Content : '',
    time: item?.CreatedAt ? item?.CreatedAt : new Date().getTime() / 1000,
    type: item?.TypeNotification ? item?.TypeNotification : '',
    read: item?.IsRead === 'true' || item?.IsRead === true,
    tokenId: item?.TokenID ? item?.TokenID : CONSTANT_COMMONS.PRV_TOKEN_ID,
    publicKey: item?.PublicKey ? item?.PublicKey : '',
    screen: item?.Screen || '',
    screenParams: item?.ScreenParams || '',
  };
};

export const updateReadAll = (list = []) =>
  [...list].every(item => item.read === true);

export const mappingData = list => list.map(item => normalizedData(item));

export const delay = timeout =>
  new Promise(resolve => setTimeout(resolve, timeout));
