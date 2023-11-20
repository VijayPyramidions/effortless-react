import { takeLatest } from 'redux-saga/effects';

import {
  GetEWayBillState,
  PatchEWayBillState,
  PostEWayBillState,
  DeleteEWayBillState,
} from '../../../Store/Reducers/Settings/EWayBillSettingsState';
import {
  PostEWayBill,
  GetEWayBill,
  PatchEWayBill,
  DeleteEWayBill,
} from './EWayBillSettingsWorkers';

export function* GetEWayBillCall() {
  yield takeLatest(GetEWayBillState.type, GetEWayBill);
}

export function* PostEWayBillCall() {
  yield takeLatest(PostEWayBillState.type, PostEWayBill);
}

export function* DeleteEWayBillCall() {
  yield takeLatest(DeleteEWayBillState.type, DeleteEWayBill);
}
export function* PatchEWayBillCall() {
  yield takeLatest(PatchEWayBillState.type, PatchEWayBill);
}
