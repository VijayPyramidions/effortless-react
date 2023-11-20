import { call, put } from 'redux-saga/effects';
import { MESSAGE_TYPE } from '@components/SnackBarContainer/SnackBarContainer';

import {
  SetStateGetExpenseList,
  SetStateGetAccountedBillsList,
  SetStatePostAccountedBillVersion,
} from '../../../Store/Reducers/Bills/AccountedBillsState';
import {
  openSnackbar,
  enableLoading,
} from '../../../Store/Reducers/Errors/Errors';

import {
  GetExpenseList_API,
  GetAccountedBillsList_API,
  PostAccountedBillVersion_API,
} from '../../API/Bills/AccountedBillApi';

export function* GetExpenseList({ payload }) {
  try {
    // yield put(enableLoading(true));
    const res = yield call(GetExpenseList_API, payload);
    if (res.status === 200) {
      yield put(SetStateGetExpenseList(res.data));
    } else {
      yield put(
        openSnackbar({ message: 'try again', type: MESSAGE_TYPE.ERROR })
      );
      yield put(SetStateGetExpenseList({}));
    }
    yield put(enableLoading(false));
  } catch (e) {
    console.log(`GetExpenseList : ${e}`);
    yield put(SetStateGetExpenseList({}));
    yield put(enableLoading(false));
  }
}

export function* GetAccountedBillsList({ payload }) {
  try {
    // yield put(enableLoading(true));
    const res = yield call(GetAccountedBillsList_API, payload);
    if (res.status === 200) {
      yield put(SetStateGetAccountedBillsList(res.data));
    } else {
      yield put(
        openSnackbar({ message: 'try again', type: MESSAGE_TYPE.ERROR })
      );
      yield put(SetStateGetAccountedBillsList({}));
    }
    yield put(enableLoading(false));
  } catch (e) {
    console.log(`GetAccountedBillsList : ${e}`);
    yield put(SetStateGetAccountedBillsList({}));
    yield put(enableLoading(false));
  }
}

export function* PostAccountedBillVersion({ payload }) {
  try {
    yield put(enableLoading(true));
    const res = yield call(PostAccountedBillVersion_API, payload);
    if (res.status === 200) {
      yield put(SetStatePostAccountedBillVersion(res.data));
    } else {
      yield put(
        openSnackbar({ message: 'try again', type: MESSAGE_TYPE.ERROR })
      );
      yield put(SetStatePostAccountedBillVersion({}));
    }
    yield put(enableLoading(false));
  } catch (e) {
    console.log(`PostAccountedBillVersion : ${e}`);
    yield put(SetStatePostAccountedBillVersion({}));
    yield put(enableLoading(false));
  }
}
