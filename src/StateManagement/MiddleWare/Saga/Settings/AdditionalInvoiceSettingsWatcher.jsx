import { takeLatest } from 'redux-saga/effects';

import {
  GetEstimateNameState,
  PatchEstimateNameState,
} from '../../../Store/Reducers/Settings/AdditionalInvoicesettings';

import{
  GetEstimateName,
  PatchEstimateName,
} from './AdditionalInvoiceSettingsWorker';

export function* GetEstimateNameCall() {
  yield takeLatest(GetEstimateNameState.type, GetEstimateName);
}

export function* PatchEstimateNameCall() {
  yield takeLatest(PatchEstimateNameState.type, PatchEstimateName);
}