import type from '@src/redux/types/pin';
import LocalDatabase from '@utils/LocalDatabase';
import convertUtil from '@utils/convert';

export const loadPin = () => async (dispatch) => {
  const pin = await LocalDatabase.getPIN();
  dispatch({
    type: type.UPDATE,
    payload: pin,
  });
};

export const updatePin = (newPin) => async (dispatch) => {
  const hashPin = convertUtil.toHash(newPin);
  await LocalDatabase.savePIN(hashPin);

  console.debug('UPDATE', newPin, hashPin);
  dispatch({
    type: type.UPDATE,
    payload: hashPin,
  });
};
