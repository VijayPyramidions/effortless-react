import { createSlice } from '@reduxjs/toolkit';

const initialState = {
  EInvoiceState: {},
  EInvoiceDataLoad: null,
  EInvoiceUpdateDataLoad: null,
};

export const EInvoiceSlice = createSlice({
  name: 'EInvoice',
  initialState,
  reducers: {
    GetEInvoiceState: (state) => {
      return { ...state, EInvoiceDataLoad: null };
    },
    PostEInvoiceState: (state) => {
      return { ...state, EInvoiceDataLoad: null };
    },
    SetStateGetEInvoice: (state, action) => {
      state.EInvoiceState = action.payload;
      state.EInvoiceDataLoad = 'dataLoad';
      state.EInvoiceUpdateDataLoad = null;
    },
    ClearStateGetEInvoice: (state) => {
      state.EInvoiceState = {};
    },
    PatchEInvoiceState: (state) => {
      return state;
    },
    DeleteEInvoiceState: (state) => {
      return state;
    },
    SetStatePatchEInvoice: (state, action) => {
      state.EInvoiceUpdateDataLoad = action?.payload;
    },
  },
});

export const {
  GetEInvoiceState,
  SetStateGetEInvoice,
  ClearStateGetEInvoice,
  PatchEInvoiceState,
  SetStatePatchEInvoice,
  PostEInvoiceState,
  DeleteEInvoiceState,
} = EInvoiceSlice.actions;

export default EInvoiceSlice.reducer;
