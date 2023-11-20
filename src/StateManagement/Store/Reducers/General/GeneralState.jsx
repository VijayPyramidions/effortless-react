import { createSlice } from '@reduxjs/toolkit';

const initialState = {
  stateGeneral: {},
  customerEntity: {},
  individualEntityData: {},
  pincodeDetailsState: {},
  customerLoad: null,
  individualEntityDataLoad: null,
  individualEntityChangeDataLoad: null,
  panValidationResponse: null,
  memberEntity: {},
  memberEntityLoad: null,

  employeeEntity: {},
  employeeLoad: null
};

export const GeneralSlice = createSlice({
  name: 'General',
  initialState,
  reducers: {
    GetGeneralState: (state) => {
      return state;
    },
    SetStateGeneralState: (state, action) => {
      state.stateGeneral = action.payload;
    },
    GetCustomerEntityState: (state, { payload }) => {
      if (payload?.pageNum === 1) {
        return { ...state, customerLoad: null };
      }
      return state;
    },
    SetSateCustomerEntity: (state, action) => {
      state.customerEntity = action.payload;
      state.customerLoad = 'dataLoad';
    },
    ClearSateCustomerEntity: (state) => {
      state.customerEntity = {};
    },
    GetVendorEntityState: (state, { payload }) => {
      if (payload?.pageNum === 1) {
        return { ...state, vendorLoad: null };
      }
      return state;
    },
    SetSateVendorEntity: (state, action) => {
      state.vendorEntity = action.payload;
      state.vendorLoad = 'dataLoad';
    },
    ClearSateVendorEntity: (state) => {
      state.vendorEntity = {};
    },

    GetEmployeeEntityState: (state, { payload }) => {
      if (payload?.pageNum === 1) {
        return { ...state, employeeLoad: null };
      }
      return state;
    },
    SetSateEmployeeEntity: (state, action) => {
      state.employeeEntity = action.payload;
      state.employeeLoad = 'dataLoad';
    },
    ClearSateEmployeeEntity: (state) => {
      state.employeeEntity = {};
    },

    GetIndividualEntityState: (state, { payload }) => {
      if (payload?.createRelation) {
        return { ...state, individualEntityChangeDataLoad: 'dataLoad' };
      }
      return { ...state, individualEntityDataLoad: null };
    },
    SetSateIndividualEntity: (state, action) => {
      state.individualEntityData = action.payload;
      state.individualEntityDataLoad = 'dataLoad';
    },
    SetSateIndividualEntityTypeChange: (state, action) => {
      state.individualEntityData = action.payload;
    },
    ClearSateIndividualEntity: (state) => {
      state.individualEntityData = {};
      state.individualEntityChangeDataLoad = null;
    },
    GetPincodeDetailsState: (state) => {
      return state;
    },
    SetSatePincodeDetails: (state, action) => {
      state.pincodeDetailsState = action.payload;
    },
    ClearSatePincodeDetails: (state) => {
      state.pincodeDetailsState = {};
    },

    verifyPan: (state) => state,
    setPanResponse: (state, { payload }) => {
      state.panValidationResponse = payload;
    },

    GetMemberListState: (state) => {
      return { ...state, memberEntityLoad: null };
    },
    SetStateGetMemberList: (state, action) => {
      state.memberEntity = action.payload;
      state.memberEntityLoad = 'dataLoad';
    },
    ClearSateGetMemberList: (state) => {
      state.memberEntity = {};
    },
  },
});

export const {
  GetGeneralState,
  SetStateGeneralState,
  GetCustomerEntityState,
  SetSateCustomerEntity,
  ClearSateCustomerEntity,
  GetVendorEntityState,
  SetSateVendorEntity,
  ClearSateVendorEntity,
  GetEmployeeEntityState,
  SetSateEmployeeEntity,
  ClearSateEmployeeEntity,
  GetPincodeDetailsState,
  SetSatePincodeDetails,
  ClearSatePincodeDetails,
  GetIndividualEntityState,
  SetSateIndividualEntity,
  ClearSateIndividualEntity,
  SetSateIndividualEntityTypeChange,

  verifyPan,
  setPanResponse,

  GetMemberListState,
  SetStateGetMemberList,
  ClearSateGetMemberList,
} = GeneralSlice.actions;

export default GeneralSlice.reducer;
