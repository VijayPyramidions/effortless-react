import { createSlice } from '@reduxjs/toolkit';

const initialState = {
  invoiceDashboardState: {},
  invoiceDashboardStateForCustomer: {},
  createInvoiceState: {},
  invoiceDraftData: {},
  recurringUpdateState: {},
  lineItemsState: {},
  modifyItemsState: {},
  invoiceUnapprovedData: {},
  invoiceApprovedData: {},
  invoiceRecurringData: {},
  recurringInvoiceDataById: {},
  recurringInvoiceHistoryDataById: {},
  invoiceBulkUploadData: {},
  invoiceBulkUploadStatusData: {},
  invoiceCustomFiled: {},
  actionDraftInvoiceData: {},
  actionApprovedInvoiceData: {},
  actionUnApprovedInvoiceData: {},
  selectedEditItem: {},
  HSNSACItemsList: {},
  deliverInvoiceToCustomerData: {},
  actionGeneratePdf: {},
  invoiceVersionState: {},
  invoiceSettingsData: {},
  dashboardLoad: null,
  draftLoad: null,
  unApprovedLoad: null,
  approvedLoad: null,
  recurringLoad: null,
};

export const InvoiceSlice = createSlice({
  name: 'Invoice',
  initialState,
  reducers: {
    GetInvoiceDashboardState: (state) => {
      return state;
    },
    SetStateInvoiceDashboard: (state, action) => {
      state.invoiceDashboardState = action.payload;
      state.dashboardLoad = 'dataLoad';
    },
    GetInvoiceDashboardStateForCustomer: (state) => {
      return state;
    },
    SetStateInvoiceDashboardForCustomer: (state, action) => {
      state.invoiceDashboardStateForCustomer = action.payload;
    },
    ClearStateInvoiceDashboardForCustomer: (state) => {
      state.invoiceDashboardStateForCustomer = {};
    },
    GetInvoiceDraftState: (state, { payload }) => {
      if (Object.values(payload).every((val) => val === '')) {
        return { ...state, draftLoad: null };
      }
      return state;
    },
    SetStateInvoiceDraft: (state, action) => {
      state.invoiceDraftData = action?.payload;
      state.draftLoad = 'dataLoad';
    },
    ClearStateInvoiceDraft: (state) => {
      state.invoiceDraftData = {};
    },
    GetInvoiceOrgLocationState: (state) => {
      return state;
    },
    SetStateInvoiceOrgLocation: (state, action) => {
      state.createInvoiceState.orgLocationList = action?.payload;
    },
    GetInvoiceCustomerLocationState: (state) => {
      return state;
    },
    SetStateInvoiceCustomerLocation: (state, action) => {
      state.createInvoiceState.customerLocationList = action?.payload;
    },
    ClearStateInvoiceCustomerLocation: (state) => {
      state.createInvoiceState.customerLocationList = {};
    },
    GetInvoiceItemsState: (state) => {
      return state;
    },
    SetStateInvoiceItems: (state, action) => {
      state.createInvoiceState.itemsList = action?.payload;
    },
    ClearStateInvoiceItems: (state) => {
      state.createInvoiceState.itemsList = {};
    },
    PostCreateInvoiceItemsState: (state) => {
      return state;
    },
    PatchUpdateInvoiceItemsState: (state) => {
      return state;
    },
    SetStateModifyInvoiceItems: (state, action) => {
      state.modifyItemsState = action?.payload;
    },
    ClearStateModifyInvoiceItems: (state) => {
      state.modifyItemsState = {};
    },
    GetInvoiceCurrencyState: (state) => {
      return state;
    },
    SetStateInvoiceCurrencyState: (state, action) => {
      state.createInvoiceState.currencyList = action?.payload;
    },
    GetInvoiceBankDataState: (state) => {
      return state;
    },
    SetStateInvoiceBankData: (state, action) => {
      state.createInvoiceState.bankDataList = action?.payload;
    },
    GetInvoiceSalesPersonState: (state) => {
      return state;
    },
    SetStateInvoiceSalesPerson: (state, action) => {
      state.createInvoiceState.salesPersonList = action?.payload;
    },
    PostInvoiceCreateNewState: (state) => {
      return state;
    },
    SetStateInvoiceCreateNew: (state, action) => {
      state.createInvoiceState.newInvoice = action?.payload;
    },
    ClearStateInvoiceCreateNew: (state) => {
      state.createInvoiceState.newInvoice = {};
    },
    PatchInvoiceUpdateState: (state) => {
      return state;
    },
    SetStateInvoiceUpdate: (state, action) => {
      state.createInvoiceState.newInvoice = action?.payload;
    },
    GetInvoiceByIdState: (state) => {
      return state;
    },
    SetStateInvoiceById: (state, action) => {
      state.createInvoiceState.newInvoice = action?.payload;
    },
    PostCustomerLocationState: (state) => {
      return state;
    },
    SetStateCustomerLocation: (state, action) => {
      state.createInvoiceState.createCustomerLocation = action?.payload;
    },
    ClearStateCustomerLocation: (state) => {
      state.createInvoiceState.createCustomerLocation = {};
    },
    PostGenerateNewInvoiceState: (state) => {
      return state;
    },
    SetStateGenerateNewInvoice: (state, action) => {
      state.createInvoiceState.generateNewInvoice = action?.payload;
    },
    ClearStateGenerateNewInvoice: (state) => {
      state.createInvoiceState.generateNewInvoice = {};
    },
    PatchUpdateRecurringInvoiceState: (state) => {
      return state;
    },
    SetStateUpdateRecurringInvoice: (state, action) => {
      state.recurringUpdateState = action?.payload;
    },
    ClearUpdateRecurringInvoiceState: (state) => {
      state.recurringUpdateState = {};
    },
    DeleteRecurringInvoiceState: (state) => {
      return state;
    },
    GetFetchLineItemsState: (state) => {
      return state;
    },
    SetStateFetchLineItems: (state, action) => {
      state.lineItemsState = action?.payload;
    },
    ClearStateFetchLineItems: (state) => {
      state.lineItemsState = {};
    },
    PostCreateLineItemsState: (state) => {
      return state;
    },
    PatchUpdateLineItemsState: (state) => {
      return state;
    },
    DeleteLineItemsState: (state) => {
      return state;
    },
    GetInvoiceUnapprovedState: (state, { payload }) => {
      if (Object.values(payload).every((val) => val === '')) {
        return { ...state, unApprovedLoad: null };
      }
      return state;
    },
    SetStateInvoiceUnapproved: (state, action) => {
      state.invoiceUnapprovedData = action?.payload;
      state.unApprovedLoad = 'dataLoad';
    },
    ClearStateInvoiceUnapproved: (state) => {
      state.invoiceUnapprovedData = {};
    },

    GetInvoiceApprovedState: (state, { payload }) => {
      if (Object.values(payload).every((val) => val === '')) {
        return { ...state, approvedLoad: null };
      }
      return state;
    },
    SetStateInvoiceApproved: (state, action) => {
      state.invoiceApprovedData = action?.payload;
      state.approvedLoad = 'dataLoad';
    },
    ClearStateInvoiceApproved: (state) => {
      state.invoiceApprovedData = {};
      state.approvedLoad = null;
    },

    GetInvoiceRecurringState: (state, { payload }) => {
      if (payload?.numPage === 1 || !payload?.numPage) {
        return { ...state, recurringLoad: null };
      }
      return state;
    },
    SetStateInvoiceRecurring: (state, action) => {
      state.invoiceRecurringData = action?.payload;
      state.recurringLoad = 'dataLoad';
    },
    ClearStateInvoiceRecurring: (state) => {
      state.invoiceRecurringData = {};
    },

    GetRecurringInvoiceByIdState: (state) => {
      return { ...state, recurringLoad: null };
    },
    SetStateRecurringInvoiceById: (state, action) => {
      state.recurringInvoiceDataById = action?.payload;
      state.recurringLoad = 'dataLoad';
    },
    GetRecurringInvoiceHistoryByIdState: (state) => {
      return state;
    },
    SetStateRecurringInvoiceHistoryById: (state, action) => {
      state.recurringInvoiceHistoryDataById = action?.payload;
    },
    ClearStateRecurringInvoiceById: (state) => {
      state.recurringInvoiceDataById = {};
      state.recurringInvoiceHistoryDataById = {};
      state.recurringUpdateState = {};
    },
    PostRecurringInvoiceFileUploadState: (state) => {
      return state;
    },
    PostInvoiceBulkUploadState: (state) => {
      return state;
    },
    SetStateInvoiceBulkUpload: (state, action) => {
      state.invoiceBulkUploadData = action?.payload;
    },
    GetStatusInvoiceBulkUploadState: (state) => {
      return state;
    },
    SetStateStatusInvoiceBulkUpload: (state, action) => {
      state.invoiceBulkUploadStatusData = action?.payload;
    },
    ClearStateStatusInvoiceBulkUpload: (state) => {
      state.invoiceBulkUploadData = {};
      state.invoiceBulkUploadStatusData = {};
    },
    GetInvoiceCustomFieldsState: (state) => {
      return state;
    },
    SetStateInvoiceCustomFields: (state, action) => {
      state.invoiceCustomFiled = action?.payload;
    },
    ClearStateInvoiceCustomFields: (state) => {
      state.invoiceCustomFiled = {};
    },
    DeleteDraftInvoiceState: (state) => {
      return state;
    },
    SetStateDeleteDraftInvoice: (state, action) => {
      state.actionDraftInvoiceData.deleteAction = action?.payload;
    },
    PostCancelApprovedInvoiceState: (state) => {
      return state;
    },
    SetStateCancelApprovedInvoice: (state, action) => {
      state.actionApprovedInvoiceData.cancelAction = action?.payload;
    },
    PostDeclineUnApprovedInvoiceState: (state) => {
      return state;
    },
    PostApproveUnApprovedInvoiceState: (state) => {
      return state;
    },
    SetStateDeclineUnApprovedInvoice: (state, action) => {
      state.actionUnApprovedInvoiceData.declineAction = action?.payload;
    },
    SetStateApproveUnApprovedInvoice: (state, action) => {
      state.actionUnApprovedInvoiceData.approveAction = action?.payload;
    },
    ClearStateActionInvoice: (state) => {
      state.actionUnApprovedInvoiceData = {};
      state.actionApprovedInvoiceData = {};
      state.actionDraftInvoiceData = {};
    },
    GetSingleItemsDetailsState: (state) => {
      return state;
    },
    SetStateSingleItemsDetails: (state, action) => {
      state.selectedEditItem = action?.payload;
    },
    ClearStateSingleItemsDetails: (state) => {
      state.selectedEditItem = {};
    },
    GetItemsProductsListState: (state) => {
      return state;
    },
    GetItemsServicesListState: (state) => {
      return state;
    },
    SetStateHSNItemsList: (state, action) => {
      state.HSNSACItemsList.productList = action?.payload;
    },
    SetStateSACItemsList: (state, action) => {
      state.HSNSACItemsList.serviceList = action?.payload;
    },
    GetInvoiceDeliverEmailTemplateState: (state) => {
      return state;
    },
    GetInvoiceDeliverContactListState: (state) => {
      return state;
    },
    PostInvoiceDeliverToCustomerState: (state) => {
      return state;
    },
    PostInvoiceDeliverNewContactState: (state) => {
      return state;
    },
    SetStateInvoiceDeliverEmailTemplate: (state, action) => {
      state.deliverInvoiceToCustomerData.emailTemplate = action?.payload;
    },
    SetStateInvoiceDeliverContactList: (state, action) => {
      state.deliverInvoiceToCustomerData.contactList = action?.payload;
    },
    SetStateInvoiceDeliverAction: (state, action) => {
      state.deliverInvoiceToCustomerData.deliverAction = action?.payload;
    },
    ClearStateInvoiceDeliverAction: (state) => {
      state.deliverInvoiceToCustomerData = {};
    },
    GetInvoiceUnsettledPaymentsState: (state) => {
      return state;
    },
    SetStateInvoiceUnsettledPayments: (state, action) => {
      state.createInvoiceState.unsettledPaymentsList = action?.payload;
    },
    ClearStateInvoiceUnsettledPayments: (state) => {
      state.createInvoiceState.unsettledPaymentsList = {};
    },
    GetRasiedInvoiceListState: (state) => {
      return state;
    },
    SetStateRasiedInvoiceList: (state, action) => {
      state.createInvoiceState.rasiedInvoiceList = action?.payload;
    },
    ClearStateRasiedInvoiceList: (state) => {
      state.createInvoiceState.rasiedInvoiceList = {};
    },
    PostEstimateToTaxInvoiceState: (state) => {
      return state;
    },
    PostInvoiceVersionState: (state) => {
      return state;
    },
    SetStateGeneratePdfAction: (state, action) => {
      state.actionGeneratePdf = action?.payload;
    },
    ClearStateGeneratePdfAction: (state) => {
      state.actionGeneratePdf = {};
    },
    SetStateInvoiceSettings: (state, action) => {
      state.invoiceSettingsData = action?.payload;
    },

    retryEInvoice: (state) => state,
  },
});

