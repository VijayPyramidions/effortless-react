import { takeLatest } from 'redux-saga/effects';

import {
  GetInvoiceDashboardState,
  GetInvoiceDashboardStateForCustomer,
  GetInvoiceDraftState,
  GetInvoiceOrgLocationState,
  GetInvoiceCustomerLocationState,
  GetInvoiceItemsState,
  PostCreateInvoiceItemsState,
  PatchUpdateInvoiceItemsState,
  GetInvoiceCurrencyState,
  GetInvoiceBankDataState,
  GetInvoiceSalesPersonState,
  PostInvoiceCreateNewState,
  PatchInvoiceUpdateState,
  GetInvoiceByIdState,
  PostCustomerLocationState,
  PostGenerateNewInvoiceState,
  PatchUpdateRecurringInvoiceState,
  DeleteRecurringInvoiceState,
  GetFetchLineItemsState,
  PostCreateLineItemsState,
  PatchUpdateLineItemsState,
  DeleteLineItemsState,
  GetInvoiceUnapprovedState,
  GetInvoiceApprovedState,
  GetInvoiceRecurringState,
  GetRecurringInvoiceByIdState,
  GetRecurringInvoiceHistoryByIdState,
  PostRecurringInvoiceFileUploadState,
  PostInvoiceBulkUploadState,
  GetStatusInvoiceBulkUploadState,
  GetInvoiceCustomFieldsState,
  DeleteDraftInvoiceState,
  PostCancelApprovedInvoiceState,
  PostDeclineUnApprovedInvoiceState,
  PostApproveUnApprovedInvoiceState,
  GetSingleItemsDetailsState,
  GetItemsProductsListState,
  GetItemsServicesListState,
  GetInvoiceDeliverEmailTemplateState,
  GetInvoiceDeliverContactListState,
  PostInvoiceDeliverToCustomerState,
  PostInvoiceDeliverNewContactState,
  GetInvoiceUnsettledPaymentsState,
  GetRasiedInvoiceListState,
  PostEstimateToTaxInvoiceState,
  PostInvoiceVersionState,
  retryEInvoice,
} from '../../../Store/Reducers/Invoice/InvoiceState';
import {
  GetInvoiceDashboard,
  GetInvoiceDashboardForCustomer,
  GetInvoiceDraft,
  GetInvoiceOrgLocation,
  GetInvoiceCustomerLocation,
  GetInvoiceItems,
  PostCreateInvoiceItems,
  PatchUpdateInvoiceItems,
  GetInvoiceCurrency,
  GetInvoiceBankData,
  GetInvoiceSalesPerson,
  PostInvoiceCreateNew,
  PatchInvoiceUpdate,
  GetInvoiceById,
  PostCustomerLocation,
  PostGenerateNewInvoice,
  PatchUpdateRecurringInvoice,
  DeleteRecurringInvoice,
  GetFetchLineItems,
  PostCreateLineItems,
  PatchUpdateLineItems,
  DeleteLineItems,
  GetInvoiceUnapproved,
  GetInvoiceApproved,
  GetInvoiceRecurring,
  GetRecurringInvoiceById,
  GetRecurringInvoiceHistoryById,
  PostRecurringInvoiceFileUpload,
  PostInvoiceBulkUpload,
  GetStatusInvoiceBulkUpload,
  GetInvoiceCustomFields,
  DeleteDraftInvoice,
  PostCancelApprovedInvoice,
  PostDeclineUnApprovedInvoice,
  PostApproveUnApprovedInvoice,
  GetSingleItemsDetails,
  GetItemsProductsList,
  GetItemsServicesList,
  GetInvoiceDeliverEmailTemplate,
  GetInvoiceDeliverContactList,
  PostInvoiceDeliverToCustomer,
  PostInvoiceDeliverNewContact,
  GetInvoiceUnsettledPayments,
  GetRasiedInvoiceList,
  PostEstimateToTaxInvoice,
  PostInvoiceVersion,
  RetryEInvoiceDetail,
} from './InvoiceWorkers';

