import { call, put } from 'redux-saga/effects';
import { MESSAGE_TYPE } from '@components/SnackBarContainer/SnackBarContainer';
import { IndianCurrency, SumAmount } from '@components/utils';

import {
  getBankList,
  setBankList,
  setBanks,
  setAccountPreference,
  setBorrowingList,
  setEMIStatement,
  setLoanDetails,
  setLoading,
  setLenders,
  closeBorrowing,
  getBorrowingList,
  addOtherBank,
  setEditCashAccountDr,
  setMergeAccDrawer,
} from '../../../Store/Reducers/Banking/BankingState';
import {
  enableLoading,
  openSnackbar,
} from '../../../Store/Reducers/Errors/Errors';

import {
  GetBankLists_Api,
  SyncIciciAccount_Api,
  SetAccPreference_Api,
  GetBorrowingList_Api,
  GetEMIStatement_Api,
  GetLoanDetails_Api,
  SyncAccount_Api,
  UpdateAccountStatus_Api,
  DeleteAccount_Api,
  GetLenders_Api,
  AddBorrowing_Api,
  OtherBankAddManually_Api,
  AddCashAccountDetail_Api,
  EditCashAccountDetail_Api,
  DeleteCashAccountDetail_Api,
  MergeBankAccountDetails_Api,
} from '../../API/Banking/BankingApi';

export function* GetBankLists() {
  try {
    const res = yield call(GetBankLists_Api);

    if (res.status === 200) {
      const result = res?.data?.data?.reduce((x, y) => {
        (x[y.bank_account_type] = x[y.bank_account_type] || []).push(y);
        return x;
      }, []);

      const business = result?.company?.reduce((x, y) => {
        (x[y.account_type] = x[y.account_type] || []).push(y);
        return x;
      }, {});

      const founder = result?.founder?.reduce((x, y) => {
        (x[y.account_type] = x[y.account_type] || []).push(y);
        return x;
      }, {});

      let ef_acc;
      business?.CURRENT?.forEach((item) => {
        if (
          item.bank_account_type === 'company' &&
          item.account_type === 'CURRENT' &&
          item.account_name === 'Effortless Virtual Account'
        ) {
          ef_acc = item;
        }
      });

      let list;
      if (business) {
        const keyOrder = ['CURRENT', 'FD', 'SAVINGS', 'CASH'];
        const sortedData = {};
        keyOrder.forEach((key) => {
          if (Object.prototype.hasOwnProperty.call(business, key)) {
            sortedData[key] = business[key];
          }
        });

        Object.keys(sortedData)?.forEach((val, ind) => {
          if (ind === 0)
            list = {
              tab: 'Business',
              bankList: sortedData[val],
              title: val.toUpperCase(),
              sumAmt: IndianCurrency.format(SumAmount(business[val])),
              ind,
            };
        });
      } else if (founder) {
        Object.keys(founder)?.forEach((val, ind) => {
          if (ind === 0)
            list = {
              tab: 'Founder',
              bankList: founder[val],
              title: val.toUpperCase(),
              sumAmt: IndianCurrency.format(SumAmount(founder[val])),
              ind,
            };
        });
      } else if (
        Object.values(res?.data?.borrowings).some((value) => value > 0)
      )
        list = {
          tab: 'Borrow',
          ind: 0,
        };

      if (Object.keys(list || {}).length > 0) yield put(setBanks(list));
      else yield put(setBanks({ tab: 'No data' }));
      yield put(setBankList({ ef_acc, business, founder, data: res.data }));
    }
  } catch (e) {
    console.log(`GetBankLists : ${e}`);
    yield put(setLoading());
  }
}

export function* SyncIciciAccount({ payload }) {
  try {
    const res = yield call(SyncIciciAccount_Api, payload);
    if (res.status >= 200 && res.status < 300) {
      yield put(
        openSnackbar({
          message:
            res.data.message || 'Bank user Account is successfully registered',
          type: MESSAGE_TYPE.INFO,
        })
      );

      yield put(getBankList());
    }
  } catch (e) {
    console.log(`SyncIciciAccount : ${e}`);
  }
}

export function* SetAccPreference({ payload }) {
  try {
    const res = yield call(SetAccPreference_Api, payload);
    if (res.status === 200) {
      if (res?.data?.founder_account_name)
        yield put(setAccountPreference(res?.data?.founder_account_name));
    }
  } catch (e) {
    console.log(`SetAccPreference : ${e}`);
  }
}

export function* GetBorrowingList() {
  try {
    const res = yield call(GetBorrowingList_Api);
    if (res.status === 200) {
      const bankLoans = res?.data?.data?.reduce((x, y) => {
        (x[y.loan_type] = x[y.loan_type] || []).push(y);
        return x;
      }, {});

      yield put(setBorrowingList(bankLoans));
    }
  } catch (e) {
    console.log(`GetBorrowingList : ${e}`);
  }
}

export function* GetEMIStatement({ payload }) {
  try {
    const res = yield call(GetEMIStatement_Api, payload);
    if (res.status === 200) {
      yield put(setEMIStatement(res.data.data));
    } else {
      yield put(
        openSnackbar({ message: 'try again', type: MESSAGE_TYPE.ERROR })
      );
    }
  } catch (e) {
    yield put(
      openSnackbar({
        message: e.message || 'something went wrong',
        type: MESSAGE_TYPE.ERROR,
      })
    );
  }
}

