import { takeLatest } from 'redux-saga/effects';

import {
  GetExpenseListState,
  GetAccountedBillsListState,
  PostAccountedBillVersionState,
} from '../../../Store/Reducers/Bills/AccountedBillsState';
import {
  GetExpenseList,
  GetAccountedBillsList,
  PostAccountedBillVersion,
} from './AccountedBillsWorkers';

export function* GetExpenseListCall() {
  yield takeLatest(GetExpenseListState.type, GetExpenseList);
}

export function* GetAccountedBillsListCall() {
  yield takeLatest(GetAccountedBillsListState.type, GetAccountedBillsList);
}

export function* PostAccountedBillVersionCall() {
  yield takeLatest(
    PostAccountedBillVersionState.type,
    PostAccountedBillVersion
  );
}
