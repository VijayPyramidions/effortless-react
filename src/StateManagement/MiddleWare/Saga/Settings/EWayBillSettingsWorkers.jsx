import { call, put } from 'redux-saga/effects';
import { MESSAGE_TYPE } from '@components/SnackBarContainer/SnackBarContainer';

import {
  SetStateGetEWayBill,
  SetStatePatchEWayBill,
} from '../../../Store/Reducers/Settings/EWayBillSettingsState';
import {
  openSnackbar,
  enableLoading,
} from '../../../Store/Reducers/Errors/Errors';

import {
  GetEWayBill_API,
  PostEWayBill_API,
  PatchEWayBill_API,
  DeleteEWayBill_API,
} from '../../API/Settings/EWayBillSettingsApi';

export function* PostEWayBill() {
  try {
    yield put(enableLoading(true));
    const res = yield call(PostEWayBill_API);
    if (res.status === 200) {
      yield put(SetStateGetEWayBill(res.data));
    } else {
      yield put(
        openSnackbar({ message: 'try again', type: MESSAGE_TYPE.ERROR })
      );
      yield put(SetStateGetEWayBill({}));
    }
    yield put(enableLoading(false));
  } catch (e) {
    console.log(`PostEWayBill : ${e}`);
    yield put(SetStateGetEWayBill({}));
    yield put(enableLoading(false));
  }
}

export function* GetEWayBill() {
  try {
    yield put(enableLoading(true));
    const res = yield call(GetEWayBill_API);
    if (res.status === 200) {
      yield put(SetStateGetEWayBill(res.data));
    } else {
      yield put(
        openSnackbar({ message: 'try again', type: MESSAGE_TYPE.ERROR })
      );
      yield put(SetStateGetEWayBill({}));
    }
    yield put(enableLoading(false));
  } catch (e) {
    console.log(`GetEWayBill : ${e}`);
    yield put(SetStateGetEWayBill({}));
    yield put(enableLoading(false));
  }
}

export function* PatchEWayBill({ payload }) {
  try {
    yield put(enableLoading(true));
    const res = yield call(PatchEWayBill_API, payload);
    if (res.status === 200) {
      yield put(SetStatePatchEWayBill('updated'));
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
      yield put(SetStatePatchEWayBill(null));
    }
    yield put(enableLoading(false));
  } catch (e) {
    console.log(`PatchEWayBill : ${e}`);
    yield put(SetStatePatchEWayBill(null));
    yield put(enableLoading(false));
  }
}

export function* DeleteEWayBill({ payload }) {
  try {
    yield put(enableLoading(true));
    const res = yield call(DeleteEWayBill_API, payload);
    if (res.status === 200) {
      yield put(
        openSnackbar({
          message: res?.data?.message || 'E-Invoicing disabled',
          type: MESSAGE_TYPE.INFO,
        })
      );
      yield put(SetStatePatchEWayBill('updated'));
    } else {
      yield put(
        openSnackbar({ message: 'try again', type: MESSAGE_TYPE.ERROR })
      );
      yield put(SetStatePatchEWayBill(null));
    }
    yield put(enableLoading(false));
  } catch (e) {
    console.log(`DeleteEWayBill : ${e}`);
    yield put(SetStatePatchEWayBill(null));
    yield put(enableLoading(false));
  }
}
