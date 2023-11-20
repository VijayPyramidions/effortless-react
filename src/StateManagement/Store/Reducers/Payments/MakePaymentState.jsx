import { createSlice } from '@reduxjs/toolkit';

const initialState = {
  dataLoad: { unSettledVendor: null, vendorBills: null },
  vendorBillLoading: true,
  vendorBills: [],

  unsettledVendorBills: [],
  searchUnsettledVendorBills: [],
  UnsettledVendorBillsLoading: true,

  selectedbillids: [],
  selectedVoucherItems: [],
  bankAccounts: [],

  paymentVoucharId: '',
  clickVendorId: '',

  vendorDrawer: false,
  proceedToPayDrawer: false,
  paymentBankDrawer: false,

  refreshVoucherResponse: null,

  retryPaymentVoucharId: null,
};

export const MakePaymentSlice = createSlice({
  name: 'MakePayment',
  initialState,
  reducers: {
    unSettledVendorBills: (state) => state,
    setUnSettledVendorBills: (state, { payload }) => {
      if (payload.vendor === 'yes') state.vendorBills = payload.data;
      else {
        state.unsettledVendorBills = payload.data;
        state.searchUnsettledVendorBills = payload.searchData;
      }
      state.UnsettledVendorBillsLoading = false;
      state.dataLoad.unSettledVendor = 'Loaded';
    },
    setVendorBillLoading: (state, { payload }) => {
      state.vendorBillLoading = payload;
    },

    setSearchVendorBills: (state, { payload }) => {
      if (payload.action === 'search') {
        state.searchUnsettledVendorBills = payload.data;
        state.UnsettledVendorBillsLoading = false;
      } else {
        state.unsettledVendorBills = payload.data;
        state.dataLoad.unSettledVendor = 'Loaded';
      }
    },

    setVendorBills: (state, { payload }) => {
      state.vendorBills = payload;
      state.dataLoad.vendorBills = 'Loaded';
      // state.dataLoad.unSettledVendor = 'Loaded';
    },

    setSelectedBillIds: (state, { payload }) => {
      state.selectedbillids = payload;
    },
    setSelectedVoucherItems: (state, { payload }) => {
      state.selectedVoucherItems = payload;
    },

    setVendorDrawer: (state, { payload }) => {
      state.vendorDrawer = payload;
    },
    setProceedToPayDrawer: (state, { payload }) => {
      state.proceedToPayDrawer = payload;
    },
    setPaymentBankDrawer: (state, { payload }) => {
      state.paymentBankDrawer = payload.value;
      if (payload.vendorId) state.clickVendorId = payload.vendorId;
    },

    PaymentVoucher: (state) => state,
    setPaymentVoucher: (state, { payload }) => {
      state.paymentVoucharId = payload;
    },

    paymentBankAccounts: (state) => state,
    setPaymentBankAccounts: (state, { payload }) => {
      state.bankAccounts = payload;
    },

    getVoucherItems: (state) => state,
    createVoucherItem: (state) => state,
    updateVoucherItem: (state) => state,
    deleteVoucherItem: (state) => state,
    bulkDeleteVouchers: (state) => state,
    refreshVoucherItem: (state) => state,
    setRefreshResponse: (state, { payload }) => {
      state.refreshVoucherResponse = payload;
    },

    retryPayments: (state) => state,
    setRetryPaymentVoucharId: (state, { payload }) => {
      state.retryPaymentVoucharId = payload;
    },
    setUnsettledVendorBillsLoading: (state, { payload }) => {
      state.UnsettledVendorBillsLoading = payload;
      state.searchUnsettledVendorBills = [];
    },
    resetMakepaymentState: () => initialState,
  },
});

export const {
  unSettledVendorBills,
  setUnSettledVendorBills,
  setUnsettledVendorBillsLoading,
  setVendorBillLoading,

  setVendorBills,
  setSearchVendorBills,
  setSelectedBillIds,
  setSelectedVoucherItems,

  setVendorDrawer,
  setProceedToPayDrawer,

  paymentBankAccounts,
  setPaymentBankAccounts,

  PaymentVoucher,
  setPaymentVoucher,
  setPaymentBankDrawer,

  getVoucherItems,
  createVoucherItem,
  updateVoucherItem,
  deleteVoucherItem,
  bulkDeleteVouchers,
  refreshVoucherItem,
  setRefreshResponse,

  retryPayments,
  setRetryPaymentVoucharId,
  resetMakepaymentState,
} = MakePaymentSlice.actions;

export default MakePaymentSlice.reducer;