export function* GetInvoiceDashboardList() {
  yield takeLatest(GetInvoiceDashboardState.type, GetInvoiceDashboard);
}

export function* GetInvoiceDashboardForCustomerList() {
  yield takeLatest(
    GetInvoiceDashboardStateForCustomer.type,
    GetInvoiceDashboardForCustomer
  );
}

export function* GetInvoiceDraftList() {
  yield takeLatest(GetInvoiceDraftState.type, GetInvoiceDraft);
}

export function* GetInvoiceOrgLocationList() {
  yield takeLatest(GetInvoiceOrgLocationState.type, GetInvoiceOrgLocation);
}

export function* GetInvoiceCustomerLocationList() {
  yield takeLatest(
    GetInvoiceCustomerLocationState.type,
    GetInvoiceCustomerLocation
  );
}

export function* GetInvoiceItemsList() {
  yield takeLatest(GetInvoiceItemsState.type, GetInvoiceItems);
}

export function* PostCreateInvoiceItemsCall() {
  yield takeLatest(PostCreateInvoiceItemsState.type, PostCreateInvoiceItems);
}

export function* PatchUpdateInvoiceItemsCall() {
  yield takeLatest(PatchUpdateInvoiceItemsState.type, PatchUpdateInvoiceItems);
}

export function* GetInvoiceCurrencyList() {
  yield takeLatest(GetInvoiceCurrencyState.type, GetInvoiceCurrency);
}

export function* GetInvoiceBankDataList() {
  yield takeLatest(GetInvoiceBankDataState.type, GetInvoiceBankData);
}

export function* GetInvoiceSalesPersonList() {
  yield takeLatest(GetInvoiceSalesPersonState.type, GetInvoiceSalesPerson);
}

export function* PostInvoiceCreateNewCall() {
  yield takeLatest(PostInvoiceCreateNewState.type, PostInvoiceCreateNew);
}

export function* PatchInvoiceUpdateCall() {
  yield takeLatest(PatchInvoiceUpdateState.type, PatchInvoiceUpdate);
}

export function* GetInvoiceByIdCall() {
  yield takeLatest(GetInvoiceByIdState.type, GetInvoiceById);
}

export function* PostCustomerLocationCall() {
  yield takeLatest(PostCustomerLocationState.type, PostCustomerLocation);
}

export function* PostGenerateNewInvoiceStateCall() {
  yield takeLatest(PostGenerateNewInvoiceState.type, PostGenerateNewInvoice);
}

export function* PatchUpdateRecurringInvoiceCall() {
  yield takeLatest(
    PatchUpdateRecurringInvoiceState.type,
    PatchUpdateRecurringInvoice
  );
}
export function* DeleteRecurringInvoiceCall() {
  yield takeLatest(DeleteRecurringInvoiceState.type, DeleteRecurringInvoice);
}

export function* GetFetchLineItemsCall() {
  yield takeLatest(GetFetchLineItemsState.type, GetFetchLineItems);
}

export function* PostCreateLineItemsCall() {
  yield takeLatest(PostCreateLineItemsState.type, PostCreateLineItems);
}

export function* PatchUpdateLineItemsCall() {
  yield takeLatest(PatchUpdateLineItemsState.type, PatchUpdateLineItems);
}

export function* DeleteLineItemsCall() {
  yield takeLatest(DeleteLineItemsState.type, DeleteLineItems);
}

export function* GetInvoiceUnapprovedCall() {
  yield takeLatest(GetInvoiceUnapprovedState.type, GetInvoiceUnapproved);
}

export function* GetInvoiceApprovedCall() {
  yield takeLatest(GetInvoiceApprovedState.type, GetInvoiceApproved);
}

export function* GetInvoiceRecurringCall() {
  yield takeLatest(GetInvoiceRecurringState.type, GetInvoiceRecurring);
}

