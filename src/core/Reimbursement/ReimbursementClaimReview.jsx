import React, { memo, useEffect, useState, useContext } from 'react';
import { useDispatch, useSelector } from 'react-redux';
import { useLocation, useNavigate } from 'react-router-dom';

import moment from 'moment';

import {
  approveClaim,
  rejectClaim,
  setApproveClaim,
} from '@action/Store/Reducers/Reimbursement/ReimbursementState';

import AppContext from '@root/AppContext';
import { PermissionDialog } from '@components/Permissions/PermissionDialog';

import {
  Stack,
  Typography,
  Button,
  useTheme,
  useMediaQuery,
  Avatar,
  Dialog,
} from '@mui/material';
import { validateRequired } from '@services/Validation.jsx';
import Input from '@components/Input/Input.jsx';
import SelectBottomSheet from '@components/SelectBottomSheet/SelectBottomSheet';
import { FormattedAmount } from '@components/formattedValue/FormattedValue';
import { CustomizedStepper } from './Components/ReimbursementActionSheets';
import ProceedToPay from '../PaymentView/shared/ProceedToPay';
import ForgetPassword from '../PaymentView/TransactionVerify/ForgetPassword';

import * as css from './ReimbursementClaimReview.scss';
import { IndianCurrency } from '../../components/utils';
import { ImageUpload } from './Components/WithBill';

const TripCard = ({ headerName, value, valueCss }) => {
  return (
    <div className={`${css.tripCardDetails} ${valueCss}`} id="tripcard">
      <label htmlFor="tripcard">{headerName}</label>
      <p>{value}</p>
    </div>
  );
};

