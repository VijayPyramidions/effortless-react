/* eslint-disable array-callback-return */
/* eslint-disable no-plusplus */

import { call, put } from 'redux-saga/effects';
import { MESSAGE_TYPE } from '@components/SnackBarContainer/SnackBarContainer';

import {
  getClaims,
  setClaims,
  setOnClaim,
  setReimbursementAdvances,
  setDrawer,
  getTrips,
  getAllTrips,
  setTrips,
  setManagers,
  setEmployees,
  setAdvanceRes,
  setTripExpenses,
  getTripExpenses,
  setTripExpenseRes,
  setReimbursementPerformanceAction,
  setRejectClaimRes,
  setApproveClaim,
  setClaimDetailsForBillPatch,
  fetchOCRData,
  setOCRData,
  setTripSave,
  setVoucher,
  setAllVoucherItems,
  setRaiseClaimResponse,
  setTripViewState,
  setAllTrips,
} from '@action/Store/Reducers/Reimbursement/ReimbursementState';

import {
  openSnackbar,
  enableLoading,
} from '@action/Store/Reducers/Errors/Errors';

import {
  GetClaimsDetails_Api,
  PostClaimsDetails_Api,
  GetOneClaimDetails_Api,
  UpdateClaimDetails_Api,
  DeleteClaimDetails_Api,
  GetReimbursementAdvancesDetails_Api,
  GetTripsDetails_Api,
  PostTripDetails_Api,
  EditTripDetails_Api,
  DeleteTripDetails_Api,
  GetManagersDetails_Api,
  GetEmployeesDetails_Api,
  PostFollowUpDetail_Api,
  GetTripExpensesDetail_Api,
  ApproveClaimDetail_Api,
  RejectClaimDetail_Api,
  RaiseClaimDetail_Api,
  GetOCRDataDetail_Api,
  FetchOCRDataDetail_Api,
  GetVoucher_Api,
  VoucherItems_Api,
  DeleteVoucherItem_Api,
  AdjustAdvanceItem_Api,
  TripAdjustItem_Api,
} from '../../API/Reimbursement/ReimbursementApi';

export function* GetClaimsDetails({ payload }) {
  yield put(enableLoading(true));
  try {
    const res = yield call(GetClaimsDetails_Api, payload);
    if (res.status === 200) yield put(setClaims(res.data));
    else
      yield put(
        openSnackbar({
          message: res?.data?.message || 'try again',
          type: MESSAGE_TYPE.ERROR,
        })
      );
    yield put(enableLoading(false));
  } catch (e) {
    console.log(`GetClaimsDetails :  ${e}`);
    yield put(enableLoading(false));
  }
}

export function* PostClaimsDetails({ payload }) {
  yield put(enableLoading(payload?.for !== 'billPatch'));
  try {
    const res = yield call(PostClaimsDetails_Api, payload);

    if (res.status === 200) {
      if (payload?.for === 'billPatch') {
        yield put(setClaimDetailsForBillPatch(res.data));
        return;
      }
      if (payload.claim_type === 'expense') {
        yield put(
          setReimbursementPerformanceAction({
            name: 'expensePerformActions',
            action: 'expense_added_successfully',
          })
        );
      } else if (payload.claim_type === 'mileage') {
        yield put(
          setReimbursementPerformanceAction({
            name: 'mileagePerformActions',
            action: 'milage_added_successfully',
          })
        );
      }
      yield put(setDrawer({ name: payload.claim_type, value: false }));

      if (payload.tab) yield put(getClaims({ type: payload.tab }));
      if (!payload.tab) {
        yield put(getTripExpenses(payload.reimbursement_group_id));
        yield put(setTripExpenseRes('expenseadded'));
      }
      if (payload.reimbursement_type !== 'advance')
        yield put(
          openSnackbar({
            message: `${
              payload?.claim_type?.substr(0, 1)?.toUpperCase() +
              payload?.claim_type?.substr(1)
            } reimbursement added successfully`,
            type: MESSAGE_TYPE.INFO,
          })
        );
      else {
        yield put(setDrawer({ name: 'requestAdvance', value: false }));
        yield put(setAdvanceRes('added'));
        yield put(
          setReimbursementPerformanceAction({
            name: 'advancePerformActions',
            action: 'request_advance_added_successfully',
          })
        );

        yield put(
          openSnackbar({
            message: `Advance request added successfully`,
            type: MESSAGE_TYPE.INFO,
          })
        );
      }
    } else
      yield put(
        openSnackbar({
          message: res?.data?.message || 'try again',
          type: MESSAGE_TYPE.ERROR,
        })
      );
    yield put(enableLoading(false));
  } catch (e) {
    console.log(`PostClaimsDetails :  ${e}`);
    yield put(enableLoading(false));
  }
}