export function* GetRecurringInvoiceByIdCall() {
  yield takeLatest(GetRecurringInvoiceByIdState.type, GetRecurringInvoiceById);
}

export function* GetRecurringInvoiceHistoryByIdCall() {
  yield takeLatest(
    GetRecurringInvoiceHistoryByIdState.type,
    GetRecurringInvoiceHistoryById
  );
}

export function* PostRecurringInvoiceFileUploadCall() {
  yield takeLatest(
    PostRecurringInvoiceFileUploadState.type,
    PostRecurringInvoiceFileUpload
  );
}

export function* PostInvoiceBulkUploadCall() {
  yield takeLatest(PostInvoiceBulkUploadState.type, PostInvoiceBulkUpload);
}

export function* GetStatusInvoiceBulkUploadCall() {
  yield takeLatest(
    GetStatusInvoiceBulkUploadState.type,
    GetStatusInvoiceBulkUpload
  );
}

export function* GetInvoiceCustomFieldsCall() {
  yield takeLatest(GetInvoiceCustomFieldsState.type, GetInvoiceCustomFields);
}

export function* DeleteDraftInvoiceCall() {
  yield takeLatest(DeleteDraftInvoiceState.type, DeleteDraftInvoice);
}

export function* PostCancelApprovedInvoiceCall() {
  yield takeLatest(
    PostCancelApprovedInvoiceState.type,
    PostCancelApprovedInvoice
  );
}

export function* PostDeclineUnApprovedInvoiceCall() {
  yield takeLatest(
    PostDeclineUnApprovedInvoiceState.type,
    PostDeclineUnApprovedInvoice
  );
}

export function* PostApproveUnApprovedInvoiceCall() {
  yield takeLatest(
    PostApproveUnApprovedInvoiceState.type,
    PostApproveUnApprovedInvoice
  );
}

export function* GetSingleItemsDetailsCall() {
  yield takeLatest(GetSingleItemsDetailsState.type, GetSingleItemsDetails);
}

export function* GetItemsProductsListCall() {
  yield takeLatest(GetItemsProductsListState.type, GetItemsProductsList);
}

export function* GetItemsServicesListCall() {
  yield takeLatest(GetItemsServicesListState.type, GetItemsServicesList);
}

export function* GetInvoiceDeliverEmailTemplateCall() {
  yield takeLatest(
    GetInvoiceDeliverEmailTemplateState.type,
    GetInvoiceDeliverEmailTemplate
  );
}

export function* GetInvoiceDeliverContactListCall() {
  yield takeLatest(
    GetInvoiceDeliverContactListState.type,
    GetInvoiceDeliverContactList
  );
}

export function* PostInvoiceDeliverToCustomerCall() {
  yield takeLatest(
    PostInvoiceDeliverToCustomerState.type,
    PostInvoiceDeliverToCustomer
  );
}

export function* PostInvoiceDeliverNewContactCall() {
  yield takeLatest(
    PostInvoiceDeliverNewContactState.type,
    PostInvoiceDeliverNewContact
  );
}

export function* GetInvoiceUnsettledPaymentsCall() {
  yield takeLatest(
    GetInvoiceUnsettledPaymentsState.type,
    GetInvoiceUnsettledPayments
  );
}

export function* GetRasiedInvoiceListStateCall() {
  yield takeLatest(GetRasiedInvoiceListState.type, GetRasiedInvoiceList);
}

export function* PostEstimateToTaxInvoiceCall() {
  yield takeLatest(
    PostEstimateToTaxInvoiceState.type,
    PostEstimateToTaxInvoice
  );
}

export function* PostInvoiceVersionCall() {
  yield takeLatest(PostInvoiceVersionState.type, PostInvoiceVersion);
}
export function* RetryEInvoice() {
  yield takeLatest(retryEInvoice.type, RetryEInvoiceDetail);
}
