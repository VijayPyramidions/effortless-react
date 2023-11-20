import { createSlice } from '@reduxjs/toolkit';

const initialState = {
  bankListingDetails: [],
  effortlessAccount: {},
  businessAccounts: {},
  founderAccounts: {},
  borrowingAccounts: {},
  activeList: {
    Business: true,
    Founder: false,
    Borrow: false,
  },
  active: {
    Business: null,
    Founder: null,
    Borrow: null,
    BorrowType: null,
    tab: 'Business',
  },
  Banks: {
    BankList: [],
    title: '',
    total_amt: '0.00',
  },
  virtualAccountShow: false,
  addIciciBanks: false,
  YodleeBank: {
    fastLinkConfig: null,
    fastLinkConfigLocal: null,
    bankAccountType: null,
    bank_account_id: null,
  },

  founderAccountHeader: '',

  bankLoans: {},
  EMIStatementDetail: [],
  loanDetails: [],

  borrowing: false,
  congratsDrawer: { open: false, accountType: '' },

  Lenders: [],

  oneLoanDetail: {},

  addBankDrawer: false,
  editCashAccountDr: false,
  mergeAccDrawer: false,
  loading: false,
  dataLoad: null,
};

export const BankingSlice = createSlice({
  name: 'Banking',
  initialState,
  reducers: {
    getBankList: (state) => {
      state.loading = true;
      state.effortlessAccount = {};
      state.businessAccounts = {};
      state.founderAccounts = {};
      state.borrowingAccounts = {};
      state.bankListingDetails = [];
      state.dataLoad = null;
    },
    setBankList: (state, { payload }) => {
      state.effortlessAccount = payload.ef_acc;
      state.businessAccounts = payload.business;
      state.founderAccounts = payload.founder;
      state.bankListingDetails = payload.data.data;

      state.borrowingAccounts = payload.data.borrowings;
    },

    setActiveList: (state, { payload }) => {
      if (payload === 'Business') {
        state.activeList.Business = true;
        state.activeList.Founder = false;
        state.activeList.Borrow = false;
      } else if (payload === 'Founder') {
        state.activeList.Business = false;
        state.activeList.Founder = true;
        state.activeList.Borrow = false;
      } else if (payload === 'Borrow') {
        state.activeList.Business = false;
        state.activeList.Founder = false;
        state.activeList.Borrow = true;
      }
    },

    setActive: (state, { payload }) => {
      if (payload === 'Business') {
        state.active.Business = payload;
        state.active.Founder = null;
        state.active.Borrow = null;
      } else if (payload === 'Founder') {
        state.active.Business = null;
        state.active.Founder = payload;
        state.active.Borrow = null;
      } else if (payload === 'Borrow') {
        state.active.Business = null;
        state.active.Founder = null;
        state.active.Borrow = payload;
      }
    },

    setBanks: (state, { payload }) => {
      const { tab, ind, title, bankList, sumAmt, BorrowType } = payload;
      if (tab !== 'No data') {
        if (tab !== 'Borrow') {
          if (tab === 'Business') {
            state.active.Business = ind;
            state.active.Founder = null;
            state.active.Borrow = null;
          } else {
            state.active.Business = null;
            state.active.Founder = ind;
            state.active.Borrow = null;
          }
          state.Banks.BankList = bankList;
          state.Banks.title = title;
          state.Banks.total_amt = sumAmt;
          state.dataLoad = 'dataLoaded';
          state.active.tab = tab;
        } else {
          state.active.Business = null;
          state.active.Founder = null;
          state.active.Borrow = ind;
          state.active.BorrowType = BorrowType;
          state.active.tab = tab;
        }
      } else state.dataLoad = 'dataNotLoaded';
    },

    openVirtualAccount: (state) => {
      state.virtualAccountShow = true;
    },
    closeVirtualAccount: (state) => {
      state.virtualAccountShow = false;
    },

    iciciAccountSync: (state) => state,

    addBankAccounts: (state, { payload }) => {
      if (payload.type === 'Add ICICI Bank Account') state.addIciciBanks = true;
      else {
        state.YodleeBank.fastLinkConfig = payload.fastConfig;
        state.YodleeBank.fastLinkConfigLocal = payload.fastConfigLocal;
        state.YodleeBank.bankAccountType = payload.accountType;
        state.YodleeBank.bank_account_id = payload.accountId;
      }
    },

    closeBankAccount: (state, { payload }) => {
      if (payload.type === 'icici') state.addIciciBanks = false;
      else {
        state.YodleeBank.fastLinkConfig = null;
        state.YodleeBank.fastLinkConfigLocal = null;
        state.YodleeBank.bankAccountType = null;
        state.YodleeBank.bank_account_id = null;
      }
    },

    AccountPreference: (state) => state,

    setAccountPreference: (state, { payload }) => {
      state.founderAccountHeader = payload;
    },

    getBorrowingList: (state) => state,
    setBorrowingList: (state, { payload }) => {
      state.bankLoans = payload;
    },

    getEMIStatement: (state) => state,
    setEMIStatement: (state, { payload }) => {
      state.EMIStatementDetail = payload;
    },

    getLoanDetails: (state) => state,
    setLoanDetails: (state, { payload }) => {
      state.loanDetails = payload;
    },

    openBorrowing: (state) => {
      state.borrowing = true;
    },
    closeBorrowing: (state) => {
      state.borrowing = false;
    },

    openTranPassword: (state, { payload }) => {
      state.congratsDrawer.open = true;
      state.congratsDrawer.accountType = payload;
    },
    closeTranPassword: (state) => {
      state.congratsDrawer.open = false;
      state.congratsDrawer.accountType = '';
    },

    BankSync: (state) => state,
    BankStausUpdate: (state) => state,
    DeleteBankAccount: (state) => state,

    getLenders: (state) => state,
    setLenders: (state, { payload }) => {
      state.Lenders = payload;
    },
    addBorrowing: (state) => state,

    setOneLoanDetail: (state, { payload }) => {
      state.oneLoanDetail = payload;
    },

    addOtherBank: (state, { payload }) => {
      state.addBankDrawer = payload;
    },

    addOtherBankManually: (state) => state,

    setLoading: (state) => {
      state.loading = false;
    },

    addCashAccount: (state) => state,
    editCashAccount: (state) => state,
    deleteCashAccount: (state) => state,

    setEditCashAccountDr: (state, { payload }) => {
      state.editCashAccountDr = payload;
    },

    mergeBankAccount: (state) => state,
    setMergeAccDrawer: (state, { payload }) => {
      state.mergeAccDrawer = payload;
    },

    resetBankingState: () => initialState,
  },
});

export const {
  getBankList,
  setBankList,
  setActiveList,

  setActive,

  setBanks,

  openVirtualAccount,
  closeVirtualAccount,

  addBankAccounts,
  closeBankAccount,

  iciciAccountSync,

  AccountPreference,
  setAccountPreference,

  getBorrowingList,
  setBorrowingList,

  getEMIStatement,
  setEMIStatement,

  getLoanDetails,
  setLoanDetails,

  openBorrowing,
  closeBorrowing,

  openTranPassword,
  closeTranPassword,

  BankSync,
  BankStausUpdate,
  DeleteBankAccount,

  getLenders,
  setLenders,

  addBorrowing,

  setOneLoanDetail,

  addOtherBank,
  addOtherBankManually,

  addCashAccount,
  editCashAccount,
  deleteCashAccount,
  setEditCashAccountDr,
  mergeBankAccount,
  setMergeAccDrawer,

  resetBankingState,

  setLoading,
} = BankingSlice.actions;

export default BankingSlice.reducer;
