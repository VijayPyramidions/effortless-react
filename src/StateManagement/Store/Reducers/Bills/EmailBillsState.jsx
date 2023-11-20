import { createSlice } from '@reduxjs/toolkit';

const initialState = {
  EmailUserListData: {},
  EmailBillsListDataState: {},
  EmailCategoryListData: {},
  SingleEmailBillData: {},
  EmailListDataState: {},
  EmailBillsListDataStateWithId: {},

  EmailBillsListDataLoad: null,
  EmailListDataLoad: null,
  EmailBillAction: '',
};

export const EmailBillsSlice = createSlice({
  name: 'EmailBills',
  initialState,
  reducers: {
    // Email Bills

    GetEmailUserListState: (state) => {
      return state;
    },
    SetStateGetEmailUserList: (state, action) => {
      state.EmailUserListData = action.payload;
    },
    ClearStateGetEmailUserList: (state) => {
      state.EmailUserListData = {};
    },

    PostNewEmailUserState: (state) => {
      return state;
    },
    PostEmailSyncState: (state) => {
      return state;
    },
    DeleteEmailState: (state) => {
      return state;
    },

    GetEmailBillsListState: (state, { payload }) => {
      if (payload?.pageNum > 1 || payload?.load) {
        return state;
      }
      return { ...state, EmailBillsListDataLoad: null };
    },
    SetStateGetEmailBillsList: (state, action) => {
      if (action.payload?.withId) {
        state.EmailBillsListDataStateWithId = action.payload?.response;
      } else {
        state.EmailBillsListDataState = action.payload?.response;
      }
      state.EmailBillsListDataLoad = 'dataLoad';
    },
    ClearStateGetEmailBillsList: (state) => {
      state.EmailBillsListDataState = {};
      state.EmailBillsListDataLoad = null;
    },
    ClearStateGetEmailBillsListWithId: (state) => {
      state.EmailBillsListDataState = {};
    },

    GetEmailBillsProviderCategoryState: (state) => {
      return state;
    },
    SetStateGetEmailBillsProviderCategory: (state, action) => {
      state.EmailCategoryListData = action.payload;
    },

    PostNewProviderState: (state) => {
      return state;
    },

    SetEmailBillActionState: (state, action) => {
      state.EmailBillAction = action.payload;
    },
    ClearEmailBillActionState: (state) => {
      state.EmailBillAction = '';
    },

    GetSingleEmailBillState: (state) => {
      return state;
    },
    SetStateGetSingleEmailBill: (state, action) => {
      state.SingleEmailBillData = action.payload;
    },
    ClearStateGetSingleEmailBill: (state) => {
      state.SingleEmailBillData = '';
    },

    DeleteEmailBillState: (state) => {
      return state;
    },
    DeleteEmailProviderState: (state) => {
      return state;
    },

    // Email List

    GetAllEmailListDataState: (state, { payload }) => {
      if (payload?.pageNum > 1) {
        return state;
      }
      return { ...state, EmailListDataLoad: null };
    },
    SetStateGetAllEmailListData: (state, action) => {
      state.EmailListDataState = action.payload;
      state.EmailListDataLoad = 'dataLoad';
    },
    ClearStateGetAllEmailListData: (state) => {
      state.EmailBillsListDataState = {};
      state.EmailListDataLoad = null;
    },
  },
});

export const {
  GetEmailUserListState,
  SetStateGetEmailUserList,
  ClearStateGetEmailUserList,

  PostNewEmailUserState,
  PostEmailSyncState,
  DeleteEmailState,

  GetEmailBillsListState,
  SetStateGetEmailBillsList,
  ClearStateGetEmailBillsList,

  GetEmailBillsProviderCategoryState,
  SetStateGetEmailBillsProviderCategory,

  PostNewProviderState,

  SetEmailBillActionState,
  ClearEmailBillActionState,

  GetSingleEmailBillState,
  SetStateGetSingleEmailBill,
  ClearStateGetSingleEmailBill,

  DeleteEmailBillState,
  DeleteEmailProviderState,

  GetAllEmailListDataState,
  SetStateGetAllEmailListData,
  ClearStateGetAllEmailListData,
  ClearStateGetEmailBillsListWithId,
} = EmailBillsSlice.actions;

export default EmailBillsSlice.reducer;
