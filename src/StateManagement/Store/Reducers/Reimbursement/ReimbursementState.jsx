import { createSlice } from '@reduxjs/toolkit';

const initialState = {
  dataLoad: { claims: null, tripDetails: null },
  drawer: {
    expense: false,
    mileage: false,
    trip: false,
    addTrip: false,
    requestAdvance: false,
    claimReview: false,
    payAdvance: false,
    confirmRequestAdvance: false,
    payAdvanceApprove: false,
  },
  tripSave: null,
  allTripDetails: [],
  reimbursementsAdvances: [],
  claims: [],
  claimsCount: [],
  rejectResponse: null,
  oneClaimDetails: {},
  tripDetails: [],
  managers: [],
  employees: [],
  tripExpense: [],
  advanceRes: null,
  tripExpenseRes: null,
  expensePerformActions: '',
  mileagePerformActions: '',
  tripPerformActions: '',
  advancePerformActions: '',
  voucher: null,
  allVoucherItems: [],
  billPatchData: {},
  reimbursementOCRData: {},
  TripViewState: 'edit_view',
  raiseClaimResponse: null,
  postTripResponse: null,
};

export const ReimbursementSlice = createSlice({
  name: 'Reimbursement',
  initialState,
  reducers: {
    getClaims: (state) => {
      state.claims = [];
    },
    setClaims: (state, { payload }) => {
      state.claims = payload;
      state.claimsCount = payload;
      state.dataLoad.claims = 'loaded';
    },
    setTripSave: (state, { payload }) => {
      state.tripSave = payload;
    },

    postClaims: (state) => state,
    getOneClaim: (state) => state,
    setOnClaim: (state, { payload }) => {
      state.oneClaimDetails = payload;
    },
    updateClaim: (state) => state,
    deleteClaim: (state) => state,

    getReimbursementAdvances: (state) => state,
    setReimbursementAdvances: (state, { payload }) => {
      state.reimbursementsAdvances = payload;
    },

    getTrips: (state) => state,
    setTrips: (state, { payload }) => {
      state.tripDetails = payload?.data;
      state.claimsCount = payload;
    },
    getAllTrips: (state) => state,
    setAllTrips: (state, { payload }) => {
      state.allTripDetails = payload.data;
    },
    editTrip: (state) => state,
    deleteTrip: (state) => state,
    postTrip: (state) => state,
    setPostTripResponse: (state, { payload }) => {
      state.postTripResponse = payload;
    },
    getManagers: (state) => state,
    setManagers: (state, { payload }) => {
      state.managers = payload;
    },

    getEmployees: (state) => state,
    setEmployees: (state, { payload }) => {
      state.employees = payload;
    },

    setAdvanceRes: (state, { payload }) => {
      state.advanceRes = payload;
    },

    advanceAdjust: (state) => state,
    tripAdjustAmount: (state) => state,
    setTripExpenseRes: (state, { payload }) => {
      state.tripExpenseRes = payload;
    },

    postFollowUp: (state) => state,

    getTripExpenses: (state) => state,
    setTripExpenses: (state, { payload }) => {
      state.tripExpense = payload;
    },

    approveClaim: (state) => state,
    setApproveClaim: (state, { payload }) => {
      state.approveResponse = payload;
    },

    rejectClaim: (state) => state,
    setRejectClaimRes: (state, { payload }) => {
      state.rejectResponse = payload;
    },

    raiseClaim: (state) => state,

    setDrawer: (state, { payload }) => {
      state.drawer[payload.name] = payload.value;
    },

    setReimbursementPerformanceAction: (state, { payload }) => {
      state[payload?.name] = payload?.action;
    },
    clearReimbursementPerformanceAction: (state) => {
      state.expensePerformActions = '';
      // state.mileagePerformActions = '';
      state.tripPerformActions = '';
      // state.advancePerformActions = '';
    },

    setTripViewState: (state, { payload }) => {
      state.TripViewState = payload;
    },
    setRaiseClaimResponse: (state, { payload }) => {
      state.raiseClaimResponse = payload;
    },
    getVoucher: (state) => state,
    setVoucher: (state, { payload }) => {
      state.voucher = payload;
    },
    postItems: (state) => state,
    postItemsDelete: (state) => state,
    getAllVoucherItems: (state) => state,
    setAllVoucherItems: (state, { payload }) => {
      state.allVoucherItems = payload;
    },
    setClaimDetailsForBillPatch: (state, { payload }) => {
      state.billPatchData = payload;
    },
    clearReimbursementBillPatchData: (state) => {
      state.billPatchData = {};
    },

    getOCRData: (state) => state,
    fetchOCRData: (state) => state,
    setOCRData: (state, { payload }) => {
      state.reimbursementOCRData = payload;
    },

    clearReimbursementOCRData: (state) => {
      state.reimbursementOCRData = {};
    },
  },
});

export const {
  getClaims,
  setClaims,
  postClaims,
  getOneClaim,
  setOnClaim,
  updateClaim,
  deleteClaim,

  setTripSave,
  getReimbursementAdvances,
  setReimbursementAdvances,

  getTrips,
  setTrips,
  getAllTrips,
  setAllTrips,
  editTrip,
  deleteTrip,
  postTrip,
  setPostTripResponse,

  getManagers,
  setManagers,
  getEmployees,
  setEmployees,

  advanceAdjust,
  tripAdjustAmount,

  setAdvanceRes,
  setTripExpenseRes,

  postFollowUp,

  getTripExpenses,
  setTripExpenses,

  approveClaim,
  setApproveClaim,

  rejectClaim,
  setRejectClaimRes,

  raiseClaim,
  setRaiseClaimResponse,

  setDrawer,
  setReimbursementPerformanceAction,
  clearReimbursementPerformanceAction,
  setTripViewState,
  getVoucher,
  setVoucher,
  postItems,
  postItemsDelete,
  getAllVoucherItems,
  setAllVoucherItems,

  setClaimDetailsForBillPatch,
  clearReimbursementBillPatchData,

  getOCRData,
  fetchOCRData,
  setOCRData,
  clearReimbursementOCRData,
} = ReimbursementSlice.actions;

export default ReimbursementSlice.reducer;
