import { createSlice } from '@reduxjs/toolkit';

const initialState = {
  dataLoad: { advancePaymentVoucher: null, vendorList: null },
  paymentVoucharId: null,
  advPaymentDetails: null,
  advPaymentId: null,
  stateValue: {
    vendor: '',
    amount: '',
    tds: '',
    expenseCategory: '',
  },
  formattedStateValue: {
    vendor: '',
    amount: '',
    tds: '',
    expenseCategory: '',
  },
  expenseCategoryList: [],
  assetCategoryList: [],
  vendorList: [],
  vendorListMap: [],
};

export const AdvancePaymentSlice = createSlice({
  name: 'AdvancePayment',
  initialState,
  reducers: {
    advancePaymentVoucher: (state) => state,
    setAdvancePaymentVoucher: (state, { payload }) => {
      state.paymentVoucharId = payload;
      state.dataLoad.advancePaymentVoucher = 'Loaded';
    },

    setAdvPaymentDetails: (state, { payload }) => {
      state.advPaymentDetails = payload;
    },
    setAdvPaymentId: (state, { payload }) => {
      state.advPaymentId = payload;
    },
    setStateValue: (state, { payload }) => {
      state.stateValue = payload;
    },
    setFormattedStateValue: (state, { payload }) => {
      state.formattedStateValue = payload;
    },

    createUpdateAdvPayment: (state) => state,
    setAdvancePayment: (state, { payload }) => {
      state.advPaymentDetails = payload;
      state.advPaymentId = payload.payment_voucher || payload.id;
      state.stateValue.amount = payload.amount;
      state.stateValue.tds = payload.tds_amount;
      state.formattedStateValue.amount = payload.amount;
      state.formattedStateValue.tds = payload.tds_amount;
    },

    getExpenceCategory: (state) => state,
    setExpenceCategory: (state, { payload }) => {
      state.expenseCategoryList = payload;
    },

    getAssetCategory: (state) => state,
    setAssetCategory: (state, { payload }) => {
      state.assetCategoryList = payload;
    },

    getVendorList: (state) => state,
    setVendorList: (state, { payload }) => {
      state.vendorList = payload;
    },
    setVendorListMap: (state, { payload }) => {
      state.vendorListMap = payload;
      state.dataLoad.vendorList = 'Loaded';
    },
    setDataLoad: (state) => {
      state.dataLoad.advancePaymentVoucher = null;
      state.dataLoad.vendorList = null;
    },
    getVoucherItems: (state) => state,
  },
});

export const {
  advancePaymentVoucher,
  setAdvancePaymentVoucher,

  setAdvPaymentDetails,
  setAdvPaymentId,
  setStateValue,
  setFormattedStateValue,

  createUpdateAdvPayment,
  setAdvancePayment,

  getExpenceCategory,
  setExpenceCategory,

  getAssetCategory,
  setAssetCategory,

  getVendorList,
  setVendorList,
  setVendorListMap,

  setDataLoad,
  getVoucherItems,
} = AdvancePaymentSlice.actions;

export default AdvancePaymentSlice.reducer;
