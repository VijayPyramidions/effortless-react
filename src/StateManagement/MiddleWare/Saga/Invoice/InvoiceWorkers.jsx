import { call, put } from 'redux-saga/effects';
import { MESSAGE_TYPE } from '@components/SnackBarContainer/SnackBarContainer';

import {
  SetStateInvoiceDashboard,
  SetStateInvoiceDashboardForCustomer,
  SetStateInvoiceDraft,
  SetStateInvoiceOrgLocation,
  SetStateInvoiceCustomerLocation,
  SetStateInvoiceItems,
  SetStateModifyInvoiceItems,
  SetStateInvoiceCurrencyState,
  SetStateInvoiceBankData,
  SetStateInvoiceSalesPerson,
  SetStateInvoiceCreateNew,
  SetStateInvoiceUpdate,
  SetStateInvoiceById,
  SetStateCustomerLocation,
  SetStateGenerateNewInvoice,
  SetStateUpdateRecurringInvoice,
  SetStateFetchLineItems,
  GetFetchLineItemsState,
  GetInvoiceItemsState,
  SetStateInvoiceUnapproved,
  SetStateInvoiceApproved,
  SetStateInvoiceRecurring,
  SetStateRecurringInvoiceById,
  SetStateRecurringInvoiceHistoryById,
  GetRecurringInvoiceByIdState,
  SetStateInvoiceBulkUpload,
  SetStateStatusInvoiceBulkUpload,
  SetStateInvoiceCustomFields,
  SetStateDeclineUnApprovedInvoice,
  SetStateApproveUnApprovedInvoice,
  SetStateCancelApprovedInvoice,
  SetStateDeleteDraftInvoice,
  SetStateSingleItemsDetails,
  SetStateHSNItemsList,
  SetStateSACItemsList,
  SetStateInvoiceDeliverEmailTemplate,
  SetStateInvoiceDeliverContactList,
  SetStateInvoiceDeliverAction,
  SetStateInvoiceUnsettledPayments,
  SetStateRasiedInvoiceList,
  SetStateGeneratePdfAction,
  ClearStateInvoiceDraft,
  ClearStateInvoiceApproved,
} from '../../../Store/Reducers/Invoice/InvoiceState';
import {
  openSnackbar,
  enableLoading,
} from '../../../Store/Reducers/Errors/Errors';

import {
  GetInvoiceDashboard_API,
  GetInvoiceDashboardForCustomer_API,
  GetInvoiceDraft_API,
  GetInvoiceOrgLocation_API,
  GetInvoiceCustomerLocation_API,
  GetInvoiceItems_API,
  PostCreateInvoiceItems_API,
  PatchUpdateInvoiceItems_API,
  GetInvoiceCurrency_API,
  GetInvoiceBankData_API,
  GetInvoiceSalesPerson_API,
  PostInvoiceCreateNew_API,
  PatchInvoiceUpdate_API,
  GetInvoiceById_API,
  PostCustomerLocation_API,
  PostGenerateNewInvoice_API,
  DeleteInvoice_API,
  GetFetchLineItems_API,
  PostCreateLineItems_API,
  PatchUpdateLineItems_API,
  DeleteLineItems_API,
  GetInvoiceUnapproved_API,
  GetInvoiceApproved_API,
  GetInvoiceRecurring_API,
  GetRecurringInvoiceHistoryById_API,
  PostRecurringInvoiceFileUpload_API,
  PostInvoiceBulkUpload_API,
  GetStatusInvoiceBulkUpload_API,
  GetInvoiceCustomFields_API,
  PostCancelApprovedInvoice_API,
  PostDeclineUnApprovedInvoice_API,
  PostApproveUnApprovedInvoice_API,
  GetSingleItemsDetails_API,
  GetItemsProductsList_API,
  GetItemsServicesList_API,
  GetInvoiceDeliverEmailTemplate_API,
  GetInvoiceDeliverContactList_API,
  PostInvoiceDeliverToCustomer_API,
  PostInvoiceDeliverNewContact_API,
  GetInvoiceUnsettledPayments_API,
  GetRasiedInvoiceList_API,
  PostEstimateToTaxInvoice_API,
  PostInvoiceVersion_API,
  RetryEInvoiceDetail_Api,
} from '../../API/Invoice/InvoiceApi';

export function* GetInvoiceDashboard({ payload }) {
  try {
    const res = yield call(GetInvoiceDashboard_API, payload);
    if (res.status === 200) {
      yield put(SetStateInvoiceDashboard(res.data));
    } else {
      yield put(
        openSnackbar({
          message: res?.data?.message || 'try again',
          type: MESSAGE_TYPE.ERROR,
        })
      );
    }
  } catch (e) {
    console.log(`GetInvoiceDashboard :  ${e}`);
  }
}

