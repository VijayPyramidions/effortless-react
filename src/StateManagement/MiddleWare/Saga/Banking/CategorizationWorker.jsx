import { call, put } from 'redux-saga/effects';

import { MESSAGE_TYPE } from '@components/SnackBarContainer/SnackBarContainer';

import {
  updateLoader,
  anotherCategorizationUpdate,
  opModalUpdate,
  alertDisplayMessageUpdate,
  alertWarningUpdate,
  buttonText1Update,
  buttonText2Update,
  closeButtonUpdate,
  alertOpenUpdate,
  buttonInProcessUpdate,
  categorizationDoneUpdate,
  setContraBanks,
} from '../../../Store/Reducers/Banking/CategorizationState';
import { openSnackbar } from '../../../Store/Reducers/Errors/Errors';

import {
  EntityUpdate_Api,
  postBillSettlement_Api,
  GetContraBanks_Api,
} from '../../API/Banking/CategorizationApi';

export function* EntityUpdate({ payload }) {
  try {
    const res = yield call(EntityUpdate_Api, payload);
    yield put(updateLoader(0));
    if (res.status === 200)
      yield put(
        openSnackbar({
          message: res.message,
          type: MESSAGE_TYPE.INFO,
        })
      );
  } catch (e) {
    console.log(`EntityUpdate : ${e}`);
    yield put(updateLoader(0));
  }
}
export function* postBillSettlement({ payload }) {
  try {
    const res = yield call(postBillSettlement_Api, payload);
    yield put(updateLoader(0));
    if (res.message) {
      yield put(anotherCategorizationUpdate(true));
      yield put(opModalUpdate(true));
      yield put(alertDisplayMessageUpdate('Categorization done'));
      yield put(alertWarningUpdate('Information'));
      yield put(buttonText1Update(''));
      yield put(buttonText2Update('Ok'));
      yield put(closeButtonUpdate(false));
      yield put(alertOpenUpdate(true));
    } else if (res) yield put(buttonInProcessUpdate(true));
    yield put(categorizationDoneUpdate(true));
  } catch (e) {
    console.log(`postBillSettlement : ${e}`);
    yield put(updateLoader(0));
    yield put(buttonInProcessUpdate(true));
    yield put(
      openSnackbar({
        message: e.message,
        type: MESSAGE_TYPE.WARNING,
      })
    );
  }
}

export function* GetContraBanks() {
  try {
    const res = yield call(GetContraBanks_Api);
    yield put(updateLoader(0));
    if (res.status === 200) {
      if (res.message)
        yield put(
          openSnackbar({
            message: res.message,
            type: MESSAGE_TYPE.INFO,
          })
        );
      else {
        let cdata = res.data.connected_banking;
        cdata = cdata.concat(res.data.other_bank_accounts);
        yield put(setContraBanks(cdata));
      }
    }
  } catch (e) {
    console.log(`GetContraBanks : ${e}`);
    yield put(updateLoader(0));
  }
}
