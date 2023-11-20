import { call, put } from 'redux-saga/effects';
import { MESSAGE_TYPE } from '@components/SnackBarContainer/SnackBarContainer';
import {
  setPayments,
  setVendorPayments,
  setQuickPayment,
  setVirtualAccount,
  setBankAccounts,
} from '@action/Store/Reducers/Payments/PaymentsState';

import {
  openSnackbar,
  enableLoading,
} from '@action/Store/Reducers/Errors/Errors';

import {
  GetPayemenstDetails_Api,
  GetVendorPayments_Api,
  MakeQuickPayment_Api,
  FetchVirtualAccount_Api,
  GetBankAccountsDetails_Api,
} from '../../API/Payments/PaymentsApi';

export function* GetPayemenstDetails() {
  try {
    const res = yield call(GetPayemenstDetails_Api);
    if (res.status === 200) yield put(setPayments(res.data));
    else
      yield put(
        openSnackbar({
          message: res?.data?.message || 'try again',
          type: MESSAGE_TYPE.ERROR,
        })
      );
  } catch (e) {
    console.log(`GetPayemenstDetails :  ${e}`);
  }
}

export function* GetVendorPayments() {
  try {
    const res = yield call(GetVendorPayments_Api);
    if (res.status === 200) yield put(setVendorPayments(res.data.data));
    else
      yield put(
        openSnackbar({
          message: res?.data?.message || 'try again',
          type: MESSAGE_TYPE.ERROR,
        })
      );
  } catch (e) {
    console.log(`GetVendorPayments :  ${e}`);
  }
}

export function* MakeQuickPayment({ payload }) {
  try {
    const res = yield call(MakeQuickPayment_Api, payload);
    yield put(enableLoading(false));
    if (res.status === 200)
      yield put(setQuickPayment({ data: res.data, payload }));
    else
      yield put(
        openSnackbar({
          message: res?.data?.message || 'try again',
          type: MESSAGE_TYPE.ERROR,
        })
      );
  } catch (e) {
    console.log(`MakeQuickPayment :  ${e}`);
    yield put(enableLoading(false));
  }
}

export function* FetchVirtualAccount() {
  try {
    const res = yield call(FetchVirtualAccount_Api);
    if (res.status === 200) {
      if (res.message !== 'Effortless Virtual Account not created yet')
        yield put(setVirtualAccount(true));
      else yield put(setVirtualAccount(false));
    } else
      yield put(
        openSnackbar({
          message: res?.data?.message || 'try again',
          type: MESSAGE_TYPE.ERROR,
        })
      );
  } catch (e) {
    console.log(`FetchVirtualAccount :  ${e}`);
  }
}

export function* GetBankAccountsDetails({ payload }) {
  try {
    const res = yield call(GetBankAccountsDetails_Api, payload);
    yield put(enableLoading(false));
    if (res.status === 200) yield put(setBankAccounts(res.data.data));
  } catch (e) {
    console.log(`FetchVirtualAccount :  ${e}`);
    yield put(enableLoading(false));
  }
}
