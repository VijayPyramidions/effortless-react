import { takeEvery, takeLatest } from 'redux-saga/effects';

import {
  unSettledVendorBills,
  PaymentVoucher,
  paymentBankAccounts,
  getVoucherItems,
  createVoucherItem,
  updateVoucherItem,
  deleteVoucherItem,
  bulkDeleteVouchers,
  refreshVoucherItem,
  retryPayments,
} from '@action/Store/Reducers/Payments/MakePaymentState';

import {
  GetUnSettledVendorBills,
  PostPaymentVoucher,
  GetPaymentBankAccounts,
  GetVoucherItemsDetail,
  CreateVoucherItemDetail,
  UpdateVoucherItemDetail,
  DeleteVoucherItemDetail,
  BulkDeleteVouchersDetail,
  RefreshVoucherItemDetail,
  RetryPaymentsMethod,
} from './MakePaymentWorkers';

export function* UnSettledVendorBills() {
  yield takeEvery(unSettledVendorBills.type, GetUnSettledVendorBills);
}

export function* CreatePaymentVoucher() {
  yield takeLatest(PaymentVoucher.type, PostPaymentVoucher);
}

export function* PaymentBankAccountsDetails() {
  yield takeLatest(paymentBankAccounts.type, GetPaymentBankAccounts);
}

export function* GetVoucherItems() {
  yield takeLatest(getVoucherItems.type, GetVoucherItemsDetail);
}

export function* CreateVoucherItem() {
  yield takeLatest(createVoucherItem.type, CreateVoucherItemDetail);
}

export function* UpdateVoucherItem() {
  yield takeLatest(updateVoucherItem.type, UpdateVoucherItemDetail);
}

export function* DeleteVoucherItem() {
  yield takeLatest(deleteVoucherItem.type, DeleteVoucherItemDetail);
}
export function* BulkDeleteVouchers() {
  yield takeLatest(bulkDeleteVouchers.type, BulkDeleteVouchersDetail);
}

export function* RefreshVoucherItem() {
  yield takeLatest(refreshVoucherItem.type, RefreshVoucherItemDetail);
}

export function* RetryPayments() {
  yield takeLatest(retryPayments.type, RetryPaymentsMethod);
}
