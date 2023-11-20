import { all } from 'redux-saga/effects';

import {
  BankLists,
  SyncIcici,
  AccPreference,
  BorrowingList,
  EMIStatement,
  LoanDetails,
  AccountSync,
  AccountStatusUpdate,
  AccountDelete,
  Lenders,
  Borrowing,
  AddOtherBankManually,
  AddCashAccount,
  EditCashAccount,
  DeleteCashAccount,
  MergeBankAccount,
} from './Saga/Banking/BankingWatchers';
import {
  BankTxns,
  TransactionMove,
  TransactionSync,
} from './Saga/Banking/StatementWatchers';

import {
  PaymenstDetails,
  VendorPayments,
  QuickPayment,
  VirtualAccount,
  GetBankAccounts,
} from './Saga/Payements/PaymentsWatchers';

import {
  UnSettledVendorBills,
  CreatePaymentVoucher,
  PaymentBankAccountsDetails,
  RefreshVoucherItem,
  GetVoucherItems,
  CreateVoucherItem,
  UpdateVoucherItem,
  DeleteVoucherItem,
  RetryPayments,
  BulkDeleteVouchers,
} from './Saga/Payements/MakePaymentWatchers';

import {
  GetPaymentHistory,
  GetVendorDetail,
  RetryPayment,
} from './Saga/Payements/PaymentHistoryWatchers';

import {
  AdvancePaymentVoucher,
  GetExpenceCategory,
  GetAssetCategory,
  GetVendorList,
  CreateUpdateAdvancePayment,
  GetVoucherItemsAdvance,
} from './Saga/Payements/AdvancePaymentWatchers';

import {
  Entity,
  BillSettlement,
  ContraBanks,
} from './Saga/Banking/CategorizationWatcher';

import {
  GetInvoiceDashboardList,
  GetInvoiceDashboardForCustomerList,
  GetInvoiceDraftList,
  GetInvoiceOrgLocationList,
  GetInvoiceCustomerLocationList,
  GetInvoiceItemsList,
  PostCreateInvoiceItemsCall,
  PatchUpdateInvoiceItemsCall,
  GetInvoiceCurrencyList,
  GetInvoiceBankDataList,
  GetInvoiceSalesPersonList,
  PostInvoiceCreateNewCall,
  PatchInvoiceUpdateCall,
  GetInvoiceByIdCall,
  PostCustomerLocationCall,
  PostGenerateNewInvoiceStateCall,
  PatchUpdateRecurringInvoiceCall,
  DeleteRecurringInvoiceCall,
  GetFetchLineItemsCall,
  PostCreateLineItemsCall,
  PatchUpdateLineItemsCall,
  DeleteLineItemsCall,
  GetInvoiceUnapprovedCall,
  GetInvoiceApprovedCall,
  GetInvoiceRecurringCall,
  GetRecurringInvoiceByIdCall,
  GetRecurringInvoiceHistoryByIdCall,
  PostRecurringInvoiceFileUploadCall,
  PostInvoiceBulkUploadCall,
  GetStatusInvoiceBulkUploadCall,
  GetInvoiceCustomFieldsCall,
  DeleteDraftInvoiceCall,
  PostCancelApprovedInvoiceCall,
  PostDeclineUnApprovedInvoiceCall,
  PostApproveUnApprovedInvoiceCall,
  GetSingleItemsDetailsCall,
  GetItemsProductsListCall,
  GetItemsServicesListCall,
  GetInvoiceDeliverEmailTemplateCall,
  GetInvoiceDeliverContactListCall,
  PostInvoiceDeliverToCustomerCall,
  PostInvoiceDeliverNewContactCall,
  GetInvoiceUnsettledPaymentsCall,
  GetRasiedInvoiceListStateCall,
  PostEstimateToTaxInvoiceCall,
  PostInvoiceVersionCall,
  RetryEInvoice,
} from './Saga/Invoice/InvoiceWatchers';

import {
  GetInvoiceEWayBillCall,
  GetInvoiceGeneratedEWayBillsCall,
  PostInvoiceEWayBillCall,
  GetTransportersListCall,
  PatchInvoiceUpdateEWayBillCall,
  PostTransportersCreateCall,
  GetIndividualInvoiceEWayBillCall,
  DeleteInvoiceEWayBillPDFCall,
  PostInvoiceEWayBillNewVehicleCall,
  PatchDeactivateInvoiceEWayBillCall,
} from './Saga/Invoice/InvoiceEWayBillWatchers';

