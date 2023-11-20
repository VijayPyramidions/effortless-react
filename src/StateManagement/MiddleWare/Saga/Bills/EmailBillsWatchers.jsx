import { takeLatest } from 'redux-saga/effects';

import {
  GetEmailUserListState,
  PostNewEmailUserState,
  PostEmailSyncState,
  DeleteEmailState,
  GetEmailBillsListState,
  GetEmailBillsProviderCategoryState,
  PostNewProviderState,
  GetAllEmailListDataState,
  GetSingleEmailBillState,
  DeleteEmailBillState,
  DeleteEmailProviderState,
} from '../../../Store/Reducers/Bills/EmailBillsState';
import {
  GetEmailUserList,
  PostNewEmailUser,
  PostEmailSync,
  DeleteEmail,
  GetEmailBillsList,
  GetEmailBillsProviderCategory,
  PostNewProvider,
  GetAllEmailListData,
  GetSingleEmailBill,
  DeleteEmailBill,
  DeleteEmailProvider,
} from './EmailBillsWorkers';

// Email Bills

export function* GetEmailUserListCall() {
  yield takeLatest(GetEmailUserListState.type, GetEmailUserList);
}

export function* GetEmailBillsListCall() {
  yield takeLatest(GetEmailBillsListState.type, GetEmailBillsList);
}

export function* GetEmailBillsProviderCategoryCall() {
  yield takeLatest(
    GetEmailBillsProviderCategoryState.type,
    GetEmailBillsProviderCategory
  );
}

export function* PostNewProviderCall() {
  yield takeLatest(PostNewProviderState.type, PostNewProvider);
}

export function* PostNewEmailUserCall() {
  yield takeLatest(PostNewEmailUserState.type, PostNewEmailUser);
}

export function* PostEmailSyncCall() {
  yield takeLatest(PostEmailSyncState.type, PostEmailSync);
}

export function* DeleteEmailCall() {
  yield takeLatest(DeleteEmailState.type, DeleteEmail);
}

export function* DeleteEmailBillCall() {
  yield takeLatest(DeleteEmailBillState.type, DeleteEmailBill);
}

export function* DeleteEmailProviderCall() {
  yield takeLatest(DeleteEmailProviderState.type, DeleteEmailProvider);
}

export function* GetSingleEmailBillCall() {
  yield takeLatest(GetSingleEmailBillState.type, GetSingleEmailBill);
}

// Email List
export function* GetAllEmailListDataCall() {
  yield takeLatest(GetAllEmailListDataState.type, GetAllEmailListData);
}
