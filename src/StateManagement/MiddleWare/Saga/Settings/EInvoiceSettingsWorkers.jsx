import { call, put } from 'redux-saga/effects';
import { MESSAGE_TYPE } from '@components/SnackBarContainer/SnackBarContainer';

import {
  SetStateGetEInvoice,
  SetStatePatchEInvoice,
} from '../../../Store/Reducers/Settings/EInvoiceSettingsState';
import {
  openSnackbar,
  enableLoading,
} from '../../../Store/Reducers/Errors/Errors';

import {
  GetEInvoice_API,
  PostEInvoice_API,
  PatchEInvoice_API,
  DeleteEInvoice_API,
} from '../../API/Settings/EInvoiceSettingsApi';

export function* PostEInvoice() {
  try {
    yield put(enableLoading(true));
    const res = yield call(PostEInvoice_API);
    if (res.status === 200) {
      yield put(SetStateGetEInvoice(res.data));
    } else {
      yield put(
        openSnackbar({ message: 'try again', type: MESSAGE_TYPE.ERROR })
      );
      yield put(SetStateGetEInvoice({}));
    }
    yield put(enableLoading(false));
  } catch (e) {
    console.log(`PostEInvoice : ${e}`);
    yield put(SetStateGetEInvoice({}));
    yield put(enableLoading(false));
  }
}

export function* GetEInvoice() {
  try {
    yield put(enableLoading(true));
    const res = yield call(GetEInvoice_API);
    if (res.status === 200) {
      yield put(SetStateGetEInvoice(res.data));
    } else {
      yield put(
        openSnackbar({ message: 'try again', type: MESSAGE_TYPE.ERROR })
      );
      yield put(SetStateGetEInvoice({}));
    }
    yield put(enableLoading(false));
  } catch (e) {
    // if (e?.response?.data?.message === 'Please enable E-Invoice') {
    //   yield put(enableLoading(false));
    //   yield call(PostEInvoice);
    // }
    console.log(`GetEInvoice : ${e}`);
    yield put(SetStateGetEInvoice({}));
    yield put(enableLoading(false));
  }
}

export function* PatchEInvoice({ payload }) {
  try {
    yield put(enableLoading(true));
    const res = yield call(PatchEInvoice_API, payload);
    if (res.status === 200) {
      yield put(SetStatePatchEInvoice('updated'));
      yield put(
        openSnackbar({
          message: 'Updated Successfully',
          type: MESSAGE_TYPE.INFO,
        })
      );
    } else {
      yield put(
        openSnackbar({ message: 'try again', type: MESSAGE_TYPE.ERROR })
      );
      yield put(SetStatePatchEInvoice(null));
    }
    yield put(enableLoading(false));
  } catch (e) {
    console.log(`PatchEInvoice : ${e}`);
    yield put(SetStatePatchEInvoice(null));
    yield put(enableLoading(false));
  }
}

export function* DeleteEInvoice({ payload }) {
  try {
    yield put(enableLoading(true));
    const res = yield call(DeleteEInvoice_API, payload);
    if (res.status === 200) {
      yield put(
        openSnackbar({
          message: res?.data?.message || 'E-Invoicing disabled',
          type: MESSAGE_TYPE.INFO,
        })
      );
      yield put(SetStatePatchEInvoice('updated'));
    } else {
      yield put(
        openSnackbar({ message: 'try again', type: MESSAGE_TYPE.ERROR })
      );
      yield put(SetStatePatchEInvoice(null));
    }
    yield put(enableLoading(false));
  } catch (e) {
    console.log(`DeleteEInvoice : ${e}`);
    yield put(SetStatePatchEInvoice(null));
    yield put(enableLoading(false));
  }
}