import {
  GetGeneralStateList,
  GetCustomerEntityList,
  GetVendorEntityList,
  GetEmployeeEntityList,
  GetPincodeDetailsList,
  GetIndividualEntityCall,
  VerifyPan,
  GetMemberListCall,
} from './Saga/General/GeneralWatchers';

import {
  GetOrganizationSettings,
  PatchOrganizationSettings,
} from './Saga/Settings/SettingsWatchers';

import {
  GetReceivablesRemainderCall,
  PostCreateReceivablesRemainderCall,
  DeleteReceivablesRemainderCall,
  GetReceivablesDuplicateRemainderCall,
  PatchUpdateReceivablesRemainderCall,
} from './Saga/Settings/ReceivablesSettingsWatchers';

import {
  GetEInvoiceCall,
  PostEInvoiceCall,
  PatchEInvoiceCall,
  DeleteEInvoiceCall,
} from './Saga/Settings/EInvoiceSettingsWatchers';

import {
  GetEWayBillCall,
  PostEWayBillCall,
  PatchEWayBillCall,
  DeleteEWayBillCall,
} from './Saga/Settings/EWayBillSettingsWatchers';

import {
  GetClaims,
  PostClaims,
  GetOneClaim,
  UpdateClaim,
  DeleteClaim,
  GetReimbursementAdvancesCall,
  GetTrips,
  GetAllTrips,
  PostTrip,
  EditTrip,
  DeleteTrip,
  GetManagers,
  GetEmployees,
  PostFollowUp,
  GetTripExpenses,
  ApproveClaim,
  RejectClaim,
  RaiseClaim,
  GetOCRData,
  FetchOCRData,
  GetVoucherData,
  VoucherItemsData,
  DeleteVoucherItemsData,
  AdvanceAdjust,
  TripAdjustAmount,
} from './Saga/Reimbursement/ReimbursementWachers';

import {
  GetReimbursements,
  PostReimbursement,
  PatchReimbursement,
  GetOneReimbursement,
  GetMileageHistory,
} from './Saga/Settings/ReimbursementSettingsWatchers';

import {
  GetDepartment,
  GetOneDepartment,
  PostDepartment,
  UpdateDepartment,
  DeleteDepartment,
  GetManager,
} from './Saga/Settings/TeamSettingDepartmentWatchers';

import {
  GetGeneralVendorBillDetailsCall,
  DeleteGeneralVendorBillsCall,
  GetBillsListCall,
  PatchGeneralVendorBillsCall,
} from './Saga/Bills/BillsWatchers';

import {
  GetBillBoxBillsCall,
  GetVendorBillsCountCall,
  GetVendorBillDetailsCall,
  DeleteVendorBillCall,
} from './Saga/Bills/BillBoxWatchers';

import {
  GetJournals,
  GetOneJournal,
  PostJournal,
  UpdateJournal,
  DeleteJournal,
  GetJournalDesc,
  GetJournalAccounts,
  GetJournalContacts,
} from './Saga/Bills/JournalWatchers';

import {
  GetExpenseListCall,
  GetAccountedBillsListCall,
  PostAccountedBillVersionCall,
} from './Saga/Bills/AccountedBillsWatchers';

import {
  GetEmailUserListCall,
  GetEmailBillsListCall,
  GetEmailBillsProviderCategoryCall,
  PostNewProviderCall,
  PostNewEmailUserCall,
  PostEmailSyncCall,
  DeleteEmailCall,
  GetAllEmailListDataCall,
  GetSingleEmailBillCall,
  DeleteEmailBillCall,
  DeleteEmailProviderCall,
} from './Saga/Bills/EmailBillsWatchers';

import {
  GetExpenseCategory,
  GetBillAssetCategory,
  GetVendorUnsettled,
  // GetBillVendorList,
  GetOrgLocation,
  GetOrgSetting,
  GetAllLocation,
  PostEntityDetail,
  GetGstDetail,
} from './Saga/Bills/BillBookingWatchers';

