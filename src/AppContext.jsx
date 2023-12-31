import { createContext } from 'react';

const AppContext = createContext({
  user: {},
  viewType: 'signIn',
  signIn: () => null,
  signOut: () => null,
  signUp: () => null,
  signUpSubmit: () => null,
  organization: {},
  loading: false,
  snackBar: {},
  toggleSidePanel: () => null,
  openSidePanel: false,
  registerEventListeners: () => null,
  deRegisterEventListener: () => null,
  registererdListeners: {},
  notificationList: [],
  amt: {},
  setAmt: () => null,
  categorize: {},
  setCategorize: () => null,
  currentUserInfo: {},
  indexHeading: {},
  setIndexHeading: () => null,
  dates: {},
  logo: {},
  setLogo: {},
  setDates: () => null,
  txnStatus: {},
  setTxnStatus: () => null,
  transactionType: '',
  setTransactionType: () => {},
  transactionTypeList: [],
  setTransactionTypeList: () => [],
  invoiceCounts: {},
  setInvoiceCounts: {},
  setEstimateName: '',
  globalSearch: '',
  setGlobalSearch: () => '',
});

export default AppContext;
