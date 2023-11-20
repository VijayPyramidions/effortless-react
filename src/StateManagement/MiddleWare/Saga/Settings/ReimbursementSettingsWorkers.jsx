import { call, put } from 'redux-saga/effects';
import { MESSAGE_TYPE } from '@components/SnackBarContainer/SnackBarContainer';

import {
  setReimbursements,
  setOneReimbursement,
  setMileageHistory,
  getReimbursements,
  setDrawer,
} from '@action/Store/Reducers/Settings/ReimburssementSettingsState';

import {
  openSnackbar,
  enableLoading,
} from '@action/Store/Reducers/Errors/Errors';

import {
  GetReimbursementsDetails_Api,
  PostReimbursementDetails_Api,
  PatchReimbursementDetails_Api,
  GetOneReimbursementDetails_Api,
  GetMileageHistoryDetails_Api,
} from '../../API/Settings/ReimbursementSettingsApi';

export function* GetReimbursementsDetails() {
  yield put(enableLoading(true));
  try {
    const res = yield call(GetReimbursementsDetails_Api);
    if (res.status === 200) yield put(setReimbursements(res.data.data));
    else
      yield put(
        openSnackbar({
          message: 'Sothing wrong stry again',
          type: MESSAGE_TYPE.ERROR,
        })
      );

    yield put(enableLoading(false));
  } catch (e) {
    console.log(`GetReimbursementsDetails : ${e}`);
    yield put(enableLoading(false));
  }
}

export function* PostReimbursementDetails({ payload }) {
  yield put(enableLoading(true));
  try {
    const res = yield call(PostReimbursementDetails_Api, payload);
    if (res.status === 200) {
      yield put(
        openSnackbar({
          message: 'Policy Rules added successfully',
          type: MESSAGE_TYPE.INFO,
        })
      );
      yield put(getReimbursements());
      yield put(setDrawer({ name: 'expense', value: false }));
    } else
      yield put(
        openSnackbar({
          message: res.message || 'Sothing wrong stry again',
          type: MESSAGE_TYPE.ERROR,
        })
      );

    yield put(enableLoading(false));
  } catch (e) {
    console.log(`PostReimbursementDetails : ${e}`);
    yield put(enableLoading(false));
  }
}

export function* PatchReimbursementDetails({ payload }) {
  yield put(enableLoading(true));
  try {
    const res = yield call(PatchReimbursementDetails_Api, payload);
    if (res.status === 200) {
      yield put(setDrawer({ name: 'expense', value: false }));

      yield put(
        openSnackbar({
          message: 'Policy Rules updated successfully',
          type: MESSAGE_TYPE.INFO,
        })
      );
    } else
      yield put(
        openSnackbar({
          message: 'Sothing wrong stry again',
          type: MESSAGE_TYPE.ERROR,
        })
      );

    yield put(enableLoading(false));
  } catch (e) {
    console.log(`PatchReimbursementDetails : ${e}`);
    yield put(enableLoading(false));
  }
}

export function* GetOneReimbursementDetails({ payload }) {
  yield put(enableLoading(true));
  try {
    const res = yield call(GetOneReimbursementDetails_Api, payload);
    if (res.status === 200) yield put(setOneReimbursement(res.data));
    else
      yield put(
        openSnackbar({
          message: 'Sothing wrong stry again',
          type: MESSAGE_TYPE.ERROR,
        })
      );

    yield put(enableLoading(false));
  } catch (e) {
    console.log(`GetOneReimbursementDetails : ${e}`);
    yield put(enableLoading(false));
    yield put(setOneReimbursement({}));
  }
}

export function* GetMileageHistoryDetails({ payload }) {
  yield put(enableLoading(true));
  try {
    const res = yield call(GetMileageHistoryDetails_Api, payload);
    if (res.status === 200) yield put(setMileageHistory(res.data.data));
    else
      yield put(
        openSnackbar({
          message: 'Sothing wrong stry again',
          type: MESSAGE_TYPE.ERROR,
        })
      );

    yield put(enableLoading(false));
  } catch (e) {
    console.log(`GetMileageHistoryDetails : ${e}`);
    yield put(enableLoading(false));
  }
}
