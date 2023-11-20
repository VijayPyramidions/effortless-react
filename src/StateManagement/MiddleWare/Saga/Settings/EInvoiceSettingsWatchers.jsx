import { takeLatest } from 'redux-saga/effects';

import {
  GetEInvoiceState,
  PatchEInvoiceState,
  PostEInvoiceState,
  DeleteEInvoiceState,
} from '../../../Store/Reducers/Settings/EInvoiceSettingsState';
import {
  PostEInvoice,
  GetEInvoice,
  PatchEInvoice,
  DeleteEInvoice,
} from './EInvoiceSettingsWorkers';

export function* GetEInvoiceCall() {
  yield takeLatest(GetEInvoiceState.type, GetEInvoice);
}

export function* PostEInvoiceCall() {
  yield takeLatest(PostEInvoiceState.type, PostEInvoice);
}

export function* DeleteEInvoiceCall() {
  yield takeLatest(DeleteEInvoiceState.type, DeleteEInvoice);
}
export function* PatchEInvoiceCall() {
  yield takeLatest(PatchEInvoiceState.type, PatchEInvoice);
}
