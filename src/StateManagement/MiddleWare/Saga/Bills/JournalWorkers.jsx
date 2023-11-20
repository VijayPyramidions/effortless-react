import { call, put } from 'redux-saga/effects';

import {
  setJournals,
  setOneJournal,
  setJouralDesc,
  setDrawer,
  getJournals,
  setJournalAccounts,
  setJournalContacts,
} from '@action/Store/Reducers/Bills/JournalState';

import {
  openSnackbar,
  enableLoading,
} from '@action/Store/Reducers/Errors/Errors';

import { MESSAGE_TYPE } from '@components/SnackBarContainer/SnackBarContainer';

import {
  GetJournalsDetailsApi,
  GetOneJournalDetailApi,
  PostJournalDetailApi,
  UpdateJournalDetailApi,
  DeleteJournalDetailApi,
  GetJournalDescDetailsApi,
  GetJournalAccountsDetailsApi,
  GetJournalContactsDetailsApi,
} from '../../API/Bills/JournalApi';

export function* GetJournalsDetails() {
  try {
    yield put(enableLoading(true));
    const res = yield call(GetJournalsDetailsApi);

    if (res.status === 200) yield put(setJournals(res.data));
    else
      yield put(
        openSnackbar({ message: 'Try again', type: MESSAGE_TYPE.ERROR })
      );

    yield put(enableLoading(false));
  } catch (e) {
    yield put(enableLoading(false));
    yield put(setJournals([]));
    console.log(`GetJournalsDetails : ${e}`);
  }
}

export function* GetOneJournalDetail({ payload }) {
  try {
    yield put(enableLoading(true));
    const res = yield call(GetOneJournalDetailApi, payload);

    if (res.status === 200) {
      yield put(setOneJournal(res.data));
      yield put(setDrawer({ name: 'open', value: true }));
    } else
      yield put(
        openSnackbar({ message: 'Try again', type: MESSAGE_TYPE.ERROR })
      );

    yield put(enableLoading(false));
  } catch (e) {
    yield put(enableLoading(false));
    yield put(setOneJournal({}));
    console.log(`GetOneJournalDetail : ${e}`);
  }
}

export function* PostJournalDetail({ payload }) {
  try {
    yield put(enableLoading(true));
    const res = yield call(PostJournalDetailApi, payload);

    if (res.status === 200)
      yield yield put(
        openSnackbar({
          message: 'Journal created successfully',
          type: MESSAGE_TYPE.INFO,
        })
      );
    else
      yield put(
        openSnackbar({ message: 'Try again', type: MESSAGE_TYPE.ERROR })
      );
    yield put(enableLoading(false));
    yield put(setDrawer({ name: 'open', value: false }));
    yield put(getJournals());
  } catch (e) {
    yield put(enableLoading(false));
    console.log(`PostJournalDetail : ${e}`);
  }
}

export function* UpdateJournalDetail({ payload }) {
  try {
    yield put(enableLoading(true));
    const res = yield call(UpdateJournalDetailApi, payload);

    if (res.status === 200)
      yield put(
        openSnackbar({
          message: 'Journal details updated successfully',
          type: MESSAGE_TYPE.INFO,
        })
      );
    else
      yield put(
        openSnackbar({ message: 'Try again', type: MESSAGE_TYPE.ERROR })
      );

    yield put(enableLoading(false));
    yield put(setDrawer({ name: 'open', value: false }));
    yield put(getJournals());
  } catch (e) {
    yield put(enableLoading(false));
    console.log(`UpdateJournalDetail : ${e}`);
  }
}

export function* DeleteJournalDetail({ payload }) {
  try {
    yield put(enableLoading(true));
    const res = yield call(DeleteJournalDetailApi, payload);

    if (res.status === 200)
      yield put(
        openSnackbar({
          message: 'Journal details deleted successfully',
          type: MESSAGE_TYPE.INFO,
        })
      );
    else
      yield put(
        openSnackbar({ message: 'Try again', type: MESSAGE_TYPE.ERROR })
      );
    yield put(setDrawer({ name: 'delete', value: false }));
    yield put(setDrawer({ name: 'open', value: false }));
    yield put(enableLoading(false));
    yield put(getJournals());
  } catch (e) {
    yield put(enableLoading(false));
    console.log(`DeleteJournalDetail : ${e}`);
  }
}

export function* GetJournalDescDetails() {
  try {
    yield put(enableLoading(true));
    const res = yield call(GetJournalDescDetailsApi);

    if (res.status === 200) yield put(setJouralDesc(res.data.data));
    else
      yield put(
        openSnackbar({ message: 'Try again', type: MESSAGE_TYPE.ERROR })
      );

    yield put(enableLoading(false));
  } catch (e) {
    yield put(enableLoading(false));
    yield put(setJouralDesc([]));
    console.log(`GetJournalDescDetails : ${e}`);
  }
}

export function* GetJournalAccountsDetails({ payload }) {
  try {
    yield put(enableLoading(true));
    const res = yield call(GetJournalAccountsDetailsApi, payload);

    if (res.status === 200) yield put(setJournalAccounts(res.data.data));
    else
      yield put(
        openSnackbar({ message: 'Try again', type: MESSAGE_TYPE.ERROR })
      );

    yield put(enableLoading(false));
  } catch (e) {
    yield put(enableLoading(false));
    yield put(setJournalAccounts([]));
    console.log(`GetJournalAccountsDetails : ${e}`);
  }
}

export function* GetJournalContactsDetails({ payload }) {
  try {
    yield put(enableLoading(true));
    const res = yield call(GetJournalContactsDetailsApi, payload);

    if (res.status === 200) yield put(setJournalContacts(res.data.data));
    else
      yield put(
        openSnackbar({ message: 'Try again', type: MESSAGE_TYPE.ERROR })
      );

    yield put(enableLoading(false));
  } catch (e) {
    yield put(enableLoading(false));
    yield put(setJournalContacts([]));
    console.log(`GetJournalContactsDetails : ${e}`);
  }
}
