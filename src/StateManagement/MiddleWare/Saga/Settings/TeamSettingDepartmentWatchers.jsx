import { takeLatest } from 'redux-saga/effects';

import {
  getDepartment,
  getOneDepartment,
  postDepartment,
  updateDepartment,
  deleteDepartment,
  getManager,
} from '@action/Store/Reducers/Settings/TeamSettingDepartmentState';

import {
  GetDepartmentDetails,
  GetOneDepartmentDetail,
  PostDepartmentDetails,
  UpdateDepartmentDetails,
  DeleteDepartmentDetail,
  GetManagerDetails,
} from './TeamSettingDepartmentWorkers';

export function* GetDepartment() {
  yield takeLatest(getDepartment.type, GetDepartmentDetails);
}

export function* GetOneDepartment() {
  yield takeLatest(getOneDepartment.type, GetOneDepartmentDetail);
}

export function* PostDepartment() {
  yield takeLatest(postDepartment.type, PostDepartmentDetails);
}

export function* UpdateDepartment() {
  yield takeLatest(updateDepartment.type, UpdateDepartmentDetails);
}

export function* DeleteDepartment() {
  yield takeLatest(deleteDepartment.type, DeleteDepartmentDetail);
}

export function* GetManager() {
  yield takeLatest(getManager.type, GetManagerDetails);
}
