/* eslint-disable array-callback-return */
/* eslint-disable no-plusplus */

import { select, call, put } from 'redux-saga/effects';
import { MESSAGE_TYPE } from '@components/SnackBarContainer/SnackBarContainer';

import {
  unSettledVendorBills,
  setUnSettledVendorBills,
  setVendorBillLoading,
  setVendorDrawer,
  setProceedToPayDrawer,
  setPaymentBankAccounts,
  setPaymentVoucher,
  setVendorBills,
  setSelectedVoucherItems,
  setSelectedBillIds,
  setRefreshResponse,
  setPaymentBankDrawer,
  setRetryPaymentVoucharId,
} from '@action/Store/Reducers/Payments/MakePaymentState';
import {
  openSnackbar,
  enableLoading,
} from '@action/Store/Reducers/Errors/Errors';

import {
  GetUnSettledVendorBills_Api,
  PostPaymentVoucher_Api,
  GetPaymentBankAccounts_Api,
  CreateGetVoucherItems_Api,
  DeleteUpdateVoucherDetail_Api,
  BulkDeleteVouchersDetail_Api,
  RefreshVoucherItemDetail_Api,
  RetryPaymentsMethod_Api,
} from '../../API/Payments/MakePaymentApi';

export function* GetUnSettledVendorBills({ payload }) {
  const storeData = yield select((state) => state.MakePayment);

  try {
    const res = yield call(GetUnSettledVendorBills_Api, payload?.vendorId);
    yield put(enableLoading(false));
    if (res.status === 200) {
      let tempData;
      if (payload?.vendorId) {
        res.data.data.map((a) =>
          Object.assign(a, {
            selected: false,
            paidAmount: Number(a.net_balance),
          })
        );

        const resdata = res.data.data;

        if (storeData.selectedbillids.length > 0) {
          resdata.map((item) =>
            storeData.selectedbillids.map((id) => {
              if (item.id === id) {
                item.selected = true;
              }
              storeData.selectedVoucherItems.map((ele) => {
                if (ele.txn_line_id === item.id) {
                  item.voucher_id = ele.id;
                  item.paidAmount = ele.amount;
                }
              });
            })
          );
        }

        tempData = { data: resdata, vendor: 'yes' };
      } else {
        const list = res?.data?.data.map((item) => {
          return { ...item, selected: false };
        });

        tempData = { data: res.data.data, searchData: list };
      }
      yield put(setUnSettledVendorBills(tempData));
      if (payload?.vendorId) yield put(setVendorDrawer(true));
    } else
      yield put(
        openSnackbar({
          message: res?.data?.message || 'try again',
          type: MESSAGE_TYPE.ERROR,
        })
      );
  } catch (e) {
    console.log(`GetUnSettledVendorBills :  ${e}`);
    yield put(enableLoading(false));
  }
}

export function* PostPaymentVoucher({ payload }) {
  try {
    const res = yield call(PostPaymentVoucher_Api, payload);
    yield put(enableLoading(false));
    if (res.status === 200) {
      yield put(setPaymentVoucher(res.data.id));
    } else
      yield put(
        openSnackbar({
          message: res?.data?.message || 'try again',
          type: MESSAGE_TYPE.ERROR,
        })
      );
  } catch (e) {
    console.log(`PostPaymentVoucher :  ${e}`);
    yield put(enableLoading(false));
  }
}

export function* GetPaymentBankAccounts({ payload }) {
  try {
    const res = yield call(GetPaymentBankAccounts_Api, payload);
    if (res.status === 200) {
      yield put(setPaymentBankAccounts(res.data.data));
      yield put(setProceedToPayDrawer(true));
    } else
      yield put(
        openSnackbar({
          message: res?.data?.message || 'try again',
          type: MESSAGE_TYPE.ERROR,
        })
      );
  } catch (e) {
    console.log(`GetPaymentBankAccounts :  ${e}`);
  }
}

export function* GetVoucherItemsDetail({ payload }) {
  try {
    const res = yield call(CreateGetVoucherItems_Api, {
      type: 'get',
      VoucherId: payload,
    });
    yield put(setVendorBillLoading(false));

    if (res.status === 200) {
      res.data?.data?.map((a) =>
        Object.assign(a, {
          selected: true,
          credit_period: a.age,
          name: a.vendor_name,
          voucher_id: a.id,
          paidAmount: a.amount,
        })
      );
      yield put(setVendorBills(res.data?.data));

      yield put(setSelectedVoucherItems(res.data?.data));

      yield put(setSelectedBillIds(res.data?.data?.map((e) => e.txn_line_id)));
    } else
      yield put(
        openSnackbar({
          message: res?.data?.message || 'try again',
          type: MESSAGE_TYPE.ERROR,
        })
      );
  } catch (e) {
    console.log(`GetVoucherItemsDetail :  ${e}`);
    yield put(enableLoading(false));
  }
}

