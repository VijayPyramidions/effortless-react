import { call, put, select } from 'redux-saga/effects';
import { MESSAGE_TYPE } from '@components/SnackBarContainer/SnackBarContainer';

import {
  setPaymentHistory,
  setVendorDetails,
  setRetryPayment,
  setPagination,
} from '@action/Store/Reducers/Payments/PaymentHistoryState';

import {
  openSnackbar,
  enableLoading,
} from '@action/Store/Reducers/Errors/Errors';

import {
  GetPaymentHistoryDetail_Api,
  GetVendorDataDetail_Api,
} from '../../API/Payments/PaymentHistoryApi';
import { RetryPaymentsMethod_Api } from '../../API/Payments/MakePaymentApi';

export function* GetPaymentHistoryDetail({ payload }) {
  const storeData = yield select((state) => state.PaymentHistory);

  try {
    const res = yield call(GetPaymentHistoryDetail_Api, payload);
    yield put(enableLoading(false));

    if (res.status === 200) {
      if (payload.pageNum === 1 || !payload.pageNum)
        yield put(setPaymentHistory(res.data.data));
      else
        yield put(
          setPaymentHistory([...storeData.paymentHistory, ...res?.data.data])
        );
      yield put(
        setPagination({
          currentPage: res.data?.page,
          totalPage: res.data?.pages,
        })
      );
    } else
      yield put(
        openSnackbar({
          message: res?.data?.message || 'try again',
          type: MESSAGE_TYPE.ERROR,
        })
      );
  } catch (e) {
    console.log(`GetPaymentHistoryDetail :  ${e}`);
  }
}

export function* GetVendorDataDetail({ payload }) {
  try {
    const res = yield call(GetVendorDataDetail_Api, payload);
    yield put(enableLoading(false));

    if (res.status === 200) {
      res.data?.data?.map((a) => Object.assign(a, { check: false }));
      yield put(setVendorDetails(res.data?.data));
    }
  } catch (e) {
    console.log(`GetVendorDataDetail :  ${e}`);
  }
}

export function* RetryPaymentPost({ payload }) {
  try {
    const res = yield call(RetryPaymentsMethod_Api, payload);
    yield put(enableLoading(false));

    if (res.status === 200)
      if (res?.data?.success) yield put(setRetryPayment(res.data));
  } catch (e) {
    console.log(`RetryPaymentPost :  ${e}`);
  }
}
