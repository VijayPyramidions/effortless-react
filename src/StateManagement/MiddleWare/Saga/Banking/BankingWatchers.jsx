import { takeLatest } from 'redux-saga/effects';

import {
  getBankList,
  iciciAccountSync,
  AccountPreference,
  getBorrowingList,
  getEMIStatement,
  getLoanDetails,
  BankSync,
  BankStausUpdate,
  DeleteBankAccount,
  getLenders,
  addBorrowing,
  addOtherBankManually,
  addCashAccount,
  editCashAccount,
  deleteCashAccount,
  mergeBankAccount,
} from '@action/Store/Reducers/Banking/BankingState';

import {
  GetBankLists,
  SyncIciciAccount,
  SetAccPreference,
  GetBorrowingList,
  GetEMIStatement,
  GetLoanDetails,
  SyncAccount,
  UpdateAccountStatus,
  DeleteAccount,
  GetLenders,
  AddBorrowing,
  OtherBankAddManually,
  AddCashAccountDetail,
  EditCashAccountDetail,
  DeleteCashAccountDetail,
  MergeBankAccountDetails,
} from './BankingWorkers';

export function* BankLists() {
  yield takeLatest(getBankList.type, GetBankLists);
}

export function* SyncIcici() {
  yield takeLatest(iciciAccountSync.type, SyncIciciAccount);
}

export function* AccPreference() {
  yield takeLatest(AccountPreference.type, SetAccPreference);
}

export function* BorrowingList() {
  yield takeLatest(getBorrowingList.type, GetBorrowingList);
}

export function* EMIStatement() {
  yield takeLatest(getEMIStatement.type, GetEMIStatement);
}

export function* LoanDetails() {
  yield takeLatest(getLoanDetails.type, GetLoanDetails);
}

export function* AccountSync() {
  yield takeLatest(BankSync.type, SyncAccount);
}
export function* AccountStatusUpdate() {
  yield takeLatest(BankStausUpdate.type, UpdateAccountStatus);
}

export function* AccountDelete() {
  yield takeLatest(DeleteBankAccount.type, DeleteAccount);
}

export function* Lenders() {
  yield takeLatest(getLenders.type, GetLenders);
}

export function* Borrowing() {
  yield takeLatest(addBorrowing.type, AddBorrowing);
}
export function* AddOtherBankManually() {
  yield takeLatest(addOtherBankManually.type, OtherBankAddManually);
}

export function* AddCashAccount() {
  yield takeLatest(addCashAccount.type, AddCashAccountDetail);
}

export function* EditCashAccount() {
  yield takeLatest(editCashAccount.type, EditCashAccountDetail);
}

export function* DeleteCashAccount() {
  yield takeLatest(deleteCashAccount.type, DeleteCashAccountDetail);
}

export function* MergeBankAccount() {
  yield takeLatest(mergeBankAccount.type, MergeBankAccountDetails);
}