export function* GetInvoiceDashboardForCustomer({ payload }) {
  try {
    yield put(enableLoading(true));
    const res = yield call(GetInvoiceDashboardForCustomer_API, payload);
    if (res.status === 200) {
      yield put(SetStateInvoiceDashboardForCustomer(res.data));
    } else {
      yield put(
        openSnackbar({
          message: res?.data?.message || 'try again',
          type: MESSAGE_TYPE.ERROR,
        })
      );
    }
    yield put(enableLoading(false));
  } catch (e) {
    console.log(`GetInvoiceDashboardForCustomer :  ${e}`);
    yield put(enableLoading(false));
  }
}

export function* GetInvoiceDraft({ payload }) {
  try {
    if (
      payload?.filterCustomer ||
      payload?.order ||
      payload?.orderBy ||
      payload?.fromDate ||
      payload?.toDate
    ) {
      yield put(enableLoading(true));
    }
    const res = yield call(GetInvoiceDraft_API, payload);
    if (res.status === 200) {
      if (window.location.pathname === '/invoice-draft') {
        yield put(SetStateInvoiceDraft(res.data));
      } else {
        yield put(ClearStateInvoiceDraft());
      }
    } else {
      yield put(
        openSnackbar({
          message: res?.data?.message || 'try again',
          type: MESSAGE_TYPE.ERROR,
        })
      );
    }
    yield put(enableLoading(false));
  } catch (e) {
    console.log(`GetInvoiceDraft :  ${e}`);
    yield put(SetStateInvoiceDraft({}));
    yield put(enableLoading(false));
  }
}

export function* GetInvoiceOrgLocation({ payload }) {
  try {
    const res = yield call(GetInvoiceOrgLocation_API, payload);
    if (res.status === 200) {
      yield put(SetStateInvoiceOrgLocation(res.data));
    } else {
      yield put(
        openSnackbar({
          message: res?.data?.message || 'try again',
          type: MESSAGE_TYPE.ERROR,
        })
      );
    }
  } catch (e) {
    console.log(`GetInvoiceOrgLocation :  ${e}`);
  }
}

export function* GetInvoiceCustomerLocation({ payload }) {
  try {
    const res = yield call(GetInvoiceCustomerLocation_API, payload);
    if (res.status === 200) {
      yield put(SetStateInvoiceCustomerLocation(res.data));
    } else {
      yield put(
        openSnackbar({
          message: res?.data?.message || 'try again',
          type: MESSAGE_TYPE.ERROR,
        })
      );
    }
  } catch (e) {
    console.log(`GetInvoiceCustomerLocation :  ${e}`);
  }
}

export function* GetInvoiceItems({ payload }) {
  try {
    const res = yield call(GetInvoiceItems_API, payload);
    if (res.status === 200) {
      yield put(SetStateInvoiceItems(res.data));
    } else {
      yield put(
        openSnackbar({
          message: res?.data?.message || 'try again',
          type: MESSAGE_TYPE.ERROR,
        })
      );
    }
  } catch (e) {
    console.log(`GetInvoiceItems :  ${e}`);
  }
}

export function* PostCreateInvoiceItems({ payload }) {
  try {
    yield put(enableLoading(true));
    const res = yield call(PostCreateInvoiceItems_API, payload);
    if (res.status === 200) {
      yield put(
        openSnackbar({
          message: `${payload?.invoiceItemCreateParam?.name} - ${payload?.invoiceItemCreateParam?.item_type} created successfully.`,
          type: MESSAGE_TYPE.INFO,
        })
      );
      yield put(
        SetStateModifyInvoiceItems({ res: res?.data, from: payload?.from })
      );
      yield put(GetInvoiceItemsState({ customerId: payload?.customerId }));
    } else {
      yield put(
        openSnackbar({
          message: res?.data?.message || 'try again',
          type: MESSAGE_TYPE.ERROR,
        })
      );
    }
    yield put(enableLoading(false));
  } catch (e) {
    console.log(`PostCreateInvoiceItems :  ${e}`);
    yield put(enableLoading(false));
  }
}