export const {
  GetInvoiceDashboardState,
  SetStateInvoiceDashboard,
  GetInvoiceDashboardStateForCustomer,
  SetStateInvoiceDashboardForCustomer,
  ClearStateInvoiceDashboardForCustomer,
  GetInvoiceDraftState,
  SetStateInvoiceDraft,
  ClearStateInvoiceDraft,
  GetInvoiceOrgLocationState,
  SetStateInvoiceOrgLocation,
  GetInvoiceCustomerLocationState,
  SetStateInvoiceCustomerLocation,
  ClearStateInvoiceCustomerLocation,
  GetInvoiceItemsState,
  SetStateInvoiceItems,
  ClearStateInvoiceItems,
  PostCreateInvoiceItemsState,
  PatchUpdateInvoiceItemsState,
  SetStateModifyInvoiceItems,
  ClearStateModifyInvoiceItems,
  GetInvoiceCurrencyState,
  SetStateInvoiceCurrencyState,
  GetInvoiceBankDataState,
  SetStateInvoiceBankData,
  GetInvoiceSalesPersonState,
  SetStateInvoiceSalesPerson,
  PostInvoiceCreateNewState,
  SetStateInvoiceCreateNew,
  ClearStateInvoiceCreateNew,
  PatchInvoiceUpdateState,
  SetStateInvoiceUpdate,
  GetInvoiceByIdState,
  SetStateInvoiceById,
  PostCustomerLocationState,
  SetStateCustomerLocation,
  ClearStateCustomerLocation,
  PostGenerateNewInvoiceState,
  SetStateGenerateNewInvoice,
  ClearStateGenerateNewInvoice,
  PatchUpdateRecurringInvoiceState,
  SetStateUpdateRecurringInvoice,
  ClearUpdateRecurringInvoiceState,
  DeleteRecurringInvoiceState,
  GetFetchLineItemsState,
  SetStateFetchLineItems,
  ClearStateFetchLineItems,
  PostCreateLineItemsState,
  PatchUpdateLineItemsState,
  DeleteLineItemsState,
  GetInvoiceUnapprovedState,
  SetStateInvoiceUnapproved,
  ClearStateInvoiceUnapproved,
  GetInvoiceApprovedState,
  SetStateInvoiceApproved,
  ClearStateInvoiceApproved,
  GetInvoiceRecurringState,
  SetStateInvoiceRecurring,
  ClearStateInvoiceRecurring,
  GetRecurringInvoiceByIdState,
  SetStateRecurringInvoiceById,
  GetRecurringInvoiceHistoryByIdState,
  SetStateRecurringInvoiceHistoryById,
  ClearStateRecurringInvoiceById,
  PostRecurringInvoiceFileUploadState,
  PostInvoiceBulkUploadState,
  SetStateInvoiceBulkUpload,
  GetStatusInvoiceBulkUploadState,
  SetStateStatusInvoiceBulkUpload,
  ClearStateStatusInvoiceBulkUpload,
  GetInvoiceCustomFieldsState,
  SetStateInvoiceCustomFields,
  ClearStateInvoiceCustomFields,
  DeleteDraftInvoiceState,
  SetStateDeleteDraftInvoice,
  PostCancelApprovedInvoiceState,
  SetStateCancelApprovedInvoice,
  PostDeclineUnApprovedInvoiceState,
  PostApproveUnApprovedInvoiceState,
  SetStateDeclineUnApprovedInvoice,
  SetStateApproveUnApprovedInvoice,
  ClearStateActionInvoice,
  GetSingleItemsDetailsState,
  SetStateSingleItemsDetails,
  ClearStateSingleItemsDetails,
  GetItemsProductsListState,
  GetItemsServicesListState,
  SetStateHSNItemsList,
  SetStateSACItemsList,
  GetInvoiceDeliverEmailTemplateState,
  GetInvoiceDeliverContactListState,
  PostInvoiceDeliverToCustomerState,
  PostInvoiceDeliverNewContactState,
  SetStateInvoiceDeliverEmailTemplate,
  SetStateInvoiceDeliverContactList,
  SetStateInvoiceDeliverAction,
  ClearStateInvoiceDeliverAction,
  GetInvoiceUnsettledPaymentsState,
  SetStateInvoiceUnsettledPayments,
  ClearStateInvoiceUnsettledPayments,
  GetRasiedInvoiceListState,
  SetStateRasiedInvoiceList,
  ClearStateRasiedInvoiceList,
  PostEstimateToTaxInvoiceState,
  PostInvoiceVersionState,
  SetStateGeneratePdfAction,
  ClearStateGeneratePdfAction,
  SetStateInvoiceSettings,
  retryEInvoice,
} = InvoiceSlice.actions;

export default InvoiceSlice.reducer;