export function* GetOneClaimDetails({ payload }) {
  yield put(enableLoading(true));
  try {
    const res = yield call(GetOneClaimDetails_Api, payload);
    if (res.status === 200) yield put(setOnClaim(res.data));
    else
      yield put(
        openSnackbar({
          message: res?.data?.message || 'try again',
          type: MESSAGE_TYPE.ERROR,
        })
      );
    yield put(enableLoading(false));
  } catch (e) {
    console.log(`GetOneClaimDetails :  ${e}`);
    yield put(enableLoading(false));
  }
}

export function* UpdateClaimDetails({ payload }) {
  yield put(enableLoading(payload?.for !== 'billPatch'));
  try {
    const res = yield call(UpdateClaimDetails_Api, payload);
    if (res.status === 200) {
      if (payload?.for === 'billPatch') {
        yield put(setClaimDetailsForBillPatch(res.data));
        yield put(enableLoading(false));
        return;
      }
      if (payload.claim_type === 'expense') {
        yield put(
          setReimbursementPerformanceAction({
            name: 'expensePerformActions',
            action: 'expense_updated_successfully',
          })
        );
      } else if (payload.claim_type === 'mileage') {
        yield put(
          setReimbursementPerformanceAction({
            name: 'mileagePerformActions',
            action: 'milage_updated_successfully',
          })
        );
      }
      yield put(setDrawer({ name: payload.claim_type, value: false }));
      if (payload.tab) yield put(getClaims({ type: payload.tab }));
      if (!payload.tab) {
        yield put(getTripExpenses(payload.reimbursement_group_id));
        yield put(setTripExpenseRes('expenseupdated'));
      }
      if (payload.reimbursement_type !== 'advance')
        yield put(
          openSnackbar({
            message: `${
              payload?.claim_type?.substr(0, 1)?.toUpperCase() +
              payload?.claim_type?.substr(1)
            } reimbursement updated successfully`,
            type: MESSAGE_TYPE.INFO,
          })
        );
      else {
        yield put(setDrawer({ name: 'requestAdvance', value: false }));

        yield put(
          openSnackbar({
            message: `Advance request updated successfully`,
            type: MESSAGE_TYPE.INFO,
          })
        );
        yield put(
          setReimbursementPerformanceAction({
            name: 'advancePerformActions',
            action: 'request_advance_updated_successfully',
          })
        );
      }
    } else
      yield put(
        openSnackbar({
          message: res?.data?.message || 'try again',
          type: MESSAGE_TYPE.ERROR,
        })
      );
    yield put(enableLoading(false));
  } catch (e) {
    console.log(`UpdateClaimDetails :  ${e}`);
    yield put(enableLoading(false));
  }
}

