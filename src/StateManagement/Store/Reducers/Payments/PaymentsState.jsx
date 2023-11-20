import { createSlice } from '@reduxjs/toolkit';

const initialState = {
  dataLoad: { payment: null, vendorPay: null },
  payments: null,
  bankAccounts: [],
  vendorPaymentsSummary: [],
  paymentResponse: null,
  virtualAccStatus: true,
};

export const PaymentsSlice = createSlice({
  name: 'Payments',
  initialState,
  reducers: {
    getPayments: (state) => state,
    setPayments: (state, { payload }) => {
      state.payments = payload;
      state.dataLoad.payment = 'loaded';
    },

    getVendorPayments: (state) => state,
    setVendorPayments: (state, { payload }) => {
      state.vendorPaymentsSummary = payload;
      state.dataLoad.vendorPay = 'loaded';
    },

    quickPayment: (state) => state,
    setQuickPayment: (state, { payload }) => {
      state.paymentResponse = payload;
    },

    getVirtualAccount: (state) => state,
    setVirtualAccount: (state, { payload }) => {
      state.virtualAccStatus = payload;
    },

    getBankAccounts: (state) => state,
    setBankAccounts: (state, { payload }) => {
      state.bankAccounts = payload;
    },

    setDataLoad: (state) => {
      state.dataLoad.payment = null;
      state.dataLoad.vendorPay = null;
    },
  },
});

export const {
  setPayments,
  getPayments,

  getVendorPayments,
  setVendorPayments,

  quickPayment,
  setQuickPayment,

  getVirtualAccount,
  setVirtualAccount,

  getBankAccounts,
  setBankAccounts,

  setDataLoad,
} = PaymentsSlice.actions;

export default PaymentsSlice.reducer;
