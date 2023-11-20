import { takeLatest } from 'redux-saga/effects';
import {
  getBankTxns,
  transactionMove,
  txnsRefresh,
} from '../../../Store/Reducers/Banking/StatementState';
import {
  GetBankTxns,
  MoveTransaction,
  SyncTransactionDetails,
} from './StatementWorkers';

export function* BankTxns() {
  yield takeLatest(getBankTxns.type, GetBankTxns);
}
export function* TransactionMove() {
  yield takeLatest(transactionMove.type, MoveTransaction);
}
export function* TransactionSync() {
  yield takeLatest(txnsRefresh.type, SyncTransactionDetails);
}