export function* PatchUpdateInvoiceItems({ payload }) {
  try {
    yield put(enableLoading(true));
    const res = yield call(PatchUpdateInvoiceItems_API, payload);
    if (res.status === 200) {
      yield put(
        openSnackbar({
          message: `${payload?.invoiceItemUpdateParam?.name} - ${payload?.invoiceItemUpdateParam?.item_type} edited successfully.`,
          type: MESSAGE_TYPE.INFO,
        })
      );
      yield put(
        SetStateModifyInvoiceItems({ res: res?.data, from: payload?.from })
      );
      yield put(GetInvoiceItemsState({ customerId: payload?.customerId }));
    } else {
      yield put(
        openSnackbar({
          message: res?.data?.message || 'try again',
          type: MESSAGE_TYPE.ERROR,
        })
      );
    }
    yield put(enableLoading(false));
  } catch (e) {
    console.log(`PatchUpdateInvoiceItems :  ${e}`);
    yield put(enableLoading(false));
  }
}

export function* GetInvoiceCurrency({ payload }) {
  try {
    const res = yield call(GetInvoiceCurrency_API, payload);
    if (res.status === 200) {
      yield put(SetStateInvoiceCurrencyState(res.data));
    } else {
      yield put(
        openSnackbar({
          message: res?.data?.message || 'try again',
          type: MESSAGE_TYPE.ERROR,
        })
      );
    }
  } catch (e) {
    console.log(`GetInvoiceCurrency :  ${e}`);
  }
}

export function* GetInvoiceBankData({ payload }) {
  try {
    const res = yield call(GetInvoiceBankData_API, payload);
    if (res.status === 200) {
      yield put(SetStateInvoiceBankData(res.data));
    } else {
      yield put(
        openSnackbar({
          message: res?.data?.message || 'try again',
          type: MESSAGE_TYPE.ERROR,
        })
      );
    }
  } catch (e) {
    console.log(`GetInvoiceBankData :  ${e}`);
  }
}

export function* GetInvoiceSalesPerson({ payload }) {
  try {
    const res = yield call(GetInvoiceSalesPerson_API, payload);
    if (res.status === 200) {
      yield put(SetStateInvoiceSalesPerson(res.data));
    } else {
      yield put(
        openSnackbar({
          message: res?.data?.message || 'try again',
          type: MESSAGE_TYPE.ERROR,
        })
      );
    }
  } catch (e) {
    console.log(`GetInvoiceSalesPerson :  ${e}`);
  }
}

export function* PostInvoiceCreateNew({ payload }) {
  try {
    if (payload?.activeInvoiceSubject === 'customer_agreements') {
      yield put(enableLoading(true));
    }
    const res = yield call(PostInvoiceCreateNew_API, payload);
    if (res.status === 200) {
      if (
        payload?.activeInvoiceSubject === 'customer_agreements' &&
        payload?.from === 'pdfPage'
      ) {
        yield put(
          openSnackbar({
            message: 'Your Contract has been created Successfully',
            type: MESSAGE_TYPE.INFO,
          })
        );
        yield put(SetStateGeneratePdfAction({ newRecurringInvoice: res.data }));
      } else {
        yield put(SetStateInvoiceCreateNew(res.data));
      }
    } else {
      yield put(
        openSnackbar({
          message: res?.data?.message || 'try again',
          type: MESSAGE_TYPE.ERROR,
        })
      );
    }
    yield put(enableLoading(false));
  } catch (e) {
    console.log(`PostInvoiceCreateNew :  ${e}`);
    yield put(enableLoading(false));
  }
}

export function* PatchInvoiceUpdate({ payload }) {
  try {
    yield put(enableLoading(true));
    const res = yield call(PatchInvoiceUpdate_API, payload);
    if (res.status === 200) {
      yield put(SetStateInvoiceUpdate(res.data));
    } else {
      yield put(
        openSnackbar({
          message: res?.data?.message || 'try again',
          type: MESSAGE_TYPE.ERROR,
        })
      );
    }
    yield put(enableLoading(false));
  } catch (e) {
    console.log(`PatchInvoiceUpdate :  ${e}`);
    yield put(enableLoading(false));
  }
}

export function* GetInvoiceById({ payload }) {
  try {
    if (payload?.from === 'pdfPage') {
      yield put(enableLoading(false));
    } else {
      yield put(enableLoading(true));
    }
    const res = yield call(GetInvoiceById_API, payload);
    if (res.status === 200) {
      yield put(SetStateInvoiceById(res.data));
    } else {
      yield put(
        openSnackbar({
          message: res?.data?.message || 'try again',
          type: MESSAGE_TYPE.ERROR,
        })
      );
    }
    yield put(enableLoading(false));
  } catch (e) {
    console.log(`GetInvoiceById :  ${e}`);
    yield put(enableLoading(false));
  }
}

