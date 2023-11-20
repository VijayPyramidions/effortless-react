import React, { memo, useEffect, useState, useContext } from 'react';
import { useDispatch, useSelector } from 'react-redux';
import { useLocation, useNavigate } from 'react-router-dom';

import moment from 'moment';

import {
  approveClaim,
  rejectClaim,
  setApproveClaim,
  getReimbursementAdvances,
  tripAdjustAmount,
} from '@action/Store/Reducers/Reimbursement/ReimbursementState';
import trip_dash_line from '@assets/trip_dash_line.svg';

import {
  Stack,
  Typography,
  Button,
  useTheme,
  useMediaQuery,
  Avatar,
  Dialog,
  Box,
} from '@mui/material';
import { validateRequired } from '@services/Validation.jsx';
import Input from '@components/Input/Input.jsx';
import SelectBottomSheet from '@components/SelectBottomSheet/SelectBottomSheet';
import { FormattedAmount } from '@components/formattedValue/FormattedValue';

import AppContext from '@root/AppContext';
import { PermissionDialog } from '@components/Permissions/PermissionDialog';

import { CustomizedStepper } from './Components/ReimbursementActionSheets';
import ProceedToPay from '../PaymentView/shared/ProceedToPay';
import ForgetPassword from '../PaymentView/TransactionVerify/ForgetPassword';

import { IndianCurrency, IndianCurrencyNoSymbol } from '../../components/utils';
import { ImageUpload } from './Components/WithBill';
import * as css from './ReimbursementClaimReview.scss';
import AdvanceTable from './Components/AdvanceTable';

const TripCard = ({ headerName, value, valueCss }) => {
  return (
    <>
      <div className={`${css.tripCardDetails} ${valueCss}`} id="tripcard">
        <label htmlFor="tripcard">{headerName}</label>
        <p>{value}</p>
      </div>
    </>
  );
};

