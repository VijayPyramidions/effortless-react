import { takeLatest } from 'redux-saga/effects';

import {
  getReimbursements,
  postReimbursement,
  patchReimbursement,
  getOneReimbursement,
  getMileageHistory,
} from '@action/Store/Reducers/Settings/ReimburssementSettingsState';

import {
  GetReimbursementsDetails,
  PostReimbursementDetails,
  PatchReimbursementDetails,
  GetOneReimbursementDetails,
  GetMileageHistoryDetails,
} from './ReimbursementSettingsWorkers';

export function* GetReimbursements() {
  yield takeLatest(getReimbursements.type, GetReimbursementsDetails);
}

export function* PostReimbursement() {
  yield takeLatest(postReimbursement.type, PostReimbursementDetails);
}

export function* PatchReimbursement() {
  yield takeLatest(patchReimbursement.type, PatchReimbursementDetails);
}

export function* GetOneReimbursement() {
  yield takeLatest(getOneReimbursement.type, GetOneReimbursementDetails);
}

export function* GetMileageHistory() {
  yield takeLatest(getMileageHistory.type, GetMileageHistoryDetails);
}