export function* DeleteClaimDetails({ payload }) {
  yield put(enableLoading(true));
  try {
    const res = yield call(DeleteClaimDetails_Api, payload);

    if (res.status === 200) {
      yield put(setDrawer({ name: payload.claim_type, value: false }));
      if (payload.tab) yield put(getClaims({ type: payload.tab }));
      if (!payload.tab) {
        yield put(getTripExpenses(payload.reimbursement_group_id));
        yield put(setTripExpenseRes('TripExpenseDeleted'));
        yield put(
          setReimbursementPerformanceAction({
            name: 'expensePerformActions',
            action: 'expense_updated_successfully',
          })
        );
      }
      if (payload.claim_type === 'requestAdvance')
        yield put(
          openSnackbar({
            message: 'Advance Request deleted successfully',
            type: MESSAGE_TYPE.INFO,
          })
        );
      else
        yield put(
          openSnackbar({
            message: ' Deleted Successfully',
            type: MESSAGE_TYPE.INFO,
          })
        );
    } else
      yield put(
        openSnackbar({
          message: res?.data?.message || 'try again',
          type: MESSAGE_TYPE.ERROR,
        })
      );
    yield put(enableLoading(false));
  } catch (e) {
    console.log(`DeleteClaimDetails :  ${e}`);
    yield put(enableLoading(false));
  }
}

export function* GetReimbursementAdvancesDetails({ payload }) {
  yield put(enableLoading(true));
  try {
    const res = yield call(GetReimbursementAdvancesDetails_Api, payload);
    if (res.status === 200)
      yield put(setReimbursementAdvances(res?.data?.data));
    else
      yield put(
        openSnackbar({
          message: 'Something wrong try again',
          type: MESSAGE_TYPE.ERROR,
        })
      );

    yield put(enableLoading(false));
  } catch (e) {
    console.log(`GetReimbursementAdvancesDetails : ${e}`);
    yield put(enableLoading(false));
  }
}

export function* GetTripsDetails({ payload }) {
  yield put(enableLoading(true));
  try {
    const res = yield call(GetTripsDetails_Api, payload);

    if (res.status === 200) {
      if (payload.type === 'outstanding_and_settlement')
        yield put(setAllTrips(res?.data));
      yield put(setTrips(res.data));
    } else
      yield put(
        openSnackbar({
          message: res?.data?.message || 'try again',
          type: MESSAGE_TYPE.ERROR,
        })
      );
    yield put(enableLoading(false));
  } catch (e) {
    console.log(`GetTripsDetails :  ${e}`);
    yield put(enableLoading(false));
  }
}

export function* PostTripDetails({ payload }) {
  yield put(enableLoading(true));
  try {
    const res = yield call(PostTripDetails_Api, payload);

    if (res.status === 200) {
      yield put(
        setReimbursementPerformanceAction({
          name: 'tripPerformActions',
          action: 'trip_added_successfully',
        })
      );

      yield put(setTripSave(res?.data));
      yield put(
        openSnackbar({
          message: `Trip added successfully`,
          type: MESSAGE_TYPE.INFO,
        })
      );
      yield put(getAllTrips({ type: 'outstanding_and_settlement' }));
    } else
      yield put(
        openSnackbar({
          message: res?.data?.message || 'try again',
          type: MESSAGE_TYPE.ERROR,
        })
      );
    yield put(enableLoading(false));
  } catch (e) {
    console.log(`PostTripDetails :  ${e}`);
    yield put(enableLoading(false));
  }
}

export function* EditTripDetails({ payload }) {
  yield put(enableLoading(true));
  try {
    const res = yield call(EditTripDetails_Api, payload);

    if (res.status === 200) {
      yield put(
        setReimbursementPerformanceAction({
          name: 'tripPerformActions',
          action: 'trip_updated_successfully',
        })
      );
      // yield put(setTripSave(res?.data));
      yield put(
        openSnackbar({
          message: `Trip detail updated successfully`,
          type: MESSAGE_TYPE.INFO,
        })
      );
      yield put(getAllTrips({ type: 'outstanding_and_settlement' }));
    } else
      yield put(
        openSnackbar({
          message: res?.data?.message || 'try again',
          type: MESSAGE_TYPE.ERROR,
        })
      );
    yield put(enableLoading(false));
  } catch (e) {
    console.log(`EditTripDetails :  ${e}`);
    yield put(enableLoading(false));
  }
}

