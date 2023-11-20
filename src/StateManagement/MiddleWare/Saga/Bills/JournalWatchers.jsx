import { takeLatest } from 'redux-saga/effects';

import {
  getJournals,
  getOneJournal,
  postJournal,
  updateJournal,
  deleteJournal,
  getJournalDesc,
  getJournalAccounts,
  getJournalContacts,
} from '@action/Store/Reducers/Bills/JournalState';

import {
  GetJournalsDetails,
  GetOneJournalDetail,
  PostJournalDetail,
  UpdateJournalDetail,
  DeleteJournalDetail,
  GetJournalDescDetails,
  GetJournalAccountsDetails,
  GetJournalContactsDetails,
} from './JournalWorkers';

export function* GetJournals() {
  yield takeLatest(getJournals.type, GetJournalsDetails);
}

export function* GetOneJournal() {
  yield takeLatest(getOneJournal.type, GetOneJournalDetail);
}

export function* PostJournal() {
  yield takeLatest(postJournal.type, PostJournalDetail);
}

export function* UpdateJournal() {
  yield takeLatest(updateJournal.type, UpdateJournalDetail);
}

export function* DeleteJournal() {
  yield takeLatest(deleteJournal.type, DeleteJournalDetail);
}

export function* GetJournalDesc() {
  yield takeLatest(getJournalDesc.type, GetJournalDescDetails);
}

export function* GetJournalAccounts() {
  yield takeLatest(getJournalAccounts.type, GetJournalAccountsDetails);
}

export function* GetJournalContacts() {
  yield takeLatest(getJournalContacts.type, GetJournalContactsDetails);
}
