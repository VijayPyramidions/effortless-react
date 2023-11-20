import { call, put } from 'redux-saga/effects';
import { MESSAGE_TYPE } from '@components/SnackBarContainer/SnackBarContainer';
import {
  openSnackbar,
  enableLoading,
} from '../../../Store/Reducers/Errors/Errors';

import {
  SetStateGetInvoiceEWayBill,
  SetStateInvoiceToBeGenerated,
  ClearStateInvoiceToBeGenerated,
  SetStateInvoiceGeneratedEWayBills,
  ClearStateInvoiceGeneratedEWayBills,
  SetStateInvoiceUpdateEWayBill,
  SetStateTransportersList,
  SetStateTransporterAction,
  SetStateIndividualInvoiceEWayBill,
  SetStateEWayBillPDFAction,
} from '../../../Store/Reducers/Invoice/InvoiceEWayBillState';

import {
  PostInvoiceEWayBill_API,
  GetInvoiceApproved_API,
  GetInvoiceGeneratedEWayBills_API,
  GetTransportersList_API,
  PatchInvoiceUpdateEWayBill_API,
  PostTransportersCreate_API,
  GetIndividualInvoiceEWayBill_API,
  DeleteInvoiceEWayBillPDF_API,
  PostInvoiceEWayBillNewVehicle_API,
  PatchDeactivateInvoiceEWayBill_API,
} from '../../API/Invoice/InvoiceApi';

export function* GetInvoiceEWayBill({ payload }) {
  try {
    // if (
    // ) {
    //   yield put(enableLoading(true));
    // }
    const res = yield call(GetInvoiceApproved_API, payload);
    if (res.status === 200) {
      if (window.location.pathname === '/invoice-e-waybill') {
        yield put(SetStateInvoiceToBeGenerated(res.data));
      } else {
        yield put(ClearStateInvoiceToBeGenerated());
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
    console.log(`GetInvoiceEWayBill :  ${e}`);
    yield put(SetStateInvoiceToBeGenerated({}));
    yield put(enableLoading(false));
  }
}

export function* GetInvoiceGeneratedEWayBills({ payload }) {
  try {
    const res = yield call(GetInvoiceGeneratedEWayBills_API, payload);
    if (res.status === 200) {
      if (window.location.pathname === '/invoice-e-waybill') {
        yield put(SetStateInvoiceGeneratedEWayBills(res.data));
      } else {
        yield put(ClearStateInvoiceGeneratedEWayBills());
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
    console.log(`GetInvoiceGeneratedEWayBills :  ${e}`);
    yield put(SetStateInvoiceGeneratedEWayBills({}));
    yield put(enableLoading(false));
  }
}
export function* PostInvoiceEWayBill({ payload }) {
  try {
    yield put(enableLoading(true));
    const res = yield call(PostInvoiceEWayBill_API, payload);
    if (res.status === 200) {
      yield put(SetStateGetInvoiceEWayBill(res?.data));
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
    console.log(`PostInvoiceEWayBill :  ${e}`);
    yield put(enableLoading(false));
  }
}

export function* PostTransportersCreate({ payload }) {
  try {
    yield put(enableLoading(true));
    const res = yield call(PostTransportersCreate_API, payload);
    if (res.status === 200) {
      yield put(
        openSnackbar({
          message: res?.data?.message || 'Transporter added successfully',
          type: MESSAGE_TYPE.INFO,
        })
      );
      yield put(SetStateTransporterAction('transporterAdded'));
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
    console.log(`PostTransportersCreate :  ${e}`);
    yield put(enableLoading(false));
  }
}

export function* GetTransportersList({ payload }) {
  try {
    const res = yield call(GetTransportersList_API, payload);
    if (res.status === 200) {
      yield put(SetStateTransportersList(res.data));
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
    console.log(`GetTransportersList :  ${e}`);
    yield put(enableLoading(false));
  }
}

export function* PatchInvoiceUpdateEWayBill({ payload }) {
  try {
    const res = yield call(PatchInvoiceUpdateEWayBill_API, payload);
    if (res.status === 200) {
      yield put(SetStateInvoiceUpdateEWayBill(res.data));
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
    console.log(`PatchInvoiceUpdateEWayBill :  ${e}`);
    yield put(enableLoading(false));
  }
}

export function* GetIndividualInvoiceEWayBill({ payload }) {
  try {
    yield put(enableLoading(true));
    const res = yield call(GetIndividualInvoiceEWayBill_API, payload);
    if (res.status === 200) {
      yield put(SetStateIndividualInvoiceEWayBill(res?.data));
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
    console.log(`GetIndividualInvoiceEWayBill :  ${e}`);
    yield put(enableLoading(false));
  }
}

export function* DeleteInvoiceEWayBillPDF({ payload }) {
  try {
    yield put(enableLoading(true));
    const res = yield call(DeleteInvoiceEWayBillPDF_API, payload);
    if (res.status === 200) {
      yield put(
        openSnackbar({
          message: res?.data?.message || 'E-Way Bill Cancelled successfully',
          type: MESSAGE_TYPE.INFO,
        })
      );
      yield put(SetStateEWayBillPDFAction('e_way_bill_cancelled'));
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
    console.log(`DeleteInvoiceEWayBillPDF :  ${e}`);
    yield put(enableLoading(false));
  }
}

export function* PostInvoiceEWayBillNewVehicle({ payload }) {
  try {
    yield put(enableLoading(true));
    const res = yield call(PostInvoiceEWayBillNewVehicle_API, payload);
    if (res.status === 200) {
      yield put(SetStateGetInvoiceEWayBill(res?.data));
      yield put(
        openSnackbar({
          message: 'E-Way Bill Updated successfully',
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
    console.log(`PostInvoiceEWayBillNewVehicle :  ${e}`);
    yield put(enableLoading(false));
  }
}

export function* PatchDeactivateInvoiceEWayBill({ payload }) {
  try {
    yield put(enableLoading(true));
    const res = yield call(PatchDeactivateInvoiceEWayBill_API, payload);
    if (res.status === 200) {
      yield put(SetStateEWayBillPDFAction('e_way_bill_destroyed'));
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
    console.log(`PatchDeactivateInvoiceEWayBill :  ${e}`);
    yield put(enableLoading(false));
  }
}
