import { createSlice } from '@reduxjs/toolkit';

const initialState = {
  ExpenseListDataState: {},
  AccountedBillsListData: {},
  AccountedBillVersionData: {},
  ExpenseListDataLoad: null,
  AccountedBillDataLoad: null,
};

export const AccountedBillsSlice = createSlice({
  name: 'AccountedBills',
  initialState,
  reducers: {
    GetExpenseListState: (state, { payload }) => {
      if (payload?.pageNum > 1) {
        return state;
      }
      return { ...state, ExpenseListDataLoad: null };
    },
    SetStateGetExpenseList: (state, action) => {
      state.ExpenseListDataState = action.payload;
      state.ExpenseListDataLoad = 'dataLoad';
    },

    GetAccountedBillsListState: (state, { payload }) => {
      if (payload?.pageNum > 1) {
        return state;
      }
      return { ...state, AccountedBillDataLoad: null };
    },
    SetStateGetAccountedBillsList: (state, action) => {
      state.AccountedBillsListData = action.payload;
      state.AccountedBillDataLoad = 'dataLoad';
    },
    ClearStateGetAccountedBillsList: (state) => {
      state.AccountedBillsListData = {};
    },

    PostAccountedBillVersionState: (state) => {
      return state;
    },
    SetStatePostAccountedBillVersion: (state, action) => {
      state.AccountedBillVersionData = action.payload;
    },
    ClearStatePostAccountedBillVersion: (state) => {
      state.AccountedBillVersionData = {};
    },
  },
});

export const {
  GetExpenseListState,
  SetStateGetExpenseList,

  GetAccountedBillsListState,
  SetStateGetAccountedBillsList,
  ClearStateGetExpenseList,

  PostAccountedBillVersionState,
  SetStatePostAccountedBillVersion,
  ClearStatePostAccountedBillVersion,
} = AccountedBillsSlice.actions;

export default AccountedBillsSlice.reducer;
