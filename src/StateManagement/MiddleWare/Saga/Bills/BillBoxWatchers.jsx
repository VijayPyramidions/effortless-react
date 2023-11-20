import { takeLatest } from 'redux-saga/effects';

import {
  GetBillBoxBillsState,
  GetVendorBillsCountState,
  GetVendorBillDetailsState,
  DeleteVendorBillState,
} from '../../../Store/Reducers/Bills/BillBoxState';
import {
  GetBillBoxBills,
  GetVendorBillsCount,
  GetVendorBillDetails,
  DeleteVendorBill,
} from './BillBoxWorkers';

export function* GetBillBoxBillsCall() {
  yield takeLatest(GetBillBoxBillsState.type, GetBillBoxBills);
}

export function* GetVendorBillsCountCall() {
  yield takeLatest(GetVendorBillsCountState.type, GetVendorBillsCount);
}

export function* GetVendorBillDetailsCall() {
  yield takeLatest(GetVendorBillDetailsState.type, GetVendorBillDetails);
}

export function* DeleteVendorBillCall() {
  yield takeLatest(DeleteVendorBillState.type, DeleteVendorBill);
}