export function* PostCustomerLocation({ payload }) {
  try {
    yield put(enableLoading(true));
    const res = yield call(PostCustomerLocation_API, payload);
    if (res.status === 200) {
      yield put(SetStateCustomerLocation(res.data));
    } else {
      yield put(
        openSnackbar({
          message: res?.data?.message || 'try again',
          type: MESSAGE_TYPE.ERROR,
        })
      );
    }
    yield put(enableLoading(false));
  } catch (e) {
    console.log(`PostCustomerLocation :  ${e}`);
    yield put(enableLoading(false));
  }
}

export function* PostGenerateNewInvoice({ payload }) {
  try {
    yield put(enableLoading(true));
    const res = yield call(PostGenerateNewInvoice_API, payload);
    if (res.status === 200) {
      yield put(SetStateGenerateNewInvoice(res.data));
    } else {
      yield put(
        openSnackbar({
          message: res?.data?.message || 'try again',
          type: MESSAGE_TYPE.ERROR,
        })
      );
    }
    yield put(enableLoading(false));
  } catch (e) {
    console.log(`PostGenerateNewInvoice :  ${e}`);
    yield put(enableLoading(false));
  }
}

export function* PatchUpdateRecurringInvoice({ payload }) {
  try {
    yield put(enableLoading(true));
    const res = yield call(PatchInvoiceUpdate_API, payload);
    if (res.status === 200) {
      yield put(SetStateUpdateRecurringInvoice(res.data));
      yield put(
        openSnackbar({
          message: 'Updated Successfully',
          type: MESSAGE_TYPE.INFO,
        })
      );
    } else {
      yield put(
        openSnackbar({
          message: res?.data?.message || 'try again',
          type: MESSAGE_TYPE.ERROR,
        })
      );
    }
    yield put(enableLoading(false));
  } catch (e) {
    console.log(`PatchUpdateRecurringInvoice :  ${e}`);
    yield put(enableLoading(false));
  }
}

export function* DeleteRecurringInvoice({ payload }) {
  try {
    yield put(enableLoading(true));
    const res = yield call(DeleteInvoice_API, payload);
    if (res.status === 200) {
      yield put(SetStateUpdateRecurringInvoice(res.data));
      yield put(
        openSnackbar({
          message: 'Cancelled Successfully',
          type: MESSAGE_TYPE.INFO,
        })
      );
    } else {
      yield put(
        openSnackbar({
          message: res?.data?.message || 'try again',
          type: MESSAGE_TYPE.ERROR,
        })
      );
    }
    yield put(enableLoading(false));
  } catch (e) {
    console.log(`DeleteRecurringInvoice :  ${e}`);
    yield put(enableLoading(false));
  }
}

export function* GetFetchLineItems({ payload }) {
  try {
    // yield put(enableLoading(true));
    const res = yield call(GetFetchLineItems_API, payload);
    if (res.status === 200) {
      yield put(SetStateFetchLineItems(res.data));
    } else {
      yield put(
        openSnackbar({
          message: res?.data?.message || 'try again',
          type: MESSAGE_TYPE.ERROR,
        })
      );
    }
    yield put(enableLoading(false));
  } catch (e) {
    console.log(`GetFetchLineItems :  ${e}`);
    yield put(enableLoading(false));
  }
}

export function* PostCreateLineItems({ payload }) {
  try {
    yield put(enableLoading(true));
    const res = yield call(PostCreateLineItems_API, payload);
    if (res.status === 200) {
      yield put(GetFetchLineItemsState(payload));
    } else {
      yield put(
        openSnackbar({
          message: res?.data?.message || 'try again',
          type: MESSAGE_TYPE.ERROR,
        })
      );
    }
    yield put(enableLoading(false));
  } catch (e) {
    console.log(`PostCreateLineItems :  ${e}`);
    yield put(enableLoading(false));
  }
}

export function* PatchUpdateLineItems({ payload }) {
  try {
    yield put(enableLoading(true));
    const res = yield call(PatchUpdateLineItems_API, payload);
    if (res.status === 200) {
      yield put(
        openSnackbar({
          message: 'Updated Successfully',
          type: MESSAGE_TYPE.INFO,
        })
      );
      yield put(GetFetchLineItemsState(payload));
    } else {
      yield put(
        openSnackbar({
          message: res?.data?.message || 'try again',
          type: MESSAGE_TYPE.ERROR,
        })
      );
    }
    yield put(enableLoading(false));
  } catch (e) {
    console.log(`PatchUpdateLineItems :  ${e}`);
    yield put(enableLoading(false));
  }
}

