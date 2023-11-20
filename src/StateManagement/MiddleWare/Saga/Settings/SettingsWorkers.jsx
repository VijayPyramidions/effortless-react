import { call, put } from 'redux-saga/effects';
import { MESSAGE_TYPE } from '@components/SnackBarContainer/SnackBarContainer';

import {
  openSnackbar,
  enableLoading,
} from '@action/Store/Reducers/Errors/Errors';

import {
  setOrganizationSettings,
  setOrganizationSettingsAction,
} from '@action/Store/Reducers/Settings/SettingsState';

import {
  GetOrganizationSettingsDetails_Api,
  PatchOrganizationSettingsDetails_Api,
} from '../../API/Settings/SettingApi';

export function* GetOrganizationSettingsDetails() {
  yield put(enableLoading(true));
  try {
    const res = yield call(GetOrganizationSettingsDetails_Api);
    if (res.status === 200) yield put(setOrganizationSettings(res.data));
    else
      yield put(
        openSnackbar({
          message: 'Something wrong try again',
          type: MESSAGE_TYPE.ERROR,
        })
      );

    yield put(enableLoading(false));
  } catch (e) {
    console.log(`GetOrganizationSettingsDetails : ${e}`);
    yield put(enableLoading(false));
    yield put(setOrganizationSettings([]));
  }
}

export function* PatchOrganizationSettingsDetails({ payload }) {
  yield put(enableLoading(true));
  try {
    const res = yield call(PatchOrganizationSettingsDetails_Api, payload);
    if (res.status === 200)
      yield put(setOrganizationSettingsAction('organizationUpdated'));
    else
      yield put(
        openSnackbar({
          message: 'Something wrong try again',
          type: MESSAGE_TYPE.ERROR,
        })
      );

    yield put(enableLoading(false));
  } catch (e) {
    console.log(`PatchOrganizationSettingsDetails : ${e}`);
    yield put(enableLoading(false));
    yield put(setOrganizationSettings([]));
  }
}
