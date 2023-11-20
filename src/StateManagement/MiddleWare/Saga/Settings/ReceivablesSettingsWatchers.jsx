import { takeLatest } from 'redux-saga/effects';

import {
  GetReceivablesRemainderState,
  PostCreateReceivablesRemainderState,
  DeleteReceivablesRemainderState,
  GetReceivablesDuplicateRemainderState,
  PatchUpdateReceivablesRemainderState,
} from '../../../Store/Reducers/Settings/ReceivablesSettingsState';
import {
  GetReceivablesRemainder,
  PostCreateReceivablesRemainder,
  DeleteReceivablesRemainder,
  GetReceivablesDuplicateRemainder,
  PatchUpdateReceivablesRemainder,
} from './ReceivablesSettingsWorkers';

export function* GetReceivablesRemainderCall() {
  yield takeLatest(GetReceivablesRemainderState.type, GetReceivablesRemainder);
}

export function* PostCreateReceivablesRemainderCall() {
  yield takeLatest(PostCreateReceivablesRemainderState.type, PostCreateReceivablesRemainder);
}

export function* DeleteReceivablesRemainderCall() {
  yield takeLatest(DeleteReceivablesRemainderState.type, DeleteReceivablesRemainder);
}

export function* GetReceivablesDuplicateRemainderCall() {
  yield takeLatest(GetReceivablesDuplicateRemainderState.type, GetReceivablesDuplicateRemainder);
}

export function* PatchUpdateReceivablesRemainderCall() {
  yield takeLatest(PatchUpdateReceivablesRemainderState.type, PatchUpdateReceivablesRemainder);
}