export function* GetLoanDetails({ payload }) {
  try {
    const res = yield call(GetLoanDetails_Api, payload);
    if (res.status === 200) yield put(setLoanDetails(res.data.data));
  } catch (e) {
    console.log(`GetLoanDetails : ${e}`);
  }
}

export function* SyncAccount({ payload }) {
  try {
    const res = yield call(SyncAccount_Api, payload);
    if (res.status === 200) {
      yield put(
        openSnackbar({
          message: 'Bank account sync disbled successfully',
          type: MESSAGE_TYPE.INFO,
        })
      );
      yield put(getBankList());
    }
  } catch (e) {
    console.log(`SyncAccount : ${e}`);
  }
}

export function* UpdateAccountStatus({ payload }) {
  try {
    const res = yield call(UpdateAccountStatus_Api, payload);
    if (res.status === 200) {
      yield put(
        openSnackbar({
          message: `Bank account ${
            payload.status === 'enable' ? 'enabled' : 'disabled'
          }  successfully`,
          type: MESSAGE_TYPE.INFO,
        })
      );
      yield put(getBankList());
    }
  } catch (e) {
    console.log(`UpdateAccountStatus : ${e}`);
  }
}

export function* DeleteAccount({ payload }) {
  try {
    const res = yield call(DeleteAccount_Api, payload);
    if (res.status === 200) {
      yield put(
        openSnackbar({
          message: 'Bank account deleted successfully',
          type: MESSAGE_TYPE.INFO,
        })
      );
      yield put(getBankList());
    }
  } catch (e) {
    console.log(`DeleteAccount : ${e}`);
  }
}

export function* GetLenders({ payload }) {
  try {
    const res = yield call(GetLenders_Api, payload);
    if (res.status === 200) yield put(setLenders(res.data));
  } catch (e) {
    console.log(`GetLenders : ${e}`);
  }
}

export function* AddBorrowing({ payload }) {
  try {
    const res = yield call(AddBorrowing_Api, {
      entity_id: payload.lenderId,
      file: payload.fileId,
      purpose: payload.purpose,
      loan_type: payload.category.replace(' ', '_').toLowerCase(),
    });

    if (res.status === 200) {
      yield put(
        openSnackbar({
          message: res?.data?.message || 'Something Wrong',
          type: MESSAGE_TYPE.INFO,
        })
      );
      yield put(closeBorrowing());
      yield put(enableLoading(false));
      yield put(getBorrowingList());
    }
  } catch (e) {
    console.log(`GetLenders : ${e}`);
  }
}

export function* OtherBankAddManually({ payload }) {
  try {
    const res = yield call(OtherBankAddManually_Api, payload);

    if (res.status === 200) {
      yield put(
        openSnackbar({
          message: 'Bank Account Added Succefully',
          type: MESSAGE_TYPE.INFO,
        })
      );
      yield put(getBankList());
      yield put(addOtherBank(false));
      yield put(enableLoading(false));
    }
  } catch (e) {
    console.log(`OtherBankAddManually : ${e}`);
  }
}
export function* AddCashAccountDetail() {
  try {
    const res = yield call(AddCashAccountDetail_Api);
    yield put(enableLoading(false));

    if (res.status === 200) {
      yield put(
        openSnackbar({
          message: 'Cash Account Added Succefully',
          type: MESSAGE_TYPE.INFO,
        })
      );
      yield put(getBankList());
    }
  } catch (e) {
    console.log(`AddCashAccountDetail : ${e}`);
    yield put(enableLoading(false));
  }
}

export function* EditCashAccountDetail({ payload }) {
  try {
    const res = yield call(EditCashAccountDetail_Api, payload);
    yield put(enableLoading(false));
    if (res.status === 200) {
      console.log(res, 'pppp');
      yield put(setEditCashAccountDr(false));
      yield put(
        openSnackbar({
          message: 'Cash Account Name Edited Successfully',
          type: MESSAGE_TYPE.INFO,
        })
      );
      yield put(getBankList());
    }
  } catch (e) {
    console.log(`EditCashAccountDetail : ${e}`);
    yield put(setEditCashAccountDr(false));
    yield put(enableLoading(false));
  }
}

export function* DeleteCashAccountDetail({ payload }) {
  try {
    const res = yield call(DeleteCashAccountDetail_Api, payload);
    yield put(enableLoading(false));

    if (res.status === 200) {
      yield put(
        openSnackbar({
          message: 'Cash Account deleted Succefully',
          type: MESSAGE_TYPE.INFO,
        })
      );
      yield put(getBankList());
    }
  } catch (e) {
    console.log(`DeleteCashAccountDetail : ${e}`);
    yield put(enableLoading(false));
  }
}

export function* MergeBankAccountDetails({ payload }) {
  try {
    const res = yield call(MergeBankAccountDetails_Api, payload);

    yield put(enableLoading(false));
    if (res.status === 200) {
      if (res.data.status === 'pending') {
        yield put(
          openSnackbar({
            message: 'Merging Account is under process.',
            type: MESSAGE_TYPE.INFO,
          })
        );
        // yield put(getBankList());
        yield put(setMergeAccDrawer(false));
      }
    }
  } catch (e) {
    console.log(`MergeBankAccountDetails : ${e}`);
    yield put(enableLoading(false));
    yield put(setMergeAccDrawer(false));
  }
}