export function* DeleteLineItems({ payload }) {
  try {
    yield put(enableLoading(true));
    const res = yield call(DeleteLineItems_API, payload);
    if (res.status === 200) {
      yield put(
        openSnackbar({
          message: 'Deleted Successfully',
          type: MESSAGE_TYPE.INFO,
        })
      );
      yield put(GetFetchLineItemsState(payload));
    } else {
      yield put(
        openSnackbar({
          message: res?.data?.message || 'try again',
          type: MESSAGE_TYPE.ERROR,
        })
      );
    }
    yield put(enableLoading(false));
  } catch (e) {
    console.log(`DeleteLineItems :  ${e}`);
    yield put(enableLoading(false));
  }
}

export function* GetInvoiceUnapproved({ payload }) {
  try {
    if (
      payload?.filterCustomer ||
      payload?.order ||
      payload?.orderBy ||
      payload?.fromDate ||
      payload?.toDate
    ) {
      yield put(enableLoading(true));
    }
    const res = yield call(GetInvoiceUnapproved_API, payload);
    if (res.status === 200) {
      yield put(SetStateInvoiceUnapproved(res.data));
    } else {
      yield put(
        openSnackbar({
          message: res?.data?.message || 'try again',
          type: MESSAGE_TYPE.ERROR,
        })
      );
    }
    yield put(enableLoading(false));
  } catch (e) {
    console.log(`GetInvoiceUnapproved :  ${e}`);
    yield put(SetStateInvoiceUnapproved({}));
    yield put(enableLoading(false));
  }
}

export function* GetInvoiceApproved({ payload }) {
  try {
    if (
      payload?.filterCustomer ||
      payload?.order ||
      payload?.orderBy ||
      payload?.fromDate ||
      payload?.toDate ||
      payload?.typeFilter ||
      payload?.statusFilter
    ) {
      yield put(enableLoading(true));
    }
    const res = yield call(GetInvoiceApproved_API, payload);
    if (res.status === 200) {
      if (window.location.pathname === '/invoice-approved') {
        yield put(SetStateInvoiceApproved(res.data));
      } else {
        yield put(ClearStateInvoiceApproved());
      }
    } else {
      yield put(
        openSnackbar({
          message: res?.data?.message || 'try again',
          type: MESSAGE_TYPE.ERROR,
        })
      );
    }
    yield put(enableLoading(false));
  } catch (e) {
    console.log(`GetInvoiceApproved :  ${e}`);
    yield put(SetStateInvoiceApproved({}));
    yield put(enableLoading(false));
  }
}

export function* GetInvoiceRecurring({ payload }) {
  try {
    const res = yield call(GetInvoiceRecurring_API, payload);
    if (res.status === 200) {
      yield put(SetStateInvoiceRecurring(res.data));
    } else {
      yield put(
        openSnackbar({
          message: res?.data?.message || 'try again',
          type: MESSAGE_TYPE.ERROR,
        })
      );
    }
  } catch (e) {
    console.log(`GetInvoiceRecurring :  ${e}`);
    yield put(SetStateInvoiceRecurring({}));
  }
}

export function* GetRecurringInvoiceById({ payload }) {
  try {
    yield put(enableLoading(true));
    const res = yield call(GetInvoiceById_API, payload);
    if (res.status === 200) {
      yield put(SetStateRecurringInvoiceById(res.data));
    } else {
      yield put(
        openSnackbar({
          message: res?.data?.message || 'try again',
          type: MESSAGE_TYPE.ERROR,
        })
      );
    }
    yield put(enableLoading(false));
  } catch (e) {
    console.log(`GetRecurringInvoiceById :  ${e}`);
    yield put(enableLoading(false));
  }
}

export function* GetRecurringInvoiceHistoryById({ payload }) {
  try {
    yield put(enableLoading(true));
    const res = yield call(GetRecurringInvoiceHistoryById_API, payload);
    if (res.status === 200) {
      yield put(SetStateRecurringInvoiceHistoryById(res.data));
    } else {
      yield put(
        openSnackbar({
          message: res?.data?.message || 'try again',
          type: MESSAGE_TYPE.ERROR,
        })
      );
    }
    yield put(enableLoading(false));
  } catch (e) {
    console.log(`GetRecurringInvoiceHistoryById :  ${e}`);
    yield put(enableLoading(false));
  }
}