export function* DeleteTripDetails({ payload }) {
  yield put(enableLoading(true));
  try {
    const res = yield call(DeleteTripDetails_Api, payload);

    if (res.status === 200) {
      // yield put(
      //   setReimbursementPerformanceAction({
      //     name: 'tripPerformActions',
      //     action: 'trip_added_successfully',
      //   })
      // );
      // yield put(setTripSave(res?.data));
      yield put(
        openSnackbar({
          message: `Trip deleted successfully`,
          type: MESSAGE_TYPE.INFO,
        })
      );
      yield put(getAllTrips({ type: 'outstanding_and_settlement' }));
    } else
      yield put(
        openSnackbar({
          message: res?.data?.message || 'try again',
          type: MESSAGE_TYPE.ERROR,
        })
      );
    yield put(enableLoading(false));
  } catch (e) {
    console.log(`DeleteTripDetails :  ${e}`);
    yield put(enableLoading(false));
  }
}

export function* GetManagersDetails({ payload }) {
  yield put(enableLoading(true));
  try {
    const res = yield call(GetManagersDetails_Api, payload);

    if (res.status === 200) yield put(setManagers(res?.data?.data));
    else
      yield put(
        openSnackbar({
          message: res?.data?.message || 'try again',
          type: MESSAGE_TYPE.ERROR,
        })
      );
    yield put(enableLoading(false));
  } catch (e) {
    console.log(`GetManagersDetails :  ${e}`);
    yield put(enableLoading(false));
  }
}

export function* GetEmployeesDetails({ payload }) {
  yield put(enableLoading(true));
  try {
    const res = yield call(GetEmployeesDetails_Api, payload);

    if (res.status === 200) yield put(setEmployees(res.data.data));
    else
      yield put(
        openSnackbar({
          message: res?.data?.message || 'try again',
          type: MESSAGE_TYPE.ERROR,
        })
      );
    yield put(enableLoading(false));
  } catch (e) {
    console.log(`GetEmployeesDetails :  ${e}`);
    yield put(enableLoading(false));
  }
}

export function* PostFollowUpDetail({ payload }) {
  yield put(enableLoading(true));
  try {
    const res = yield call(PostFollowUpDetail_Api, payload);

    if (res.status === 200)
      yield put(
        openSnackbar({
          message: 'Follow Up send successfully',
          type: MESSAGE_TYPE.INFO,
        })
      );
    else
      yield put(
        openSnackbar({
          message: res?.data?.message || 'try again',
          type: MESSAGE_TYPE.ERROR,
        })
      );
    yield put(enableLoading(false));
  } catch (e) {
    console.log(`PostFollowUpDetail :  ${e}`);
    yield put(enableLoading(false));
  }
}

export function* GetTripExpensesDetail({ payload }) {
  yield put(enableLoading(true));
  try {
    const res = yield call(GetTripExpensesDetail_Api, payload);

    if (res.status === 200) yield put(setTripExpenses(res.data));
    else
      yield put(
        openSnackbar({
          message: res?.data?.message || 'try again',
          type: MESSAGE_TYPE.ERROR,
        })
      );
    yield put(enableLoading(false));
  } catch (e) {
    console.log(`GetTripExpensesDetail :  ${e}`);
    yield put(enableLoading(false));
  }
}

export function* ApproveClaimDetail({ payload }) {
  yield put(enableLoading(true));
  try {
    const res = yield call(ApproveClaimDetail_Api, payload);

    if (res.status === 200) {
      yield put(setDrawer({ name: 'claimReview', value: false }));
      yield put(setApproveClaim(res?.data?.message));
      yield put(
        openSnackbar({
          message: res?.data?.message || 'somthing went wrong',
          type: MESSAGE_TYPE.INFO,
        })
      );
    } else
      yield put(
        openSnackbar({
          message: res?.data?.message || 'somthing went wrong',
          type: MESSAGE_TYPE.ERROR,
        })
      );
    yield put(enableLoading(false));
  } catch (e) {
    console.log(`ApproveClaimDetail :  ${e}`);
    yield put(enableLoading(false));
  }
}

