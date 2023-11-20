import { createSlice } from '@reduxjs/toolkit';

const initialState = {
  BillBoxDataState: {},
  VendorBillsCounts: {},
  VendorBillDetails: {},
  EmployeeList: {},
  BillDashboardLoad: null,
  BillBoxDataLoad: null,
  BillBoxAction: '',
};

export const BillBoxSlice = createSlice({
  name: 'BillBox',
  initialState,
  reducers: {
    GetBillBoxBillsState: (state, { payload }) => {
      if (payload?.pageNum > 1 && !payload?.load) {
        return state;
      }
      return { ...state, BillBoxDataLoad: null };
    },
    SetStateGetBillBoxBills: (state, action) => {
      state.BillBoxDataState = action.payload;
      state.BillBoxDataLoad = 'dataLoad';
    },
    ClearStateGetBillBoxBills: (state) => {
      state.BillBoxDataState = {};
    },

    GetVendorBillsCountState: (state) => {
      return { ...state, BillDashboardLoad: null };
    },
    SetStateGetVendorBillsCount: (state, action) => {
      state.VendorBillsCounts = action.payload;
      state.BillDashboardLoad = 'dataLoad';
    },
    ClearStateGetVendorBillsCount: (state) => {
      state.VendorBillsCounts = {};
    },

    GetVendorBillDetailsState: (state) => {
      return state;
    },
    SetStateGetVendorBillDetails: (state, action) => {
      state.VendorBillDetails = action.payload;
    },
    ClearStateGetVendorBillDetails: (state) => {
      state.VendorBillDetails = {};
    },

    DeleteVendorBillState: (state) => {
      return state;
    },
    SetStateDeleteVendorBill: (state, action) => {
      state.BillBoxAction = action.payload;
    },
    ResetVendorBillAction: (state) => {
      state.BillBoxAction = '';
    },
  },
});

export const {
  GetBillBoxBillsState,
  SetStateGetBillBoxBills,
  ClearStateGetBillBoxBills,

  GetVendorBillsCountState,
  SetStateGetVendorBillsCount,
  ClearStateGetVendorBillsCount,

  GetVendorBillDetailsState,
  SetStateGetVendorBillDetails,
  ClearStateGetVendorBillDetails,

  DeleteVendorBillState,
  SetStateDeleteVendorBill,
  ResetVendorBillAction,
} = BillBoxSlice.actions;

export default BillBoxSlice.reducer;
