import { createSlice } from '@reduxjs/toolkit';

const initialState = {
  dataLoad: { PaymentHistory: null },
  paymentHistory: [],
  vendorList: [],
  retryPaymentResponse: null,
  pagination: {
    totalPage: 1,
    currentPage: 1,
  },
};

export const PaymentHistorySlice = createSlice({
  name: 'PaymentHistory',
  initialState,
  reducers: {
    getPaymentHistory: (state) => state,
    setPaymentHistory: (state, { payload }) => {
      state.paymentHistory = payload;
      state.dataLoad.PaymentHistory = 'Loaded';
    },
    emptyPaymentHistory: (state) => {
      state.paymentHistory = [];
      state.dataLoad.PaymentHistory = null;
    },
    getVendorDetail: (state) => state,
    setVendorDetails: (state, { payload }) => {
      state.vendorList = payload;
    },
    retryPayment: (state) => state,
    setRetryPayment: (state, { payload }) => {
      state.retryPaymentResponse = payload;
    },
    setPagination: (state, { payload }) => {
      state.pagination.totalPage = payload.totalPage;
      state.pagination.currentPage = payload.currentPage;
    },
    setDataLoad: (state) => {
      state.dataLoad.PaymentHistory = null;
    },
  },
});

export const {
  getPaymentHistory,
  setPaymentHistory,
  emptyPaymentHistory,
  getVendorDetail,
  setVendorDetails,
  retryPayment,
  setRetryPayment,
  setPagination,
  setDataLoad,
} = PaymentHistorySlice.actions;

export default PaymentHistorySlice.reducer;
