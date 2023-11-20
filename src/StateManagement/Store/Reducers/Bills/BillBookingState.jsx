import { createSlice } from '@reduxjs/toolkit';

const initialState = {
  ExpenseCategory: {},
  AssetCategory: {},

  VendorUnsettledList: [],
  // vendorList: [],

  orgLocation: null,
  orgSettings: null,
  allLocationAddress: [],
  gstDetail: null,
};

export const BillBookingSlice = createSlice({
  name: 'BillBooking',
  initialState,
  reducers: {
    getExpenseCategory: (state) => state,
    setExpenseCategory: (state, { payload }) => {
      state.ExpenseCategory = payload;
    },
    getAssetCategory: (state) => state,
    setAssetCategory: (state, { payload }) => {
      state.AssetCategory = payload;
    },

    getVendorUnsettled: (state) => state,
    setVendorUnsettled: (state, { payload }) => {
      state.VendorUnsettledList = payload;
    },

    // getVendorList: (state) => state,
    // setVendorList: (state, { payload }) => {
    //   state.vendorList = payload;
    // },

    getOrgLocation: (state) => state,
    setOrgLocation: (state, { payload }) => {
      state.orgLocation = payload;
    },

    getOrgSetting: (state) => state,
    setOrgSetting: (state, { payload }) => {
      state.orgSettings = payload;
    },

    getAllLocation: (state) => state,
    setAllLocation: (state, { payload }) => {
      state.allLocationAddress = payload;
    },

    postEntityDetail: (state) => state,

    getGstDetail: (state) => state,
    setGstDetail: (state, { payload }) => {
      state.gstDetail = payload;
    },

    clearRecordExpenseState: (state) => {
      state.ExpenseCategory= {};
      state.AssetCategory= {};
    
      state.VendorUnsettledList= [];
    
      state.orgLocation= null;
      state.orgSettings= null;
      state.allLocationAddress= [];
      state.gstDetail= null;
    },
  },
});

export const {
  getExpenseCategory,
  setExpenseCategory,
  getAssetCategory,
  setAssetCategory,

  getVendorUnsettled,
  setVendorUnsettled,
  getVendorList,
  setVendorList,
  getOrgLocation,
  setOrgLocation,
  getOrgSetting,
  setOrgSetting,
  getAllLocation,
  setAllLocation,
  postEntityDetail,
  getGstDetail,
  setGstDetail,

  clearRecordExpenseState
} = BillBookingSlice.actions;

export default BillBookingSlice.reducer;