const ReimbursementTripClaimReview = ({
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
    approveResponse,
    tripExpense,
    voucher,
    allVoucherItems,
    reimbursementsAdvances,
    bankAccounts,
  } = useSelector((state) => state.Reimbursement);
  const dispatch = useDispatch();
  const location = useLocation();
  const navigate = useNavigate();

  const { userPermissions } = useContext(AppContext);

  // const [localState] = useState(location?.state?.item);
  const allVoucherItemsVal =
    allVoucherItems ||
    location?.state?.allVoucherItemsData ||
    allVoucherItemsValues;
  const voucherVal = voucher || location?.state?.voucherData || voucherValues;

  const bankAccountsVal =
    bankAccounts || location?.state?.bankAccountsData || bankAccountValues;

  const [drawerState, setDrawerState] = useState({});
  const [rejectReason, setRejectReason] = useState('');
  const [imageDrawer, setImageDrawer] = useState({ open: false });
  const [validationErr, setValidationErr] = useState({
    description: false,
  });
  const [payAmount, setPayAmount] = useState(0);
  const [adjustedAdvance, setAdjustedAdvance] = useState([]);
  const [localStateVal, setLocalState] = useState({});
  const [transacForgetPass, setTransacForgetPass] = useState(false);
  const [havePermission, setHavePermission] = useState(false);

  // const [advances, setAdvances] = useState([]);

  // const [fileUrl, setFileUrl] = useState('');

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
          id: tripExpense?.reimbursement_group?.id,
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
    if (
      tripExpense?.reimbursement_group?.employee_id &&
      tripExpense?.reimbursement_group?.status !== 'declined'
    )
      dispatch(
        getReimbursementAdvances({
          empId: tripExpense?.reimbursement_group?.employee_id,
          reimbursementId: tripExpense?.reimbursement_group?.id,
        }),
      );
  }, [tripExpense?.reimbursement_group]);

  useEffect(() => {
    setPayAmount(
      Number(tripExpense?.reimbursement_group?.claim_amount) -
        Number(tripExpense?.reimbursement_group?.advance_amount) <
        0
        ? 0
        : Number(tripExpense?.reimbursement_group?.claim_amount) -
            Number(tripExpense?.reimbursement_group?.advance_amount),
    );
  }, [tripExpense?.reimbursement_group]);

  useEffect(() => {
    if (adjustedAdvance.length > 0) {
      const amount =
        payAmount -
        adjustedAdvance
          ?.map((row) => Number(row.amount))
          ?.reduce((a, b) => a + b, 0);
      setPayAmount(amount < 0 ? 0 : amount);
    }
  }, [adjustedAdvance]);

  useEffect(() => {
    if (tripExpense?.reimbursement_group?.id) {
      let stepper;
      if (tripExpense?.reimbursement_group?.status === 'paid')
        stepper = {
          active: 3,
          showData: [
            {
              name: 'Submitted on',
              label: moment(
                tripExpense?.reimbursement_group?.claimed_on,
              )?.format('DD MMM YYYY'),
              id: 1,
              type: 'submit',
            },
            {
              name: 'Approved on',
              label: moment(
                tripExpense?.reimbursement_group?.approved_on,
              )?.format('DD MMM YYYY'),
              id: 2,
              type: 'approve',
              approvedBy:
                tripExpense?.reimbursement_group?.approver_details?.name || '-',
            },
            {
              name: 'Payment on',
              label: moment(tripExpense?.reimbursement_group?.paid_on)?.format(
                'DD MMM YYYY',
              ),
              id: 3,
              type: 'payment',
              status: 'paid',
            },
          ],
        };
      else if (tripExpense?.reimbursement_group?.status === 'partially_paid')
        stepper = {
          active: 3,
          showData: [
            {
              name: 'Submitted on',
              label: moment(
                tripExpense?.reimbursement_group?.claimed_on,
              )?.format('DD MMM YYYY'),
              id: 1,
              type: 'submit',
            },
            {
              name: 'Approved on',
              label: moment(
                tripExpense?.reimbursement_group?.approved_on,
              )?.format('DD MMM YYYY'),
              id: 2,
              type: 'approve',
              approvedBy:
                tripExpense?.reimbursement_group?.approver_details?.name || '-',
            },
            {
              name: 'Payment on',
              label: moment(tripExpense?.reimbursement_group?.paid_on)?.format(
                'DD MMM YYYY',
              ),
              id: 3,
              type: 'payment',
              status: 'partially_paid',
              paidamt: tripExpense?.reimbursement_group?.paid_amount || 0,
              balanceamt:
                tripExpense?.reimbursement_group?.amount -
                  tripExpense?.reimbursement_group?.paid_amount || 0,
            },
          ],
        };
      else if (tripExpense?.reimbursement_group?.status === 'declined')
        stepper = {
          active: 2,
          showData: [
            {
              name: 'Submitted on',
              label: moment(
                tripExpense?.reimbursement_group?.claimed_on,
              )?.format('DD MMM YYYY'),
              id: 1,
              type: 'submit',
            },
            {
              name: 'Rejected on',
              label: moment(
                tripExpense?.reimbursement_group?.cancelled_on,
              )?.format('DD MMM YYYY'),
              id: 2,
              reason:
                tripExpense?.reimbursement_group?.reject_reason ||
                'Contact your manager.',
              type: 'declined',
              rejectedBy:
                tripExpense?.reimbursement_group?.canceller_details?.name ||
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
  }, [tripExpense?.reimbursement_group]);

  return (
    <>
      {/* {desktopView ? ( */}
      <>
        <div className={css.reimbursementClaimContainerMobile}>
          <Typography className={css.headertitle}>Claim Review</Typography>
          <div className={css.header}>
            <div className={css.nameContainer}>
              <Avatar
                className={css.orgAvatar}
                src={`https://api.dicebear.com/7.x/initials/svg?seed=${
                  (tripExpense?.data && tripExpense?.data[0]?.employee_name) ||
                  (tripExpense?.reimbursement_group &&
                    tripExpense?.reimbursement_group?.employee_name) ||
                  '-'
                }&chars=2`}
              />
              <Typography className={css.nameContainerText}>
                {(tripExpense?.data && tripExpense?.data[0]?.employee_name) ||
                  (tripExpense?.reimbursement_group &&
                    tripExpense?.reimbursement_group?.employee_name) ||
                  '-'}
              </Typography>
            </div>
          </div>
          <div className={`${css.detailsCard} ${css.grid3}`}>
            <TripCard
              headerName="Trip Name"
              value={tripExpense?.reimbursement_group?.name || '-'}
              valueCss={css.tripValue}
            />
            <div />
            <div>
              {/* {!!data?.file_url && ( */}
              {/* <div
                className={css.viewBills}
                onClick={() =>
                  setImageDrawer((prev) => ({ ...prev, open: true }))
                }
              >
                VIEW BILLS
              </div> */}
              {/* )} */}
            </div>

            <TripCard
              headerName="Start date"
              value={moment(
                tripExpense?.reimbursement_group?.start_date,
              ).format('Do MMM,YYYY')}
              valueCss={css.startDate}
            />
            <Stack justifyContent="center" padding="12px">
              <img src={trip_dash_line} alt="dash" />
            </Stack>
            <TripCard
              headerName="End date"
              value={moment(data?.end_date).format('Do MMM,YYYY')}
              valueCss={css.submitDate}
            />
            <TripCard
              headerName="Advance"
              value={IndianCurrency.format(
                tripExpense?.reimbursement_group?.advance_amount || 0,
              )}
              valueCss={css.advance}
            />
            <TripCard
              headerName="Claimed"
              value={
                // tab === 'pending_payment'
                //   ?
                IndianCurrency.format(
                  tripExpense?.reimbursement_group?.claim_amount || 0,
                )
                // : IndianCurrency.format(0)
              }
              valueCss={css.claimed}
            />

            <TripCard
              headerName="To Receive"
              value={
                tripExpense?.reimbursement_group?.advance_amount !== 0 &&
                Number(tripExpense?.reimbursement_group?.claim_amount) -
                  Number(tripExpense?.reimbursement_group?.advance_amount) <
                  0
                  ? `( ${IndianCurrency.format(
                      Math.abs(
                        Number(tripExpense?.reimbursement_group?.claim_amount) -
                          Number(
                            tripExpense?.reimbursement_group?.advance_amount,
                          ),
                      ) || 0,
                    )} )`
                  : IndianCurrency.format(
                      tripExpense?.reimbursement_group?.advance_amount !== 0
                        ? Number(
                            tripExpense?.reimbursement_group?.claim_amount,
                          ) -
                            Number(
                              tripExpense?.reimbursement_group?.advance_amount,
                            )
                        : 0,
                    )
              }
              valueCss={css.toRecieve}
            />
          </div>

          <div className={css.reimbursementDetailsContainer}>
            {tripExpense?.data?.map((val) => (
              <Box
                className={css.tripexpensecard}
                component={Stack}
                gap="8px"
                key={val?.reimbursement_id}
              >
                <Stack gap="8px" direction="row">
                  <Typography className={css.datefield}>
                    {moment(val?.date)?.format('DD-MM-YYYY')}
                  </Typography>
                  <Typography className={css.expensefiled}>
                    {val?.name}
                  </Typography>
                </Stack>
                <Stack gap="8px" direction="row">
                  <Typography className={css.lefttext}>Your Claim:</Typography>
                  <Typography className={css.amounttext}>
                    {val?.amount}
                  </Typography>
                </Stack>
                <Typography className={css.descriptiontext}>
                  <span className={css.lefttext} style={{ marginRight: '8px' }}>
                    Description:
                  </span>
                  {val?.description}
                </Typography>

                {!!val?.file_url && (
                  <div className={css.cardaction}>
                    <Typography
                      className={css.viewbill}
                      component={Button}
                      onClick={() => {
                        setImageDrawer((prev) => ({
                          ...prev,
                          open: true,
                          data: {
                            bill_details: {
                              url: val?.file_url,
                              type: 'application/jpg',
                            },
                          },
                        }));
                      }}
                    >
                      View Bill
                    </Typography>
                  </div>
                )}
              </Box>
            ))}
          </div>
          {(tab === 'pending_payment' ||
            location?.state?.tab === 'pending_payment') &&
            tripExpense?.reimbursement_group?.status !== 'paid' &&
            tripExpense?.reimbursement_group?.status !== 'partially_paid' &&
            reimbursementsAdvances.length > 1 && (
              <Stack className={css.advancetable}>
                <AdvanceTable
                  onChange={(row) =>
                    setAdjustedAdvance((prev) => [...prev, row])
                  }
                  value={reimbursementsAdvances?.map((item) => ({
                    date: item.date,
                    description: item.trip_name,
                    amount: item.amount,
                  }))}
                  reimbursementId={tripExpense?.reimbursement_group?.id}
                />
              </Stack>
            )}
          <div className={css.footerBtn}>
            {(tab === 'pending_payment' ||
              location?.state?.tab === 'pending_payment') &&
            tripExpense?.reimbursement_group?.status !== 'paid' &&
            tripExpense?.reimbursement_group?.status !== 'partially_paid' ? (
              <div className={`${css.paynowContainer} ${css.active}`}>
                <div className={css.subContainer}>
                  <div>
                    <p className={css.title}>
                      {IndianCurrencyNoSymbol.format(payAmount)}
                    </p>
                    <p className={css.subTitle}> Amount</p>
                  </div>
                </div>
                <Button
                  className={css.paynow}
                  disabled={payAmount !== 0 && allVoucherItemsVal?.length === 0}
                  onClick={() => {
                    if (payAmount === 0)
                      dispatch(
                        tripAdjustAmount(tripExpense?.reimbursement_group?.id),
                      );
                    else if (userPermissions?.Payments?.Payment?.create_payment)
                      setDrawerState((d) => ({ ...d, proceedToPay: true }));
                    else setHavePermission(true);
                  }}
                >
                  <p>{payAmount === 0 ? 'Adjust' : 'Pay Now'}</p>
                </Button>
              </div>
            ) : (
              <>
                {tripExpense?.reimbursement_group?.status !== 'paid' &&
                  tripExpense?.reimbursement_group?.status !==
                    'partially_paid' &&
                  tripExpense?.reimbursement_group?.status !== 'approved' &&
                  tripExpense?.reimbursement_group?.status !== 'declined' && (
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
                            dispatch(
                              approveClaim(
                                tripExpense?.reimbursement_group?.id,
                              ),
                            );
                          else setHavePermission(true);
                        }}
                      >
                        Approve
                      </Button>
                    </div>
                  )}
                {(tripExpense?.reimbursement_group?.status === 'paid' ||
                  tripExpense?.reimbursement_group?.status ===
                    'partially_paid' ||
                  tripExpense?.reimbursement_group?.status === 'approved' ||
                  tripExpense?.reimbursement_group?.status === 'declined') && (
                  <CustomizedStepper
                    stepperList={localStateVal?.stepperData}
                    active={localStateVal?.stepperActive}
                  />
                )}
              </>
            )}
          </div>
        </div>
      </>

      {havePermission && (
        <PermissionDialog onClose={() => setHavePermission(false)} />
      )}

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

      {/* <Dialog
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
          localState={imageDrawer.data}
          style={{ height: '500px', width: '500px' }}
        />
      </Dialog> */}

      <SelectBottomSheet
        triggerComponent={<></>}
        open={drawerState.proceedToPay}
        name="proceedToPay"
        onClose={() => setDrawerState((d) => ({ ...d, proceedToPay: false }))}
        addNewSheet
      >
        <>
          <ProceedToPay
            onClose={(res) => {
              if (desktopView) {
                handleDrawer('claimReview', false);
              } else {
                navigate('/reimbursement-approval');
              }
              setDrawerState((d) => ({ ...d, proceedToPay: false }));
              if (res === 'success') navigate('/payment-history');
            }}
            paymentVoucharId={voucherVal?.id}
            // advancePaymentId={advPaymentId}
            // setMultiplePayments={setMultiplePayments}
            // setPaymentsResponse={setPaymentsResponse}
            showVerifyPassword={[drawerState, setDrawerState]}
            bankAccounts={bankAccountsVal}
            paidAmount={payAmount}
            payNow={{
              active: true,
              title: FormattedAmount(payAmount),
              // title: FormattedAmount(
              //   allVoucherItemsVal
              //     ?.map((a) => Number(a.amount) || 0)
              //     ?.reduce((a, b) => a + b, 0)
              //     ?.toFixed(2) || 0,
              // ),
              subTitle: '',
            }}
            ShowTransForgPass={() => setTransacForgetPass(true)}
            payType={false}
            forgetYes
          />
        </>
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

export default memo(ReimbursementTripClaimReview);
