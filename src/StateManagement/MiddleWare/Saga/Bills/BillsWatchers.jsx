import { takeLatest } from 'redux-saga/effects';

import {
  GetBillsListState,
  GetVendorBillDetailsState,
  DeleteVendorBillState,
  PatchVendorBillState
} from '../../../Store/Reducers/Bills/BillsState';
import {
  GetBillsList,
  GetVendorBillDetails,
  DeleteVendorBill,
  PatchVendorBill
} from './BillsWorkers';

export function* GetGeneralVendorBillDetailsCall() {
  yield takeLatest(GetVendorBillDetailsState.type, GetVendorBillDetails);
}

export function* DeleteGeneralVendorBillsCall() {
  yield takeLatest(DeleteVendorBillState.type, DeleteVendorBill);
}

export function* PatchGeneralVendorBillsCall() {
  yield takeLatest(PatchVendorBillState.type, PatchVendorBill);
}

export function* GetBillsListCall() {
  yield takeLatest(GetBillsListState.type, GetBillsList);
}
