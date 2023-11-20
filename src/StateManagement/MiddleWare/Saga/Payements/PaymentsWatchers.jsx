import { takeLatest } from 'redux-saga/effects';

import {
  getPayments,
  getVendorPayments,
  quickPayment,
  getVirtualAccount,
  getBankAccounts,
} from '@action/Store/Reducers/Payments/PaymentsState';

import {
  GetPayemenstDetails,
  GetVendorPayments,
  MakeQuickPayment,
  FetchVirtualAccount,
  GetBankAccountsDetails,
} from './PaymentsWorker';

export function* PaymenstDetails() {
  yield takeLatest(getPayments.type, GetPayemenstDetails);
}

export function* VendorPayments() {
  yield takeLatest(getVendorPayments.type, GetVendorPayments);
}

export function* QuickPayment() {
  yield takeLatest(quickPayment.type, MakeQuickPayment);
}

export function* VirtualAccount() {
  yield takeLatest(getVirtualAccount.type, FetchVirtualAccount);
}

export function* GetBankAccounts() {
  yield takeLatest(getBankAccounts.type, GetBankAccountsDetails);
}
