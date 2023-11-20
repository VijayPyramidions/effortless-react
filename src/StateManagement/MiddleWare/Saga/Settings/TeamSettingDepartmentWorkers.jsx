import { call, put } from 'redux-saga/effects';
import { MESSAGE_TYPE } from '@components/SnackBarContainer/SnackBarContainer';

import {
  openSnackbar,
  enableLoading,
} from '@action/Store/Reducers/Errors/Errors';

import {
  getDepartment,
  setDepartment,
  setManager,
  setOneDepartment,
  setDepartmentAction,
} from '@action/Store/Reducers/Settings/TeamSettingDepartmentState';

import {
  DeleteDepartmentDetailApi,
  GetDepartmentDetailsApi,
  GetManagerDetailsApi,
  GetOneDepartmentDetailApi,
  PostDepartmentDetailsApi,
  UpdateDepartmentDetailsApi,
} from '../../API/Settings/TeamSettingDepartmentApi';

export function* GetDepartmentDetails() {
  yield put(enableLoading(true));
  try {
    const res = yield call(GetDepartmentDetailsApi);
    if (res.status === 200) yield put(setDepartment(res.data.data));
    else
      yield put(
        openSnackbar({
          message: 'Sothing wrong stry again',
          type: MESSAGE_TYPE.ERROR,
        })
      );

    yield put(enableLoading(false));
  } catch (e) {
    console.log(`GetDepartmentDetails : ${e}`);
    yield put(enableLoading(false));
    yield put(setDepartment([]));
  }
}

export function* GetOneDepartmentDetail({ payload }) {
  yield put(enableLoading(true));
  try {
    const res = yield call(GetOneDepartmentDetailApi, payload);
    if (res.status === 200) yield put(setOneDepartment(res.data));

    yield put(enableLoading(false));
  } catch (e) {
    console.log(`GetOneDepartmentDetail : ${e}`);
    yield put(enableLoading(false));
    yield put(setOneDepartment({}));
  }
}

export function* PostDepartmentDetails({ payload }) {
  yield put(enableLoading(true));
  try {
    const res = yield call(PostDepartmentDetailsApi, payload);
    if (res.status === 200) {
      yield put(
        openSnackbar({
          message: 'Department details added successfully',
          type: MESSAGE_TYPE.INFO,
        })
      );
      yield put(setDepartmentAction('departmentAdded'));
      yield put(getDepartment());
    } else
      yield put(
        openSnackbar({
          message: res.message || 'Sothing wrong stry again',
          type: MESSAGE_TYPE.ERROR,
        })
      );

    yield put(enableLoading(false));
  } catch (e) {
    console.log(`PostDepartmentDetails : ${e}`);
    yield put(enableLoading(false));
  }
}

export function* UpdateDepartmentDetails({ payload }) {
  yield put(enableLoading(true));
  try {
    const res = yield call(UpdateDepartmentDetailsApi, payload);
    if (res.status === 200) {
      yield put(
        openSnackbar({
          message: 'Department details updated successfully',
          type: MESSAGE_TYPE.INFO,
        })
      );
      yield put(setDepartmentAction('departmentUpdated'));
      yield put(getDepartment());
    } else
      yield put(
        openSnackbar({
          message: 'Sothing wrong stry again',
          type: MESSAGE_TYPE.ERROR,
        })
      );

    yield put(enableLoading(false));
  } catch (e) {
    console.log(`UpdateDepartmentDetails : ${e}`);
    yield put(enableLoading(false));
  }
}

export function* DeleteDepartmentDetail({ payload }) {
  yield put(enableLoading(true));
  try {
    const res = yield call(DeleteDepartmentDetailApi, payload);
    if (res.status === 200) {
      yield put(
        openSnackbar({
          message: 'Department deleted successfully',
          type: MESSAGE_TYPE.INFO,
        })
      );
      yield put(setDepartmentAction('departmentDeleted'));
      yield put(getDepartment());
    }

    yield put(enableLoading(false));
  } catch (e) {
    console.log(`DeleteDepartmentDetail : ${e}`);
    yield put(enableLoading(false));
  }
}

export function* GetManagerDetails() {
  yield put(enableLoading(true));
  try {
    const res = yield call(GetManagerDetailsApi);
    if (res.status === 200) yield put(setManager(res.data));
    else
      yield put(
        openSnackbar({
          message: 'Sothing wrong stry again',
          type: MESSAGE_TYPE.ERROR,
        })
      );

    yield put(enableLoading(false));
  } catch (e) {
    console.log(`GetManagerDetails : ${e}`);
    yield put(enableLoading(false));
  }
}
