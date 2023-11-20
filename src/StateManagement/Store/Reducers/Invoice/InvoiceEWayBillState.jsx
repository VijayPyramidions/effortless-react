import { createSlice } from '@reduxjs/toolkit';

const initialState = {
  InvoiceEWayBillState: {},
  InvoiceToBeGeneratedState: {},
  InvoiceGeneratedEWayBillsState: {},
  TransportersListState: {},
  EWayBillPDFDataState: {},
  TransportersActionState: null,
  EWayBillPDFActionState: null,
  InvoiceEWayBillUpdatedState: {},
  InvoiceEWayBillDataLoad: null,
  ToBeGeneratedLoad: null,
  GeneratedEWayBillsLoad: null,
};

export const InvoiceEWayBillSlice = createSlice({
  name: 'InvoiceEWayBill',
  initialState,
  reducers: {
    GetInvoiceToBeGeneratedState: (state, { payload }) => {
      if (Object.values(payload).every((val) => val === '')) {
        return {
          ...state,
          ToBeGeneratedLoad: null,
          EWayBillPDFActionState: null,
        };
      }
      return state;
    },
    SetStateInvoiceToBeGenerated: (state, action) => {
      state.InvoiceToBeGeneratedState = action?.payload;
      state.ToBeGeneratedLoad = 'dataLoad';
    },
    ClearStateInvoiceToBeGenerated: (state) => {
      state.InvoiceToBeGeneratedState = {};
      state.ToBeGeneratedLoad = null;
    },
    GetInvoiceGeneratedEWayBillsState: (state, { payload }) => {
      if (Object.values(payload).every((val) => val === '')) {
        return {
          ...state,
          GeneratedEWayBillsLoad: null,
          EWayBillPDFActionState: null,
        };
      }
      return state;
    },
    SetStateInvoiceGeneratedEWayBills: (state, action) => {
      state.InvoiceGeneratedEWayBillsState = action?.payload;
      state.GeneratedEWayBillsLoad = 'dataLoad';
    },
    ClearStateInvoiceGeneratedEWayBills: (state) => {
      state.InvoiceGeneratedEWayBillsState = {};
      state.GeneratedEWayBillsLoad = null;
    },
    PatchInvoiceUpdateEWayBillState: (state) => {
      return state;
    },
    SetStateInvoiceUpdateEWayBill: (state, action) => {
      state.InvoiceEWayBillUpdatedState = action.payload;
    },
    ClearStateInvoiceUpdateEWayBill: (state) => {
      state.InvoiceEWayBillUpdatedState = {};
    },
    PostInvoiceEWayBillState: (state) => {
      return { ...state, InvoiceEWayBillDataLoad: null };
    },
    SetStateGetInvoiceEWayBill: (state, action) => {
      state.InvoiceEWayBillState = action.payload;
      state.InvoiceEWayBillDataLoad = 'dataLoad';
    },
    ClearStateGetInvoiceEWayBill: (state) => {
      state.InvoiceEWayBillState = {};
      state.InvoiceEWayBillDataLoad = null;
    },
    GetTransportersListState: (state) => {
      return state;
    },
    SetStateTransportersList: (state, action) => {
      state.TransportersListState = action.payload;
    },
    PostTransportersCreateState: (state) => {
      return { ...state, TransportersActionState: null };
    },
    SetStateTransporterAction: (state, action) => {
      state.TransportersActionState = action.payload;
    },
    GetIndividualInvoiceEWayBillState: (state) => {
      return state;
    },
    SetStateIndividualInvoiceEWayBill: (state, action) => {
      state.EWayBillPDFDataState = action.payload;
    },
    DeleteInvoiceEWayBillPDFState: (state) => {
      return state;
    },
    SetStateEWayBillPDFAction: (state, action) => {
      state.EWayBillPDFActionState = action.payload;
    },
    PostInvoiceEWayBillNewVehicleState: (state) => {
      return state;
    },
    PatchDeactivateInvoiceEWayBillState: (state) => {
      return state;
    },
    ClearEWayBillPDFActionState: (state) => {
      state.EWayBillPDFActionState = null;
    },
  },
});

export const {
  GetInvoiceToBeGeneratedState,
  SetStateInvoiceToBeGenerated,
  ClearStateInvoiceToBeGenerated,
  GetInvoiceGeneratedEWayBillsState,
  SetStateInvoiceGeneratedEWayBills,
  ClearStateInvoiceGeneratedEWayBills,
  PatchInvoiceUpdateEWayBillState,
  SetStateInvoiceUpdateEWayBill,
  ClearStateInvoiceUpdateEWayBill,
  PostInvoiceEWayBillState,
  SetStateGetInvoiceEWayBill,
  ClearStateGetInvoiceEWayBill,
  GetTransportersListState,
  SetStateTransportersList,
  PostTransportersCreateState,
  SetStateTransporterAction,
  GetIndividualInvoiceEWayBillState,
  SetStateIndividualInvoiceEWayBill,
  DeleteInvoiceEWayBillPDFState,
  SetStateEWayBillPDFAction,
  PostInvoiceEWayBillNewVehicleState,
  PatchDeactivateInvoiceEWayBillState,
  ClearEWayBillPDFActionState,
} = InvoiceEWayBillSlice.actions;

export default InvoiceEWayBillSlice.reducer;
