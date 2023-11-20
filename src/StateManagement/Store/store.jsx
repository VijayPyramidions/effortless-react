import { configureStore } from '@reduxjs/toolkit';
import createSagaMiddleware from 'redux-saga';

import {
  Banking,
  Statement,
  Categorization,
  Payments,
  MakePayment,
  PaymentHistory,
  AdvancePayment,
  Invoice,
  InvoiceEWayBill,
  General,
  Settings,
  ReceivablesSettings,
  EInvoiceSettings,
  EWayBillSettings,
  Reimbursement,
  ReimbursementSettings,
  TeamSettingDepartment,
  Bills,
  BillBooking,
  BillBox,
  Journal,
  AccountedBills,
  EmailBills,
  Errors,
  AdditionalInvoiceSettings,
  TallySync,
} from './Reducers';

import RootSaga from '../MiddleWare/RootSaga';

const Saga = createSagaMiddleware();
const store = configureStore({
  reducer: {
    Banking,
    Statement,
    Categorization,

    Payments,
    MakePayment,
    PaymentHistory,
    AdvancePayment,

    Invoice,
    InvoiceEWayBill,
    General,
    Settings,
    ReceivablesSettings,
    EInvoiceSettings,
    EWayBillSettings,

    Reimbursement,
    ReimbursementSettings,
    TeamSettingDepartment,
    BillBooking,
    BillBox,
    Bills,
    AccountedBills,
    EmailBills,
    Journal,

    TallySync,

    Errors,
    AdditionalInvoiceSettings,
  },

  devTools: import.meta.NODE_ENV === 'development',
  middleware: (getDefaultMiddleware) =>
    getDefaultMiddleware({
      thunk: false,
    }).concat(Saga),
});

Saga.run(RootSaga);

export default store;