export function* PostRecurringInvoiceFileUpload({ payload }) {
  try {
    yield put(enableLoading(true));
    const res = yield call(PostRecurringInvoiceFileUpload_API, payload);
    if (res.status === 200) {
      yield put(GetRecurringInvoiceByIdState(payload));
      yield put(
        openSnackbar({ message: res?.data?.status, type: MESSAGE_TYPE.INFO })
      );
    } else {
      yield put(
        openSnackbar({
          message: res?.data?.message || 'try again',
          type: MESSAGE_TYPE.ERROR,
        })
      );
    }
    yield put(enableLoading(false));
  } catch (e) {
    console.log(`PostRecurringInvoiceFileUpload :  ${e}`);
    yield put(enableLoading(false));
  }
}

export function* PostInvoiceBulkUpload({ payload }) {
  try {
    yield put(enableLoading(true));
    const res = yield call(PostInvoiceBulkUpload_API, payload);
    if (res.status === 200) {
      yield put(SetStateInvoiceBulkUpload(res.data));
    } else {
      yield put(
        openSnackbar({
          message: res?.data?.message || 'try again',
          type: MESSAGE_TYPE.ERROR,
        })
      );
    }
    yield put(enableLoading(false));
  } catch (e) {
    console.log(`PostInvoiceBulkUpload :  ${e}`);
    yield put(enableLoading(false));
  }
}

export function* GetStatusInvoiceBulkUpload({ payload }) {
  try {
    yield put(enableLoading(true));
    const res = yield call(GetStatusInvoiceBulkUpload_API, payload);
    if (res.status === 200) {
      yield put(SetStateStatusInvoiceBulkUpload(res.data));
    } else {
      yield put(
        openSnackbar({
          message: res?.data?.message || 'try again',
          type: MESSAGE_TYPE.ERROR,
        })
      );
    }
    yield put(enableLoading(false));
  } catch (e) {
    console.log(`GetStatusInvoiceBulkUpload :  ${e}`);
    yield put(enableLoading(false));
  }
}

export function* GetInvoiceCustomFields() {
  try {
    const res = yield call(GetInvoiceCustomFields_API);
    if (res.status === 200) {
      yield put(SetStateInvoiceCustomFields(res.data));
    } else {
      yield put(
        openSnackbar({
          message: res?.data?.message || 'try again',
          type: MESSAGE_TYPE.ERROR,
        })
      );
    }
  } catch (e) {
    console.log(`GetInvoiceCustomFields :  ${e}`);
  }
}

export function* DeleteDraftInvoice({ payload }) {
  try {
    yield put(enableLoading(true));
    const res = yield call(DeleteInvoice_API, payload);
    if (res.status === 200) {
      yield put(
        openSnackbar({
          message: `${payload?.documentType}`,
          type: MESSAGE_TYPE.INFO,
        })
      );
      yield put(SetStateDeleteDraftInvoice(res.data));
    } else {
      yield put(
        openSnackbar({
          message: res?.data?.message || 'try again',
          type: MESSAGE_TYPE.ERROR,
        })
      );
    }
    yield put(enableLoading(false));
  } catch (e) {
    console.log(`DeleteDraftInvoice :  ${e}`);
    yield put(enableLoading(false));
  }
}

export function* PostCancelApprovedInvoice({ payload }) {
  try {
    yield put(enableLoading(true));
    const res = yield call(PostCancelApprovedInvoice_API, payload);
    if (res.status === 200) {
      yield put(
        openSnackbar({
          message: `${payload?.documentType}`,
          type: MESSAGE_TYPE.INFO,
        })
      );
      yield put(SetStateCancelApprovedInvoice(res?.data));
    } else {
      yield put(
        openSnackbar({
          message: res?.data?.message || 'try again',
          type: MESSAGE_TYPE.ERROR,
        })
      );
    }
    yield put(enableLoading(false));
  } catch (e) {
    console.log(`PostCancelApprovedInvoice :  ${e}`);
    yield put(enableLoading(false));
  }
}

export function* PostDeclineUnApprovedInvoice({ payload }) {
  try {
    yield put(enableLoading(true));
    const res = yield call(PostDeclineUnApprovedInvoice_API, payload);
    if (res.status === 200) {
      if (res?.data?.message === 'Invoice not found') {
        yield put(
          openSnackbar({
            message: res?.data?.message,
            type: MESSAGE_TYPE.ERROR,
          })
        );
      } else if (!payload?.reason) {
        yield put(
          openSnackbar({
            message: res?.data?.message || 'Invoice has been Declined',
            type: MESSAGE_TYPE.INFO,
          })
        );
      }
      yield put(
        SetStateDeclineUnApprovedInvoice({
          ...res.data,
          declineReason: payload?.reason,
        })
      );
    } else {
      yield put(
        openSnackbar({
          message: res?.data?.message || 'try again',
          type: MESSAGE_TYPE.ERROR,
        })
      );
    }
    yield put(enableLoading(false));
  } catch (e) {
    console.log(`PostDeclineUnApprovedInvoice :  ${e}`);
    yield put(enableLoading(false));
  }
}

