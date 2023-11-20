import { call, put } from 'redux-saga/effects';
import { MESSAGE_TYPE } from '@components/SnackBarContainer/SnackBarContainer';

import {
  openSnackbar,
  enableLoading,
} from '../../../Store/Reducers/Errors/Errors';
import {
  setBankTxns,
  closeLoadingOne,
} from '../../../Store/Reducers/Banking/StatementState';

import {
  GetBankTxns_Api,
  MoveTransaction_Api,
  SyncTransactionDetails_Api,
} from '../../API/Banking/StatementApi';

export function* GetBankTxns({ payload }) {
  try {
    const res = yield call(GetBankTxns_Api, payload);
    if (res.status === 200) yield put(setBankTxns(res.data));
  } catch (e) {
    yield put(closeLoadingOne());
    console.log(`GetBankTxns : ${e}`);
  }
}

export function* MoveTransaction({ payload }) {
  try {
    const res = yield call(MoveTransaction_Api, payload);
    if (res.status === 200) {
      yield put(
        openSnackbar({
          message: 'Transaction moved successfully.',
          type: MESSAGE_TYPE.INFO,
        })
      );
      yield put(enableLoading(false));
    }
  } catch (e) {
    yield put(enableLoading(false));
    console.log(`MoveTransaction : ${e}`);
  }
}
export function* SyncTransactionDetails({ payload }) {
  try {
    const res = yield call(SyncTransactionDetails_Api, payload);
    if (res.status === 200) {
      yield put(
        openSnackbar({
          message: res?.data?.message,
          type: MESSAGE_TYPE.INFO,
        })
      );
      yield put(enableLoading(false));
    }
  } catch (e) {
    yield put(enableLoading(false));
    console.log(`SyncTransactionDetails : ${e}`);
  }
}
