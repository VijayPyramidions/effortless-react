import { createSlice } from '@reduxjs/toolkit';

const initialState = {
  loadingOne: false,
  BankTxns: [],
  BankTxnsDetails: [],

  dataLoad: null,
};

export const StatementSlice = createSlice({
  name: 'Statement',
  initialState,
  reducers: {
    getBankTxns: (state) => {
      state.loadingOne = true;
    },
    setBankTxns: (state, { payload }) => {
      state.BankTxns = payload;
      state.BankTxnsDetails = [...state.BankTxnsDetails, ...payload.data];
      state.loadingOne = false;
      state.dataLoad = 'Data Loaded';
    },
    txnsRefresh: (state) => state,
    closeLoadingOne: (state) => {
      state.BankTxns = [];
      state.BankTxnsDetails = [];
      state.loadingOne = false;
    },
    transactionMove: (state) => {
      return state;
    },
    emptyTxns: (state) => {
      state.BankTxns = [];
      state.BankTxnsDetails = [];
    },
  },
});

export const {
  getBankTxns,
  setBankTxns,
  txnsRefresh,
  emptyTxns,
  transactionMove,
  closeLoadingOne,
} = StatementSlice.actions;

export default StatementSlice.reducer;