import {
  GetSync,
  GetOneSync,
  PostSync,
  GetSyncHistory,
  GetSyncSummary,
  GetLog,
  GetSyncConfig,
  PostSyncConfig,
  UpdateSyncConfig,
  GetSyncMapping,
  PostSyncMapping,
  PostSyncMappingSuper,
} from './Saga/Integration/TallySyncWatchers';

export default function* rootSaga() {
  return yield all([
    // Banking  //
    BankLists(),
    SyncIcici(),
    AccPreference(),
    BorrowingList(),
    EMIStatement(),
    LoanDetails(),
    AccountSync(),
    AccountStatusUpdate(),
    AccountDelete(),
    Lenders(),
    Borrowing(),
    AddOtherBankManually(),
    AddCashAccount(),
    EditCashAccount(),
    DeleteCashAccount(),
    MergeBankAccount(),

    // Banking Statement //
    BankTxns(),
    TransactionMove(),
    TransactionSync(),

    // Categorization //
    Entity(),
    BillSettlement(),
    ContraBanks(),

    // Payments Start //
    PaymenstDetails(),
    VendorPayments(),
    QuickPayment(),
    VirtualAccount(),
    GetBankAccounts(),

    // Make Payment //
    UnSettledVendorBills(),
    CreatePaymentVoucher(),
    PaymentBankAccountsDetails(),
    RefreshVoucherItem(),
    GetVoucherItems(),
    CreateVoucherItem(),
    UpdateVoucherItem(),
    DeleteVoucherItem(),
    RetryPayments(),
    BulkDeleteVouchers(),

    // Payment Hitory //
    GetPaymentHistory(),
    GetVendorDetail(),
    RetryPayment(),

    // Advance Payment //
    AdvancePaymentVoucher(),
    GetExpenceCategory(),
    GetAssetCategory(),
    GetVendorList(),
    GetVoucherItemsAdvance(),
    CreateUpdateAdvancePayment(),

    // Payments End//

    // invoice //
    GetInvoiceDashboardList(),
    GetInvoiceDashboardForCustomerList(),
    GetInvoiceDraftList(),
    GetInvoiceOrgLocationList(),
    GetInvoiceCustomerLocationList(),
    GetInvoiceItemsList(),
    GetInvoiceCurrencyList(),
    GetInvoiceBankDataList(),
    GetInvoiceSalesPersonList(),
    PostInvoiceCreateNewCall(),
    PatchInvoiceUpdateCall(),
    GetInvoiceByIdCall(),
    PostCustomerLocationCall(),
    PostGenerateNewInvoiceStateCall(),
    PatchUpdateRecurringInvoiceCall(),
    DeleteRecurringInvoiceCall(),
    GetFetchLineItemsCall(),
    PostCreateLineItemsCall(),
    PatchUpdateLineItemsCall(),
    DeleteLineItemsCall(),
    PostCreateInvoiceItemsCall(),
    PatchUpdateInvoiceItemsCall(),
    GetInvoiceUnapprovedCall(),
    GetInvoiceApprovedCall(),
    GetInvoiceRecurringCall(),
    GetRecurringInvoiceByIdCall(),
    GetRecurringInvoiceHistoryByIdCall(),
    PostRecurringInvoiceFileUploadCall(),
    PostInvoiceBulkUploadCall(),
    GetStatusInvoiceBulkUploadCall(),
    GetInvoiceCustomFieldsCall(),
    DeleteDraftInvoiceCall(),
    PostCancelApprovedInvoiceCall(),
    PostDeclineUnApprovedInvoiceCall(),
    PostApproveUnApprovedInvoiceCall(),
    GetSingleItemsDetailsCall(),
    GetItemsProductsListCall(),
    GetItemsServicesListCall(),
    GetInvoiceDeliverEmailTemplateCall(),
    GetInvoiceDeliverContactListCall(),
    PostInvoiceDeliverToCustomerCall(),
    PostInvoiceDeliverNewContactCall(),
    GetInvoiceUnsettledPaymentsCall(),
    GetRasiedInvoiceListStateCall(),
    PostEstimateToTaxInvoiceCall(),
    PostInvoiceVersionCall(),
    RetryEInvoice(),

    // InvoiceEWayBill
    GetInvoiceEWayBillCall(),
    PostInvoiceEWayBillCall(),
    GetInvoiceGeneratedEWayBillsCall(),
    GetTransportersListCall(),
    PatchInvoiceUpdateEWayBillCall(),
    PostTransportersCreateCall(),
    GetIndividualInvoiceEWayBillCall(),
    DeleteInvoiceEWayBillPDFCall(),
    PostInvoiceEWayBillNewVehicleCall(),
    PatchDeactivateInvoiceEWayBillCall(),

    // General
    GetGeneralStateList(),
    GetCustomerEntityList(),
    GetVendorEntityList(),
    GetEmployeeEntityList(),
    GetIndividualEntityCall(),
    GetPincodeDetailsList(),
    VerifyPan(),
    GetMemberListCall(),

    // Bill

    GetGeneralVendorBillDetailsCall(),
    DeleteGeneralVendorBillsCall(),
    PatchGeneralVendorBillsCall(),
    // Draft Bill

    GetBillsListCall(),

    // Bill Booking

    GetExpenseCategory(),
    GetBillAssetCategory(),
    GetVendorUnsettled(),
    // GetBillVendorList(),
    GetOrgLocation(),
    GetOrgSetting(),
    GetAllLocation(),
    PostEntityDetail(),
    GetGstDetail(),

    // BillBox

    GetBillBoxBillsCall(),
    GetVendorBillsCountCall(),
    GetVendorBillDetailsCall(),
    DeleteVendorBillCall(),

    // Accounted Bills

    GetExpenseListCall(),
    GetAccountedBillsListCall(),
    PostAccountedBillVersionCall(),

    // Email Bill

    GetEmailUserListCall(),
    GetEmailBillsListCall(),
    GetEmailBillsProviderCategoryCall(),
    PostNewProviderCall(),
    PostNewEmailUserCall(),
    PostEmailSyncCall(),
    DeleteEmailCall(),
    GetSingleEmailBillCall(),
    DeleteEmailBillCall(),
    DeleteEmailProviderCall(),

    // Email List

    GetAllEmailListDataCall(),

    // Journal

    GetJournals(),
    GetOneJournal(),
    PostJournal(),
    UpdateJournal(),
    DeleteJournal(),
    GetJournalDesc(),
    GetJournalAccounts(),
    GetJournalContacts(),
    // Bill

    // Integration

    // Tally
    GetSync(),
    GetOneSync(),
    PostSync(),
    GetSyncHistory(),
    GetSyncSummary(),
    GetLog(),
    GetSyncConfig(),
    PostSyncConfig(),
    UpdateSyncConfig(),
    GetSyncMapping(),
    PostSyncMapping(),
    PostSyncMappingSuper(),

    // Integration

    // Settings Start

    GetOrganizationSettings(),
    PatchOrganizationSettings(),

    // Receivables Settings
    GetReceivablesRemainderCall(),
    PostCreateReceivablesRemainderCall(),
    DeleteReceivablesRemainderCall(),
    GetReceivablesDuplicateRemainderCall(),
    PatchUpdateReceivablesRemainderCall(),

    // EInvoice Settings
    GetEInvoiceCall(),
    PostEInvoiceCall(),
    PatchEInvoiceCall(),
    DeleteEInvoiceCall(),

    // EWayBill Settings
    GetEWayBillCall(),
    PostEWayBillCall(),
    PatchEWayBillCall(),
    DeleteEWayBillCall(),

    // Reimbursement
    GetClaims(),
    PostClaims(),
    GetOneClaim(),
    UpdateClaim(),
    DeleteClaim(),
    GetReimbursementAdvancesCall(),
    GetTrips(),
    GetAllTrips(),
    PostTrip(),
    EditTrip(),
    DeleteTrip(),
    GetManagers(),
    GetEmployees(),
    PostFollowUp(),
    GetTripExpenses(),
    ApproveClaim(),
    RejectClaim(),
    RaiseClaim(),
    GetOCRData(),
    FetchOCRData(),
    GetVoucherData(),
    VoucherItemsData(),
    DeleteVoucherItemsData(),
    AdvanceAdjust(),
    TripAdjustAmount(),

    // Reimbursement Settings
    GetReimbursements(),
    PostReimbursement(),
    PatchReimbursement(),
    GetOneReimbursement(),
    GetMileageHistory(),

    // TeamSettings Department

    GetDepartment(),
    GetOneDepartment(),
    PostDepartment(),
    UpdateDepartment(),
    DeleteDepartment(),
    GetManager(),
    // Settings End
  ]);
}