export function* PostApproveUnApprovedInvoice({ payload }) {
  try {
    yield put(enableLoading(true));
    const res = yield call(PostApproveUnApprovedInvoice_API, payload);
    if (res.status === 200) {
      yield put(SetStateApproveUnApprovedInvoice(res.data));
    } else {
      yield put(
        openSnackbar({
          message: res?.data?.message || 'try again',
          type: MESSAGE_TYPE.ERROR,
        })
      );
    }
    yield put(enableLoading(false));
  } catch (e) {
    console.log(`PostApproveUnApprovedInvoice :  ${e}`);
    yield put(enableLoading(false));
  }
}

export function* GetSingleItemsDetails({ payload }) {
  try {
    yield put(enableLoading(true));
    const res = yield call(GetSingleItemsDetails_API, payload);
    if (res.status === 200) {
      yield put(SetStateSingleItemsDetails(res.data));
    } else {
      yield put(
        openSnackbar({
          message: res?.data?.message || 'try again',
          type: MESSAGE_TYPE.ERROR,
        })
      );
    }
    yield put(enableLoading(false));
  } catch (e) {
    console.log(`GetSingleItemsDetails :  ${e}`);
    yield put(enableLoading(false));
  }
}

export function* GetItemsProductsList({ payload }) {
  try {
    yield put(enableLoading(true));
    const res = yield call(GetItemsProductsList_API, payload);
    if (res.status === 200) {
      yield put(SetStateHSNItemsList(res.data));
    } else {
      yield put(
        openSnackbar({
          message: res?.data?.message || 'try again',
          type: MESSAGE_TYPE.ERROR,
        })
      );
    }
    yield put(enableLoading(false));
  } catch (e) {
    console.log(`GetItemsProductsList :  ${e}`);
    yield put(enableLoading(false));
  }
}

export function* GetItemsServicesList({ payload }) {
  try {
    yield put(enableLoading(true));
    const res = yield call(GetItemsServicesList_API, payload);
    if (res.status === 200) {
      yield put(SetStateSACItemsList(res.data));
    } else {
      yield put(
        openSnackbar({
          message: res?.data?.message || 'try again',
          type: MESSAGE_TYPE.ERROR,
        })
      );
    }
    yield put(enableLoading(false));
  } catch (e) {
    console.log(`GetItemsServicesList :  ${e}`);
    yield put(enableLoading(false));
  }
}

export function* GetInvoiceDeliverEmailTemplate({ payload }) {
  try {
    yield put(enableLoading(true));
    const res = yield call(GetInvoiceDeliverEmailTemplate_API, payload);
    if (res.status === 200) {
      yield put(SetStateInvoiceDeliverEmailTemplate(res.data));
    } else {
      yield put(
        openSnackbar({
          message: res?.data?.message || 'try again',
          type: MESSAGE_TYPE.ERROR,
        })
      );
    }
    yield put(enableLoading(false));
  } catch (e) {
    console.log(`GetSingleItemsDetails :  ${e}`);
    yield put(enableLoading(false));
  }
}

export function* GetInvoiceDeliverContactList({ payload }) {
  try {
    yield put(enableLoading(true));
    const res = yield call(GetInvoiceDeliverContactList_API, payload);
    if (res.status === 200) {
      yield put(SetStateInvoiceDeliverContactList(res.data));
    } else {
      yield put(
        openSnackbar({
          message: res?.data?.message || 'try again',
          type: MESSAGE_TYPE.ERROR,
        })
      );
    }
    yield put(enableLoading(false));
  } catch (e) {
    console.log(`GetInvoiceDeliverContactList :  ${e}`);
    yield put(enableLoading(false));
  }
}

export function* PostInvoiceDeliverToCustomer({ payload }) {
  try {
    yield put(enableLoading(true));
    const res = yield call(PostInvoiceDeliverToCustomer_API, payload);
    if (res.status >= 200 && res.status <= 300) {
      yield put(
        openSnackbar({
          message: `Your Invoices was delivered to ${
            payload?.name || 'customer'
          }`,
          type: MESSAGE_TYPE.INFO,
        })
      );
      yield put(SetStateInvoiceDeliverAction({ invoiceDeliver: res?.data }));
    } else {
      yield put(
        openSnackbar({
          message: res?.errors
            ? Object.values(res.errors).join()
            : `We were unable to deliver your invoice to  ${
                payload?.name || 'customer'
              }.`,
          type: 'ERRORINVOICE',
        })
      );
    }
    yield put(enableLoading(false));
  } catch (e) {
    console.log(`PostInvoiceDeliverToCustomer :  ${e}`);
    yield put(enableLoading(false));
  }
}