export function* RejectClaimDetail({ payload }) {
  yield put(enableLoading(true));
  try {
    const res = yield call(RejectClaimDetail_Api, payload);

    if (res.status === 200) {
      yield put(
        openSnackbar({
          message: res?.data?.message,
          type: MESSAGE_TYPE.INFO,
        })
      );
      yield put(getClaims({ type: payload?.tab }));
      yield put(setDrawer({ name: 'payAdvanceApprove', action: false }));
      yield put(setRejectClaimRes('claim rejected'));
    } else
      yield put(
        openSnackbar({
          message: res?.data?.message || 'try again',
          type: MESSAGE_TYPE.ERROR,
        })
      );
    yield put(enableLoading(false));
  } catch (e) {
    console.log(`RejectClaimDetail :  ${e}`);
    yield put(enableLoading(false));
  }
}

export function* RaiseClaimDetail({ payload }) {
  yield put(enableLoading(true));
  try {
    const res = yield call(RaiseClaimDetail_Api, payload);

    if (res.status === 200) {
      yield put(setDrawer({ name: 'trip', value: false }));
      yield put(getTrips({ type: 'outstanding' }));
      yield put(setRaiseClaimResponse('claim raised'));
      yield put(setTripViewState('view_trip'));
      yield put(
        openSnackbar({
          message: 'claim raised successfully',
          type: MESSAGE_TYPE.INFO,
        })
      );
    } else
      yield put(
        openSnackbar({
          message: res?.data?.message || 'try again',
          type: MESSAGE_TYPE.ERROR,
        })
      );
    yield put(enableLoading(false));
  } catch (e) {
    console.log(`RaiseClaimDetail :  ${e}`);
    yield put(enableLoading(false));
  }
}

export function* GetOCRDataDetail({ payload }) {
  yield put(enableLoading(true));
  try {
    const res = yield call(GetOCRDataDetail_Api, payload);

    if (res.status === 200) {
      yield put(enableLoading(true));
      if (payload?.for === 'billPatch') {
        yield put(setClaimDetailsForBillPatch(res.data));
        // return;
      }
      // if (payload.claim_type === 'expense') {
      //   yield put(
      //     setReimbursementPerformanceAction({
      //       name: 'expensePerformActions',
      //       action: 'expense_added_successfully',
      //     })
      //   );
      // } else if (payload.claim_type === 'mileage') {
      //   yield put(
      //     setReimbursementPerformanceAction({
      //       name: 'mileagePerformActions',
      //       action: 'milage_added_successfully',
      //     })
      //   );
      // }

      yield put(setOCRData(res?.data));
      yield put(fetchOCRData({ id: res?.data?.id }));
    } else
      yield put(
        openSnackbar({
          message: res?.data?.message || 'try again',
          type: MESSAGE_TYPE.ERROR,
        })
      );
    // yield put(enableLoading(false));
  } catch (e) {
    console.log(`GetOCRDataDetail :  ${e}`);
    yield put(enableLoading(false));
  }
}

export function* FetchOCRDataDetail({ payload }) {
  yield put(enableLoading(true));
  try {
    const res = yield call(FetchOCRDataDetail_Api, payload);

    if (res.status === 200) yield put(setOCRData(res?.data));
    else
      yield put(
        openSnackbar({
          message: res?.data?.message || 'try again',
          type: MESSAGE_TYPE.ERROR,
        })
      );
    // yield put(enableLoading(false));
  } catch (e) {
    console.log(`FetchOCRDataDetail :  ${e}`);
    yield put(enableLoading(false));
  }
}

export function* GetVoucher({ payload }) {
  yield put(enableLoading(true));
  try {
    const res = yield call(GetVoucher_Api, payload);

    if (res.status === 200) yield put(setVoucher(res?.data));
    else
      yield put(
        openSnackbar({
          message: res?.data?.message || 'try again',
          type: MESSAGE_TYPE.ERROR,
        })
      );
    yield put(enableLoading(false));
  } catch (e) {
    console.log(`GetVoucher :  ${e}`);
    yield put(enableLoading(false));
  }
}

