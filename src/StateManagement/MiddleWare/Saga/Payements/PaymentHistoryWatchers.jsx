import { takeLatest } from 'redux-saga/effects';

import {
  getPaymentHistory,
  getVendorDetail,
  retryPayment,
} from '@action/Store/Reducers/Payments/PaymentHistoryState';

import {
  GetPaymentHistoryDetail,
  GetVendorDataDetail,
  RetryPaymentPost,
} from './PaymentHistoryWorkers';

export function* GetPaymentHistory() {
  yield takeLatest(getPaymentHistory.type, GetPaymentHistoryDetail);
}

export function* GetVendorDetail() {
  yield takeLatest(getVendorDetail.type, GetVendorDataDetail);
}

export function* RetryPayment() {
  yield takeLatest(retryPayment.type, RetryPaymentPost);
}
