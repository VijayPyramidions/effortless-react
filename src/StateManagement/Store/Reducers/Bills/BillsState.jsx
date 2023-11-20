import { createSlice } from '@reduxjs/toolkit';

const initialState = {
  billsListData: {},
  VendorBillDetails: {},

  billsDataLoad: null,
  billsAction: '',
};

export const BillsSlice = createSlice({
  name: 'Bills',
  initialState,
  reducers: {
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

    PatchVendorBillState: (state) => {
      return state;
    },

    GetBillsListState: (state, { payload }) => {
      if (payload?.pageNum === 1) {
        return { ...state, billsDataLoad: null };
      }
      return state;
    },
    SetStateGetBillsList: (state, action) => {
      state.billsListData = action.payload;
      state.billsDataLoad = 'dataLoad';
    },
    ClearStateGetBillsList: (state) => {
      state.billsListData = {};
    },

    SetStateBillAction: (state, action) => {
      state.billsAction = action.payload;
    },
    ClearStateBillAction: (state) => {
      state.billsAction = '';
    },
  },
});

export const {
  GetVendorBillDetailsState,
  SetStateGetVendorBillDetails,
  ClearStateGetVendorBillDetails,

  GetBillsListState,
  SetStateGetBillsList,
  ClearStateGetBillsList,

  DeleteVendorBillState,
  PatchVendorBillState,

  SetStateBillAction,
  ClearStateBillAction,
} = BillsSlice.actions;

export default BillsSlice.reducer;