export function* PostInvoiceDeliverNewContact({ payload }) {
  try {
    yield put(enableLoading(true));
    const res = yield call(PostInvoiceDeliverNewContact_API, payload);
    if (res.status === 200) {
      yield put(
        openSnackbar({
          message: `${res?.data?.name || 'customer'} added Successfully`,
          type: MESSAGE_TYPE.INFO,
        })
      );
      yield put(SetStateInvoiceDeliverAction({ newContact: res?.data }));
    } else {
      yield put(
        openSnackbar({
          message: res?.message || 'try again',
          type: MESSAGE_TYPE.ERROR,
        })
      );
    }
    yield put(enableLoading(false));
  } catch (e) {
    console.log(`PostInvoiceDeliverNewContact :  ${e}`);
    yield put(enableLoading(false));
  }
}

export function* GetInvoiceUnsettledPayments({ payload }) {
  try {
    yield put(enableLoading(true));
    const res = yield call(GetInvoiceUnsettledPayments_API, payload);
    if (res.status === 200) {
      yield put(SetStateInvoiceUnsettledPayments(res.data));
    } else {
      yield put(
        openSnackbar({
          message: res?.data?.message || 'try again',
          type: MESSAGE_TYPE.ERROR,
        })
      );
    }
    yield put(enableLoading(false));
  } catch (e) {
    console.log(`GetInvoiceUnsettledPayments :  ${e}`);
    yield put(enableLoading(false));
  }
}

export function* GetRasiedInvoiceList({ payload }) {
  try {
    yield put(enableLoading(true));
    const res = yield call(GetRasiedInvoiceList_API, payload);
    if (res.status === 200) {
      yield put(SetStateRasiedInvoiceList(res.data));
    } else {
      yield put(
        openSnackbar({
          message: res?.data?.message || 'try again',
          type: MESSAGE_TYPE.ERROR,
        })
      );
    }
    yield put(enableLoading(false));
  } catch (e) {
    console.log(`GetRasiedInvoiceList :  ${e}`);
    yield put(enableLoading(false));
  }
}

export function* PostEstimateToTaxInvoice({ payload }) {
  try {
    yield put(enableLoading(true));
    const res = yield call(PostEstimateToTaxInvoice_API, payload);
    if (res.status === 200) {
      yield put(SetStateGeneratePdfAction({ estimateToTaxState: res.data }));
      yield put(
        openSnackbar({
          message: 'Estimate Invoice Converted into Tax Invoice.',
          type: MESSAGE_TYPE.INFO,
        })
      );
    } else {
      yield put(
        openSnackbar({
          message: res?.data?.message || 'try again',
          type: MESSAGE_TYPE.ERROR,
        })
      );
    }
    yield put(enableLoading(false));
  } catch (e) {
    console.log(`PostEstimateToTaxInvoice :  ${e}`);
    yield put(enableLoading(false));
  }
}

export function* PostInvoiceVersion({ payload }) {
  try {
    yield put(enableLoading(true));
    const res = yield call(PostInvoiceVersion_API, payload);
    if (res.status === 200) {
      yield put(SetStateGeneratePdfAction({ invoiceVersionState: res.data }));
      // yield put(openSnackbar({ message: 'Estimate Invoice Converted into Tax Invoice.', type: MESSAGE_TYPE.INFO }));
    } else {
      yield put(
        openSnackbar({
          message: res?.data?.message || 'try again',
          type: MESSAGE_TYPE.ERROR,
        })
      );
    }
    yield put(enableLoading(false));
  } catch (e) {
    console.log(`PostInvoiceVersion :  ${e}`);
    yield put(enableLoading(false));
  }
}
export function* RetryEInvoiceDetail({ payload }) {
  try {
    yield put(enableLoading(true));
    const res = yield call(RetryEInvoiceDetail_Api, payload);
    if (res.status === 200)
      yield put(
        openSnackbar({
          message: res?.data?.message,
          type: MESSAGE_TYPE.INFO,
        })
      );
    else
      yield put(
        openSnackbar({
          message: 'try again',
          type: MESSAGE_TYPE.ERROR,
        })
      );

    yield put(enableLoading(false));
  } catch (e) {
    console.log(`RetryEInvoiceDetail :  ${e}`);
    yield put(enableLoading(false));
  }
}