export function* CreateVoucherItem({ payload }) {
  yield put(enableLoading(true));
  try {
    const res = yield call(VoucherItems_Api, payload);

    if (res.status === 200 && !res?.data?.error) {
      try {
        const resp = yield call(VoucherItems_Api, {
          type: 'get',
          VoucherId: payload.VoucherId,
        });

        if (resp.status === 200) {
          yield put(setAllVoucherItems(resp?.data?.data));
          if (res.data.error) {
            yield put(
              openSnackbar({
                message: resp?.data?.message || 'try again',
                type: MESSAGE_TYPE.ERROR,
              })
            );
          }
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
    } else
      try {
        const resp = yield call(VoucherItems_Api, {
          type: 'get',
          VoucherId: payload.VoucherId,
        });

        if (resp.status === 200) {
          yield put(setAllVoucherItems(resp?.data?.data));

          if (res.data.error) {
            yield put(
              openSnackbar({
                message: res?.data?.message || 'try again',
                type: MESSAGE_TYPE.ERROR,
              })
            );
          }
        } else
          yield put(
            openSnackbar({
              message: resp?.data?.message || 'try again',
              type: MESSAGE_TYPE.ERROR,
            })
          );
      } catch (e) {
        console.log(`GetVoucherItemsDetail :  ${e}`);
        yield put(enableLoading(false));
      }
    // yield put(
    //   openSnackbar({
    //     message: res?.data?.message || 'try again',
    //     type: MESSAGE_TYPE.ERROR,
    //   })
    // );
    yield put(enableLoading(false));
  } catch (e) {
    console.log(`CreateVoucherItem :  ${e}`);
    yield put(enableLoading(false));
  }
}

export function* DeleteVoucherItem({ payload }) {
  try {
    const res = yield call(DeleteVoucherItem_Api, {
      ...payload,
      type: 'delete',
    });

    if (res.status === 200) {
      try {
        const resp = yield call(VoucherItems_Api, {
          type: 'get',
          VoucherId: payload.VoucherId,
        });

        if (res.status === 200) {
          yield put(setAllVoucherItems(resp?.data?.data));
        } else
          yield put(
            openSnackbar({
              message: resp?.data?.message || 'try again',
              type: MESSAGE_TYPE.ERROR,
            })
          );
      } catch (e) {
        console.log(`GetVoucherItemsDetail :  ${e}`);
        yield put(enableLoading(false));
      }
      yield put(enableLoading(false));
    } else
      yield put(
        openSnackbar({
          message: res?.data?.message || 'try again',
          type: MESSAGE_TYPE.ERROR,
        })
      );
  } catch (e) {
    console.log(`DeleteVoucherItem :  ${e}`);
    yield put(enableLoading(false));
  }
}

export function* AdjustAdvanceItem({ payload }) {
  yield put(enableLoading(true));
  try {
    const res = yield call(AdjustAdvanceItem_Api, payload);

    if (res.status === 200)
      yield yield put(
        openSnackbar({
          message: 'Advance adjusted to current expense',
          type: MESSAGE_TYPE.ERROR,
        })
      );
    else
      yield put(
        openSnackbar({
          message: res?.data?.message || 'try again',
          type: MESSAGE_TYPE.ERROR,
        })
      );
    yield put(enableLoading(false));
  } catch (e) {
    console.log(`AdjustAdvanceItem :  ${e}`);
    yield put(enableLoading(false));
  }
}

export function* TripAdjustItem({ payload }) {
  yield put(enableLoading(true));
  try {
    const res = yield call(TripAdjustItem_Api, payload);

    if (res.status === 200) {
      yield yield put(
        openSnackbar({
          message: 'Advance adjusted to current expense',
          type: MESSAGE_TYPE.ERROR,
        })
      );
      yield put(setDrawer({ name: 'claimReview', value: false }));
    } else
      yield put(
        openSnackbar({
          message: res?.data?.message || 'try again',
          type: MESSAGE_TYPE.ERROR,
        })
      );
    yield put(enableLoading(false));
  } catch (e) {
    console.log(`TripAdjustItem :  ${e}`);
    yield put(enableLoading(false));
  }
}
