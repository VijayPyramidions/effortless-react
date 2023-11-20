import { takeLatest } from 'redux-saga/effects';

import {
  GetInvoiceToBeGeneratedState,
  GetInvoiceGeneratedEWayBillsState,
  PostInvoiceEWayBillState,
  GetTransportersListState,
  PatchInvoiceUpdateEWayBillState,
  PostTransportersCreateState,
  GetIndividualInvoiceEWayBillState,
  DeleteInvoiceEWayBillPDFState,
  PostInvoiceEWayBillNewVehicleState,
  PatchDeactivateInvoiceEWayBillState,
} from '../../../Store/Reducers/Invoice/InvoiceEWayBillState';

import {
  GetInvoiceEWayBill,
  GetInvoiceGeneratedEWayBills,
  PostInvoiceEWayBill,
  GetTransportersList,
  PatchInvoiceUpdateEWayBill,
  PostTransportersCreate,
  GetIndividualInvoiceEWayBill,
  DeleteInvoiceEWayBillPDF,
  PostInvoiceEWayBillNewVehicle,
  PatchDeactivateInvoiceEWayBill,
} from './InvoiceEWayBillWorkers';

export function* GetInvoiceEWayBillCall() {
  yield takeLatest(GetInvoiceToBeGeneratedState.type, GetInvoiceEWayBill);
}
export function* GetInvoiceGeneratedEWayBillsCall() {
  yield takeLatest(
    GetInvoiceGeneratedEWayBillsState.type,
    GetInvoiceGeneratedEWayBills
  );
}
export function* PatchInvoiceUpdateEWayBillCall() {
  yield takeLatest(
    PatchInvoiceUpdateEWayBillState.type,
    PatchInvoiceUpdateEWayBill
  );
}
export function* PostInvoiceEWayBillCall() {
  yield takeLatest(PostInvoiceEWayBillState.type, PostInvoiceEWayBill);
}
export function* GetTransportersListCall() {
  yield takeLatest(GetTransportersListState.type, GetTransportersList);
}
export function* PostTransportersCreateCall() {
  yield takeLatest(PostTransportersCreateState.type, PostTransportersCreate);
}

export function* GetIndividualInvoiceEWayBillCall() {
  yield takeLatest(
    GetIndividualInvoiceEWayBillState.type,
    GetIndividualInvoiceEWayBill
  );
}

export function* DeleteInvoiceEWayBillPDFCall() {
  yield takeLatest(
    DeleteInvoiceEWayBillPDFState.type,
    DeleteInvoiceEWayBillPDF
  );
}

export function* PostInvoiceEWayBillNewVehicleCall() {
  yield takeLatest(
    PostInvoiceEWayBillNewVehicleState.type,
    PostInvoiceEWayBillNewVehicle
  );
}

export function* PatchDeactivateInvoiceEWayBillCall() {
  yield takeLatest(
    PatchDeactivateInvoiceEWayBillState.type,
    PatchDeactivateInvoiceEWayBill
  );
}
