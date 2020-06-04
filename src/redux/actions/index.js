import accountService from '@src/services/wallet/accountService';
import { CustomError, ErrorCode } from '@src/services/exception';
import { getPassphrase } from '@src/services/wallet/passwordService';
import { reloadAccountList } from './wallet';

export const actionImportAccount = ({
  privateKey,
  oldPrivateKey,
  accountName,
}) => async (dispatch, getState) => {
  const state = getState();
  const wallet = state?.wallet;
  const passphrase = await getPassphrase();
  try {
    const isImported = await accountService.importAccount(
      privateKey,
      accountName,
      passphrase,
      wallet,
    );
    if (!isImported) {
      throw new CustomError(ErrorCode.importAccount_failed);
    }
  } catch (error) {
    await accountService.importAccount(
      oldPrivateKey,
      accountName,
      passphrase,
      wallet,
    );
    throw Error(error);
  } finally {
    await dispatch(reloadAccountList());
  }
};
