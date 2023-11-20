import { createSlice } from '@reduxjs/toolkit';

const initialState = {
  dataLoad: { journal: true, accounts: true },
  drawer: { open: false, delete: false },
  journals: [],
  jouralDesc: [],
  journalAccounts: [],
  journalContacts: [],
  journalNumber: null,
  oneJournal: null,
};

export const JournalSlice = createSlice({
  name: 'Journal',
  initialState,
  reducers: {
    getJournals: (state) => {
      state.dataLoad.journal = true;
      state.journals = [];
    },
    setJournals: (state, { payload }) => {
      state.journals = payload.data;
      state.journalNumber = payload.next_number;
      state.dataLoad.journal = false;
    },

    getOneJournal: (state) => state,
    setOneJournal: (state, { payload }) => {
      state.oneJournal = payload;
    },
    postJournal: (state) => state,
    updateJournal: (state) => state,
    deleteJournal: (state) => state,

    getJournalDesc: (state) => state,
    setJouralDesc: (state, { payload }) => {
      state.jouralDesc = payload;
    },

    getJournalAccounts: (state) => {
      state.dataLoad.accounts = true;
    },
    setJournalAccounts: (state, { payload }) => {
      state.journalAccounts = payload;
      state.dataLoad.accounts = false;
    },

    getJournalContacts: (state) => state,
    setJournalContacts: (state, { payload }) => {
      state.journalContacts = payload;
    },

    setDrawer: (state, { payload }) => {
      state.drawer[payload.name] = payload.value;
    },
  },
});

export const {
  getJournals,
  setJournals,
  getOneJournal,
  setOneJournal,
  postJournal,
  updateJournal,
  deleteJournal,

  getJournalDesc,
  setJouralDesc,

  getJournalAccounts,
  setJournalAccounts,

  getJournalContacts,
  setJournalContacts,

  setDrawer,
} = JournalSlice.actions;

export default JournalSlice.reducer;