export function* CreateVoucherItemDetail({ payload }) {
  const storeData = yield select((state) => state.MakePayment);

  try {
    const res = yield call(CreateGetVoucherItems_Api, {
      ...payload,
      type: 'post',
    });
    yield put(enableLoading(false));

    if (res.status === 200) {
      if (res.data.message === 'No vendor bank details is present') {
        yield put(
          openSnackbar({
            message: res.data.message,
            type: MESSAGE_TYPE.WARNING,
          })
        );
        yield put(
          setPaymentBankDrawer({
            value: true,
            vendorId: payload.body.vendor_id,
          })
        );
        return;
      }

      const newItems = storeData?.vendorBills?.map((item) => {
        if (item.id === payload.body.txn_line_id) {
          const updatedItem = {
            ...item,
            voucher_id: res.data.id,
            selected: true,
            paidAmount: Number(item.net_balance),
          };
          return updatedItem;
        }

        return { ...item };
      });

      yield put(setVendorBills(newItems));
    } else
      yield put(
        openSnackbar({
          message: res?.data?.message || 'try again',
          type: MESSAGE_TYPE.ERROR,
        })
      );
  } catch (e) {
    console.log(`CreateVoucherItemDetail :  ${e}`);
    yield put(enableLoading(false));
  }
}

export function* UpdateVoucherItemDetail({ payload }) {
  const storeData = yield select((state) => state.MakePayment);

  try {
    const res = yield call(DeleteUpdateVoucherDetail_Api, {
      ...payload,
      type: 'patch',
    });

    yield put(enableLoading(false));
    if (res.status === 200) {
      const newItems = storeData.vendorBills.map((item) => {
        if (item.voucher_id === payload.id) {
          const updatedItem = {
            ...item,
            paidAmount: payload.body.amount,
          };
          return updatedItem;
        }
        return { ...item };
      });
      yield put(setVendorBills(newItems));
    } else
      yield put(
        openSnackbar({
          message: res?.data?.message || 'try again',
          type: MESSAGE_TYPE.ERROR,
        })
      );
  } catch (e) {
    console.log(`UpdateVoucherItemDetail :  ${e}`);
    yield put(enableLoading(false));
  }
}

export function* DeleteVoucherItemDetail({ payload }) {
  try {
    const res = yield call(DeleteUpdateVoucherDetail_Api, {
      ...payload,
      type: 'delete',
    });

    if (res.status === 200) {
      yield put(enableLoading(false));
    } else
      yield put(
        openSnackbar({
          message: res?.data?.message || 'try again',
          type: MESSAGE_TYPE.ERROR,
        })
      );
  } catch (e) {
    console.log(`DeleteVoucherItemDetail :  ${e}`);
    yield put(enableLoading(false));
  }
}

const groupByKey = (data, key) => {
  return data.reduce((acc, item) => {
    (acc[item[key]] = acc[item[key]] || []).push(item);
    return acc;
  }, {});
};

export function* BulkDeleteVouchersDetail({ payload }) {
  const storeData = yield select((state) => state.MakePayment);

  try {
    const res = yield call(BulkDeleteVouchersDetail_Api, payload);

    yield put(enableLoading(false));
    if (res.status === 200) {
      yield put(
        openSnackbar({
          message: res?.data.message,
          type: MESSAGE_TYPE.INFO,
        })
      );

      const selectedId = groupByKey(
        storeData.vendorBills.filter((a) => a.selected),
        'vendor_name'
      )[payload.keyValue].map((listItem) => {
        return listItem.txn_line_id;
      });

      const newItems = storeData.vendorBills.map((item) => {
        if (selectedId.includes(item.txn_line_id)) {
          return { ...item, selected: false, voucherId: null, paidAmount: 0 };
        }
        return item;
      });

      const temp = storeData?.selectedbillids?.filter(
        (item) => !selectedId.includes(item)
      );

      yield put(setSelectedBillIds(temp));
      yield put(setVendorBills(newItems));

      yield put(setRefreshResponse('bulkDeleteSuccess'));
    } else
      yield put(
        openSnackbar({
          message: res?.data?.message || 'try again',
          type: MESSAGE_TYPE.ERROR,
        })
      );
  } catch (e) {
    console.log(`BulkDeleteVouchersDetail :  ${e}`);
    yield put(enableLoading(false));
  }
}

export function* RefreshVoucherItemDetail({ payload }) {
  try {
    const res = yield call(RefreshVoucherItemDetail_Api, payload);

    yield put(enableLoading(false));
    if (res.status === 200) {
      yield put(unSettledVendorBills());
      yield put(setPaymentVoucher(res?.data?.id));
      yield put(setRefreshResponse('refSuccess'));
    } else
      yield put(
        openSnackbar({
          message: res?.data?.message || 'try again',
          type: MESSAGE_TYPE.ERROR,
        })
      );
  } catch (e) {
    console.log(`RefreshVoucherItemDetail :  ${e}`);
    yield put(enableLoading(false));
  }
}

export function* RetryPaymentsMethod({ payload }) {
  try {
    const res = yield call(RetryPaymentsMethod_Api, payload);

    yield put(enableLoading(false));
    if (res.status === 200) {
      yield put(setProceedToPayDrawer(false));
      yield put(setPaymentVoucher(res?.payment_voucher_id));
      yield put(setRetryPaymentVoucharId(res?.payment_voucher_id));
    }
  } catch (e) {
    console.log(`RetryPaymentsMethod :  ${e}`);
    yield put(enableLoading(false));
  }
}