const ReimbursementClaimReview = ({
  data,
  tab,
  voucherValues,
  bankAccountValues,
  allVoucherItemsValues,
  handleDrawer,
}) => {
  const themes = useTheme();
  const desktopView = useMediaQuery(themes.breakpoints.up('sm'));
  const {
    oneClaimDetails,
    approveResponse,
    voucher,
    bankAccounts,
    allVoucherItems,
  } = useSelector((state) => state.Reimbursement);
  const dispatch = useDispatch();
  const location = useLocation();
  const navigate = useNavigate();
  const [localState] = useState(location?.state?.item);

  const { userPermissions } = useContext(AppContext);

  const allVoucherItemsVal =
    allVoucherItems ||
    location?.state?.allVoucherItems ||
    allVoucherItemsValues;
  const voucherVal = voucher || location?.state?.voucher || voucherValues;

  const bankAccountsVal =
    bankAccounts || location?.state?.bankAccounts || bankAccountValues;

  const [drawerState, setDrawerState] = useState({});
  const [rejectReason, setRejectReason] = useState('');
  const [imageDrawer, setImageDrawer] = useState({ open: false });
  const [validationErr, setValidationErr] = useState({
    description: false,
  });
  const [localStateVal, setLocalState] = useState({});
  const [transacForgetPass, setTransacForgetPass] = useState(false);
  const [havePermission, setHavePermission] = useState(false);

  const reValidate = (e) => {
    const { name, value } = e?.target;
    setValidationErr((s) => ({ ...s, [name]: !validateRequired(value) }));
  };

  const hanldeChange = (e) => {
    reValidate(e);
    setRejectReason(e?.target?.value);
  };

  const onsubmitReject = async () => {
    if (rejectReason) {
      await dispatch(
        rejectClaim({
          id: data?.id || localState?.id,
          reason: rejectReason,
          tab,
        }),
      );
      setDrawerState((d) => ({ ...d, rejectReason: false }));
      if (desktopView) {
        handleDrawer('claimReview', false);
      } else {
        navigate('/reimbursement-approval');
      }
    } else {
      setValidationErr((s) => ({ ...s, description: true }));
    }
  };

  useEffect(() => {
    if (approveResponse === 'Reimbursement has been approved successfully')
      if (!desktopView) navigate('/reimbursement-approval');
    return () => {
      dispatch(setApproveClaim(''));
    };
  }, [approveResponse]);

  useEffect(() => {
    if (data || localState) {
      let stepper;
      if (data?.status === 'paid' || localState?.status === 'paid')
        stepper = {
          active: 3,
          showData: [
            {
              name: 'Submitted on',
              label: moment(data?.claimed_on || localState?.claimed_on)?.format(
                'DD MMM YYYY',
              ),
              id: 1,
              type: 'submit',
            },
            {
              name: 'Approved on',
              label: moment(
                data?.approved_on || localState?.approved_on,
              )?.format('DD MMM YYYY'),
              id: 2,
              type: 'approve',
              approvedBy:
                data?.approver_details?.name ||
                localState?.approver_details?.name ||
                '-',
            },
            {
              name: 'Payment on',
              label: moment(data?.paid_on || localState?.paid_on)?.format(
                'DD MMM YYYY',
              ),
              id: 3,
              type: 'payment',
              status: 'paid',
            },
          ],
        };
      else if (
        data?.status === 'partially_paid' ||
        localState?.status === 'partially_paid'
      )
        stepper = {
          active: 3,
          showData: [
            {
              name: 'Submitted on',
              label: moment(data?.claimed_on || localState?.claimed_on)?.format(
                'DD MMM YYYY',
              ),
              id: 1,
              type: 'submit',
            },
            {
              name: 'Approved on',
              label: moment(
                data?.approved_on || localState?.approved_on,
              )?.format('DD MMM YYYY'),
              id: 2,
              type: 'approve',
              approvedBy:
                data?.approver_details?.name ||
                localState?.approver_details?.name ||
                '-',
            },
            {
              name: 'Payment on',
              label: moment(data?.paid_on || localState?.paid_on)?.format(
                'DD MMM YYYY',
              ),
              id: 3,
              type: 'payment',
              status: 'partially_paid',
              paidamt: data?.paid_amount
                ? data?.paid_amount
                : localState?.paid_amount,
              balanceamt: data?.amount
                ? data?.amount - data?.paid_amount || 0
                : localState?.amount - localState?.paid_amount || 0,
            },
          ],
        };
      else if (data?.status === 'declined' || localState?.status === 'declined')
        stepper = {
          active: 2,
          showData: [
            {
              name: 'Submitted on',
              label: moment(data?.claimed_on || localState?.claimed_on)?.format(
                'DD MMM YYYY',
              ),
              id: 1,
              type: 'submit',
            },
            {
              name: 'Rejected on',
              label: moment(oneClaimDetails?.cancelled_on)?.format(
                'DD MMM YYYY',
              ),
              id: 2,
              reason:
                data?.reject_reason ||
                localState?.reject_reason ||
                'Contact your manager.',
              type: 'declined',
              rejectedBy:
                data?.canceller_details?.name ||
                localState?.canceller_details?.name ||
                '-',
            },
          ],
        };

      setLocalState((prev) => ({
        ...prev,
        stepperActive: stepper?.active || 0,
        stepperData: stepper?.showData || [],
      }));
    }
  }, [data, localState]);

  return (
    <>
      {desktopView ? (
        <>
          <div className={css.reimbursementClaimContainerMobile}>
            <Typography className={css.headertitle}>
              Claim Review{' '}
              {data?.number && (
                <span style={{ color: '#3049BF', fontSize: '20px' }}>
                  {data?.number}
                </span>
              )}
            </Typography>
            <div className={css.header}>
              <div className={css.nameContainer}>
                <Avatar
                  className={css.orgAvatar}
                  src={`https://api.dicebear.com/7.x/initials/svg?seed=${data?.employee_name}&chars=2`}
                />
                <Typography className={css.nameContainerText}>
                  {data?.employee_name || '-'}
                </Typography>
              </div>
            </div>
            <div className={css.detailsCard}>
              <TripCard
                headerName="Category"
                value={data?.name}
                valueCss={css.tripValue}
              />
              {/* <div /> */}
              <div>
                {!!data?.file_url && (
                  <div
                    className={css.viewBills}
                    onClick={() =>
                      setImageDrawer((prev) => ({ ...prev, open: true }))
                    }
                  >
                    VIEW BILLS
                  </div>
                )}
              </div>

              <TripCard
                headerName="Expense date"
                value={moment(data?.date).format('Do MMM,YYYY')}
                valueCss={css.startDate}
              />
              {/* <div /> */}
              <TripCard
                headerName="Submit date"
                value={moment(data?.claimed_on).format('Do MMM,YYYY')}
                valueCss={css.submitDate}
              />
              {/* <TripCard
                headerName="Advance"
                value={IndianCurrency.format(
                  oneClaimDetails?.advance_amount || 0
                )}
                valueCss={css.advance}
              /> */}

              <TripCard
                headerName="Claimed"
                value={IndianCurrency.format(oneClaimDetails?.amount || 0)}
                valueCss={css.claimed}
              />
              {/* <div /> */}

              <TripCard
                headerName="To Pay"
                value={IndianCurrency.format(oneClaimDetails?.paid_amount || 0)}
                valueCss={css.toRecieve}
              />
            </div>

            <div className={css.reimbursementDetailsContainer}>
              {/* <div className={css.reimbursementCard}>
                <div className={css.containerOne}>
                  <p>Apr-23</p>
                  <p>Travel Expenses</p>
                </div>
                <div className={css.containerTwo}>
                  <p>Your Claim</p>
                  <p>₹2,000</p>
                </div>
              </div> */}
              <div className={css.vendorCard}>
                <div className={css.vendorCardLeft}>
                  <p>VENDOR</p>
                  <p>{data?.vendor_name || '-'}</p>
                </div>
                {data?.client_id && (
                  <div className={css.vendorCardRight}>
                    <span>Billable</span>
                  </div>
                )}
              </div>

              <div className={css.clientCard}>
                <p>CLIENT</p>
                <p>{data?.client_name || '-'}</p>
              </div>

              <div className={css.descCard}>
                <p>Description</p>
                <p>{data?.description || '-'} </p>
              </div>
            </div>
            <div className={css.footerBtn}>
              {tab === 'pending_payment' &&
              data?.status !== 'paid' &&
              data?.status !== 'partially_paid' ? (
                <div className={css.sectionTwo}>
                  <Button
                    disabled={allVoucherItemsVal?.length === 0}
                    onClick={() => {
                      if (userPermissions?.Payments?.Payment?.create_payment)
                        setDrawerState((d) => ({ ...d, proceedToPay: true }));
                      else setHavePermission(true);
                    }}
                    className={css.payBtn}
                  >
                    Pay Now
                  </Button>
                </div>
              ) : (
                <>
                  {data?.status !== 'paid' &&
                    data?.status !== 'partially_paid' &&
                    data?.status !== 'approved' &&
                    data?.status !== 'declined' && (
                      <div className={css.sectionOne}>
                        <Button
                          className={css.rejectBtn}
                          onClick={() => {
                            if (
                              userPermissions?.Reimbursement?.[
                                'Reimbursement Claims'
                              ]?.cancel_reimbursement_claim
                            )
                              setDrawerState((d) => ({
                                ...d,
                                rejectReason: true,
                              }));
                            else setHavePermission(true);
                          }}
                        >
                          Reject
                        </Button>
                        <Button
                          className={css.approveBtn}
                          onClick={() => {
                            if (
                              userPermissions?.Reimbursement?.[
                                'Reimbursement Claims'
                              ]?.approve_reimbursement_claim
                            )
                              dispatch(approveClaim(data?.id));
                            else setHavePermission(true);
                          }}
                        >
                          Approve
                        </Button>
                      </div>
                    )}
                  {(data?.status === 'paid' ||
                    data?.status === 'partially_paid' ||
                    data?.status === 'declined') && (
                    <CustomizedStepper
                      stepperList={localStateVal?.stepperData}
                      active={localStateVal?.stepperActive}
                    />
                  )}
                </>
              )}
            </div>
          </div>
          <Dialog
            open={imageDrawer.open}
            onClose={() => setImageDrawer((prev) => ({ ...prev, open: false }))}
            PaperProps={{
              elevation: 3,
              style: {
                borderRadius: 16,
                padding: '16px',
              },
            }}
          >
            <ImageUpload
              localState={{
                ...imageDrawer.data,
                bill_details: { url: data?.file_url, type: 'application/jpg' },
              }}
              style={{ height: '500px', width: '500px' }}
            />
          </Dialog>
        </>
      ) : (
        <>
          <div className={css.reimbursementClaimContainerMobile}>
            <div className={css.header}>
              <div className={css.nameContainer}>
                <Avatar
                  className={css.orgAvatar}
                  src={`https://api.dicebear.com/7.x/initials/svg?seed=${
                    localState?.employee_name || '-'
                  }&chars=2`}
                />
                <Typography className={css.nameContainerText}>
                  {localState?.employee_name || '-'}
                </Typography>
              </div>
            </div>
            <div className={css.detailsCard}>
              <TripCard
                headerName="Category"
                value={localState?.name}
                valueCss={css.tripValue}
              />
              {/* <div /> */}
              <div>
                {!!localState?.file_url && (
                  <div
                    className={css.viewBills}
                    onClick={() =>
                      setImageDrawer((prev) => ({ ...prev, open: true }))
                    }
                  >
                    VIEW BILLS
                  </div>
                )}
              </div>

              <TripCard
                headerName="Expense date"
                value={moment(localState?.date).format('Do MMM,YYYY')}
                valueCss={css.startDate}
              />
              {/* <div /> */}
              <TripCard
                headerName="Submit date"
                value={moment().format('Do MMM,YYYY')}
                valueCss={css.submitDate}
              />
              {/* <TripCard
                headerName="Advance"
                value={IndianCurrency.format(localState?.advance || 0)}
                valueCss={css.advance}
              /> */}

              <TripCard
                headerName="Claimed"
                value={IndianCurrency.format(localState?.amount || 0)}
                valueCss={css.claimed}
              />
              {/* <div /> */}

              <TripCard
                headerName="To Pay"
                value={IndianCurrency.format(localState?.paid_amount || 0)}
                valueCss={css.toRecieve}
              />
            </div>
            <div className={css.reimbursementDetailsContainer}>
              {/*  Trip details */}
              {/* <div className={css.reimbursementCard}>
                <div className={css.containerOne}>
                  <p>Apr-23</p>
                  <p>Travel Expenses</p>
                </div>
                <div className={css.containerTwo}>
                  <p>Your Claim</p>
                  <p>₹2,000</p>
                </div>
              </div> */}
              <div className={css.vendorCard}>
                <div className={css.vendorCardLeft}>
                  <p>VENDOR</p>
                  <p>{localState?.vendor_name || '-'}</p>
                </div>
                {data?.client_id && (
                  <div className={css.vendorCardRight}>
                    <span>Billable</span>
                  </div>
                )}
              </div>
              {data?.client_id && (
                <div className={css.clientCard}>
                  <p>CLIENT</p>
                  <p>{localState?.client_name || '-'}</p>
                </div>
              )}
              <div className={css.descCard}>
                <p>Description</p>
                <p>{localState?.description || '-'} </p>
              </div>
            </div>
            <Stack sx={{ margin: '20px' }}>
              {(localState?.status === 'paid' ||
                localState?.status === 'partially_paid' ||
                localState?.status === 'declined') && (
                <CustomizedStepper
                  stepperList={localStateVal?.stepperData}
                  active={localStateVal?.stepperActive}
                />
              )}
            </Stack>

            <div className={css.footerBtn}>
              {location?.state?.tab === 'pending_payment' &&
                localState?.status !== 'paid' &&
                localState?.status !== 'partially_paid' && (
                  <div className={css.sectionTwo}>
                    <Button
                      disabled={allVoucherItemsVal?.length === 0}
                      onClick={() => {
                        if (userPermissions?.Payments?.Payment?.create_payment)
                          setDrawerState((d) => ({ ...d, proceedToPay: true }));
                        else setHavePermission(true);
                      }}
                      className={css.payBtn}
                    >
                      Pay Now
                    </Button>
                  </div>
                )}
              {location?.state?.tab !== 'pending_payment' &&
                localState?.status !== 'paid' &&
                localState?.status !== 'partially_paid' &&
                localState?.status !== 'approved' &&
                localState?.status !== 'declined' && (
                  <div className={css.sectionOne}>
                    <Button
                      className={css.rejectBtn}
                      onClick={() => {
                        if (
                          userPermissions?.Reimbursement?.[
                            'Reimbursement Claims'
                          ]?.cancel_reimbursement_claim
                        )
                          setDrawerState((d) => ({ ...d, rejectReason: true }));
                        else setHavePermission(true);
                      }}
                    >
                      Reject
                    </Button>

                    <Button
                      className={css.approveBtn}
                      onClick={() => {
                        if (
                          userPermissions?.Reimbursement?.[
                            'Reimbursement Claims'
                          ]?.approve_reimbursement_claim
                        )
                          dispatch(approveClaim(localState?.id));
                        else setHavePermission(true);
                      }}
                    >
                      Approve
                    </Button>
                  </div>
                )}
            </div>
          </div>

          <Dialog
            open={imageDrawer.open}
            onClose={() => setImageDrawer((prev) => ({ ...prev, open: false }))}
            PaperProps={{
              elevation: 3,
              style: {
                borderRadius: 16,
                padding: '16px',
              },
            }}
          >
            <ImageUpload
              localState={{
                ...imageDrawer.data,
                bill_details: {
                  url: localState?.file_url,
                  type: 'application/jpg',
                },
              }}
              style={{ height: '500px', width: '500px' }}
            />
          </Dialog>
        </>
      )}

      {havePermission && (
        <PermissionDialog onClose={() => setHavePermission(false)} />
      )}

      <SelectBottomSheet
        triggerComponent={<></>}
        open={drawerState.proceedToPay}
        name="proceedToPay"
        onClose={() => setDrawerState((d) => ({ ...d, proceedToPay: false }))}
        addNewSheet
      >
        <ProceedToPay
          onClose={(res) => {
            setDrawerState((d) => ({ ...d, proceedToPay: false }));
            if (res === 'success') navigate('/payment-history');
          }}
          paymentVoucharId={voucherVal?.id}
          // advancePaymentId={advPaymentId}
          // setMultiplePayments={setMultiplePayments}
          // setPaymentsResponse={setPaymentsResponse}
          showVerifyPassword={[drawerState, setDrawerState]}
          bankAccounts={bankAccountsVal}
          paidAmount={
            allVoucherItemsVal
              ?.map((a) => Number(a.amount) || 0)
              ?.reduce((a, b) => a + b, 0)
              ?.toFixed(2) || 0
          }
          payNow={{
            active: true,
            title: FormattedAmount(
              allVoucherItemsVal
                ?.map((a) => Number(a.amount) || 0)
                ?.reduce((a, b) => a + b, 0)
                ?.toFixed(2) || 0,
            ),
            subTitle: '',
          }}
          ShowTransForgPass={() => setTransacForgetPass(true)}
          payType={false}
        />
      </SelectBottomSheet>

      <SelectBottomSheet
        triggerComponent
        open={transacForgetPass}
        name="forgetPassword"
        hideClose
      >
        <ForgetPassword onClose={() => setTransacForgetPass(false)} />
      </SelectBottomSheet>

      <SelectBottomSheet
        triggerComponent={<></>}
        open={drawerState.rejectReason}
        name="rejectReason"
        onClose={() => setDrawerState((d) => ({ ...d, rejectReason: false }))}
        addNewSheet
      >
        <div className={css.reimbursementClaimContainerMobile}>
          <Typography className={css.headertitle}>
            Enter Reason for Rejection
          </Typography>
        </div>

        <Input
          required
          label="Description"
          variant="standard"
          name="description"
          multiline
          rows={3}
          onBlur={reValidate}
          InputLabelProps={{
            shrink: true,
          }}
          fullWidth
          theme="light"
          rootStyle={{
            border: '1px solid rgba(153, 158, 165, 0.39)',
            width: 'calc(100% - 60px)',
            margin: '30px',
          }}
          error={validationErr?.description}
          helperText={
            validationErr?.description ? 'Please Provide description' : ''
          }
          onChange={hanldeChange}
          value={rejectReason}
          // disabled={ShowType === 'view'}
        />
        <Stack alignItems="center" justifyContent="center" marginBottom="30px">
          <Button
            className={css.rejectReasonBtn}
            onClick={() => onsubmitReject()}
            disabled={!rejectReason}
          >
            Confirm & Deliver
          </Button>
        </Stack>
      </SelectBottomSheet>
    </>
  );
};

export default memo(ReimbursementClaimReview);
